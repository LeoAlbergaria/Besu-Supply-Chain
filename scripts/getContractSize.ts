const { ethers } = require("hardhat");

async function main() {
  const address = "0xc90319832813d3a862bD11B41eD99742202ce398";

  const code = await ethers.provider.getCode(address);
  const size = (code.length - 2) / 2; // subtract "0x" and divide by 2
  console.log(`Contract size: ${size} bytes`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
