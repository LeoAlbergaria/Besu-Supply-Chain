// scripts/latencyOne.ts
// SPDX-License-Identifier: MIT
import { ethers } from "hardhat";

// --- Hardcoded PATO address (your request) ---
const PATO_ADDRESS = "0xc90319832813d3a862bD11B41eD99742202ce398";

// Besu private network = gas free
const GAS_FREE = { gasPrice: 0n };
const POLL_MS = Number(process.env.POLL_MS ?? 250);
const TIMEOUT_MS = Number(process.env.TIMEOUT_MS ?? 20000);

const PATO_ABI = [
  "function addEvent(string,string,string) external",
  "function getEvents() view returns (tuple(string jsonEvent, string timeEvent, string typeEvent)[])",
];

function nowNs() { return process.hrtime.bigint(); }
function nsToSec(ns: bigint) { return Number(ns) / 1_000_000_000; }

async function getCaller() {
  const pk = process.env.PRIVATE_KEY;
  if (pk && pk.startsWith("0x") && pk.length > 42) {
    return new ethers.Wallet(pk, ethers.provider);
  }
  const [s] = await ethers.getSigners();
  return s;
}

async function main() {
  const caller = await getCaller();
  const callerAddr = await caller.getAddress();

  // sanity check
  const code = await ethers.provider.getCode(PATO_ADDRESS);
  if (code === "0x") throw new Error(`No bytecode at ${PATO_ADDRESS} (wrong network?)`);

  const pato = new ethers.Contract(PATO_ADDRESS, PATO_ABI, caller);

  // snapshot baseline count
  let baseCount = 0;
  try {
    const before = await pato.getEvents();
    baseCount = before.length;
  } catch {
    baseCount = 0;
  }

  const EVENT_TIME = new Date().toISOString();
  const TYPE_EVENT = "Shipping";
  const JSON_EVENT = JSON.stringify({ eventTime: EVENT_TIME, run: 1 });

  console.log(`Caller: ${callerAddr}`);
  console.log(`PATO:   ${PATO_ADDRESS}`);

  // --- send event ---
  const tSubmit = nowNs();
  const tx = await pato.addEvent(EVENT_TIME, TYPE_EVENT, JSON_EVENT, GAS_FREE);
  const receipt = await tx.wait();
  const tMined = nowNs();

  // --- poll until visible ---
  let visible = false;
  const deadline = Date.now() + TIMEOUT_MS;
  while (Date.now() < deadline) {
    try {
      const list: Array<{ jsonEvent: string; timeEvent: string; typeEvent: string }> = await pato.getEvents();
      if (list.length >= baseCount + 1) {
        const last = list[list.length - 1];
        if (last.timeEvent === EVENT_TIME && last.typeEvent === TYPE_EVENT && last.jsonEvent === JSON_EVENT) {
          visible = true;
          break;
        }
      }
    } catch {}
    await new Promise(r => setTimeout(r, POLL_MS));
  }
  const tReadable = nowNs();

  const submitToMined = nsToSec(tMined - tSubmit);
  const minedToReadable = nsToSec(tReadable - tMined);
  const submitToReadable = nsToSec(tReadable - tSubmit);

  console.log(`\ntxHash: ${receipt.hash}`);
  console.log(`submit→mined_sec:     ${submitToMined.toFixed(3)}s`);
  console.log(`mined→readable_sec:   ${visible ? minedToReadable.toFixed(3) + "s" : "NaN"}`);
  console.log(`submit→readable_sec:  ${visible ? submitToReadable.toFixed(3) + "s" : "NaN"}${visible ? "" : " (NOT visible within timeout)"}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
