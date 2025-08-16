// scripts/addEvents.ts
import { ethers } from "hardhat";

async function main() {
  // --- Addresses ---
  const productAddress = "0x1B937A0558E0096DF90a368d0996b04ef1E1F55B";
  const orgAddress = "0x01a582143958a6369615981C631a3c7fC184b579";
  const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

  // --- Contracts ---
  const product = await ethers.getContractAt("Product", productAddress);
  const patoAddress: string = await product.getProductAtOrganization(orgAddress);
  if (!patoAddress || patoAddress === ADDRESS_ZERO) {
    throw new Error("No ProductAtOrganization exists for the given organization address.");
  }
  const pato = await ethers.getContractAt("ProductAtOrganization", patoAddress);

  // --- Signer & Nonce (provider-based; works on v5/v6) ---
  const [signer] = await ethers.getSigners();
  const from = await signer.getAddress();
  let nonce = await ethers.provider.getTransactionCount(from, "pending");

  // --- Besu gas config (set to nonzero if your chain charges gas) ---
  const txOverrides: any = {
    gasPrice: 0,                 // Besu often OK with gasPrice = 0
    // If your RPC enforces EIP-1559, use these instead:
    // maxFeePerGas: 0,
    // maxPriorityFeePerGas: 0,
  };

  // --- Mock EPCIS-like payload ---
  const eventTime = "2025-03-19T12:00:00Z";
  const typeEvent = "Shipping";
  const jsonEvent = JSON.stringify({
    eventTime: "2025-03-19T12:00:00Z",
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

  const NUM_EVENTS = 10;
  console.log(`Submitting ${NUM_EVENTS} events to PATO ${patoAddress}…`);
  console.log(`From: ${from} | starting nonce (pending): ${nonce}`);

  // --- Submit sequentially (reliable) ---
  for (let i = 0; i < NUM_EVENTS; i++) {
    try {
      console.log(`Submitting event ${i + 1}/${NUM_EVENTS} at ${eventTime} (${typeEvent})…`);

      const tx = await pato
        .connect(signer)
        .addEvent(eventTime, typeEvent, jsonEvent, {
          ...txOverrides,
          nonce: nonce++,
          // gasLimit: 300000, // uncomment if you want to pin a limit
        });

      console.log(`  -> sent: ${tx.hash}`);
      // If you want to wait for mining, uncomment:
      // await tx.wait();
    } catch (err: any) {
      const msg =
        err?.error?.message ??
        err?.data?.message ??
        err?.message ??
        String(err);
      console.error(`❌ Error on event ${i + 1}: ${msg}`);
      process.exit(1);
    }
  }

  console.log(`✅ All ${NUM_EVENTS} events submitted!`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
