// scripts/addEvents_multi.ts
import { ethers } from "hardhat";

// ====================== CONFIG ======================
const N_SENDERS = 2;                // how many distinct senders (users)
const EVENTS_PER_SENDER = 10;    // txs each sender will submit
const WINDOW = 64;                  // max in-flight nonce gap per sender (64–128 is safe)
const POLL_MS = 50;                 // how often to re-check pending nonce
const LOG_EVERY = 500;              // progress log interval per sender
const SEND_DELAY_MS = 0;            // small pacing between sends (0 = off)

// gas settings (gas-free Besu)
const GAS_PRICE = 0n;
const GAS_BUFFER_PCT = 30;          // +30% over estimate
const GAS_FALLBACK = 500_000n;      // fallback gas limit if estimate fails

// Contract discovery (same as your single-sender script)
const PRODUCT_ADDRESS = "0x2F5F87e5805ee020093BC2d09482DC61EaA63540";
const ORG_ADDRESS     = "0x639347d9232056630724512c5a5263c2A52C473a";
const ADDRESS_ZERO    = "0x0000000000000000000000000000000000000000";

// Payload
const EVENT_TIME = "2025-03-19T12:00:00Z";
const TYPE_EVENT = "Shipping";
const JSON_EVENT = JSON.stringify({
  eventTime: EVENT_TIME,
  eventTimeZoneOffset: "+00:00",
  epcList: ["urn:epc:id:sgtin:0614141.107346.2017"],
  bizStep: "urn:epcglobal:cbv:bizstep:shipping",
  disposition: "urn:epcglobal:cbv:disp:in_transit",
  readPoint: { id: "urn:epc:id:sgln:0614141.07346.1234" },
  bizLocation: { id: "urn:epc:id:sgln:0614141.07346.0" },
  bizTransactionList: [
    { type: "urn:epcglobal:cbv:btt:po", id: "http://transaction.acme.com/po/12345678" }
  ]
});
// ====================================================

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function makeSendWorker(
  pato: any,
  signer: any,
  gasLimit: bigint,
  senderLabel: string
) {
  const from: string = await signer.getAddress();
  let nextNonce: number = await ethers.provider.getTransactionCount(from, "pending");
  let sent = 0;
  let submitted: number[] = []; // nonces sent but not yet cleared

  const baseOverrides: any = { gasPrice: GAS_PRICE };

  console.log(`[${senderLabel}] from=${from} startNonce(pending)=${nextNonce} window=${WINDOW}`);

  while (sent < EVENTS_PER_SENDER) {
    // backpressure: keep at most WINDOW nonces ahead of pending head
    const pendingHead = await ethers.provider.getTransactionCount(from, "pending");
    // drop any nonces older than pending
    submitted = submitted.filter((n) => n >= pendingHead);

    if (submitted.length >= WINDOW) {
      await sleep(POLL_MS);
      continue;
    }

    const myNonce = nextNonce++;
    submitted.push(myNonce);
    sent++;

    pato.connect(signer).addEvent(EVENT_TIME, TYPE_EVENT, JSON_EVENT, {
      ...baseOverrides,
      gasLimit,
      nonce: myNonce
    }).catch((err: any) => {
      const msg = err?.error?.message ?? err?.data?.message ?? err?.message ?? String(err);
      console.error(`❌ [${senderLabel}] send error idx=${sent} nonce=${myNonce}: ${msg}`);
      process.exit(1);
    });

    if (SEND_DELAY_MS) await sleep(SEND_DELAY_MS);
    if (sent % LOG_EVERY === 0) {
      console.log(`[${senderLabel}] sent ${sent}/${EVENTS_PER_SENDER}`);
    }
  }

  console.log(`✅ [${senderLabel}] finished ${EVENTS_PER_SENDER} txs`);
}

async function main() {
  // Resolve PATO
  const product = await ethers.getContractAt("Product", PRODUCT_ADDRESS);
  const patoAddr: string = await product.getProductAtOrganization(ORG_ADDRESS);
  if (!patoAddr || patoAddr === ADDRESS_ZERO) {
    throw new Error("No ProductAtOrganization exists for the given organization address.");
  }
  const pato = await ethers.getContractAt("ProductAtOrganization", patoAddr);

  // Use N distinct signers
  // Option A: take the first N accounts from Hardhat (works if hardhat.config has many accounts)
  const allSigners = await ethers.getSigners();
  if (allSigners.length < N_SENDERS) {
    throw new Error(`Need at least ${N_SENDERS} accounts in Hardhat for this test.`);
  }
  const senders = allSigners.slice(0, N_SENDERS); // or pick any N you want

  // (Optional) If you prefer explicit keys: create ethers.Wallet(privateKey, ethers.provider) for each

  // One-time gas estimate with the FIRST signer, add buffer, reuse for all
  let gasLimit: bigint;
  try {
    const from0 = await senders[0].getAddress();
    const est: bigint = await pato.connect(senders[0]).estimateGas.addEvent(
      EVENT_TIME, TYPE_EVENT, JSON_EVENT, { from: from0 }
    );
    gasLimit = (est * BigInt(100 + GAS_BUFFER_PCT)) / 100n;
    console.log(`gas estimate: ${est} | using +${GAS_BUFFER_PCT}% => ${gasLimit}`);
  } catch {
    gasLimit = GAS_FALLBACK;
    console.warn(`⚠️ estimateGas failed; using fallback gasLimit=${gasLimit}`);
  }

  console.log(`Starting load: ${N_SENDERS} senders × ${EVENTS_PER_SENDER} = ${N_SENDERS * EVENTS_PER_SENDER} txs`);
  console.log(`Contract: PATO ${patoAddr}`);

  // Create a worker per sender
  const workers = senders.map((s, i) => makeSendWorker(pato, s, gasLimit, `S${i + 1}`));
  await Promise.all(workers);

  console.log("🎉 All senders finished.");
}

main().then(
  () => process.exit(0),
  (e) => { console.error(e); process.exit(1); }
);
