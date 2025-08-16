import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();
  const me = await signer.getAddress();
  const bal = await ethers.provider.getBalance(me);
  console.log("Address:", me);
  console.log("Balance (wei):", bal.toString());

  // Legacy gas (works on most Besu/IBFT)
  const gasLimit = 21000n;
  const gasPrice = 1n; // wei
  const needed = gasLimit * gasPrice;
  console.log("Needed for one cancel tx (wei):", needed.toString());
  console.log("Enough?", bal >= needed);
}

main().catch(e => { console.error(e); process.exit(1); });