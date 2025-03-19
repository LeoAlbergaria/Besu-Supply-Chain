// scripts/deployENS.js
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy do contrato ENSRegistry
  const ENSRegistry = await ethers.getContractFactory("ENSRegistry");
  const ensRegistry = await ENSRegistry.deploy();
  await ensRegistry.deployed();
  console.log("ENSRegistry deployed at:", ensRegistry.address);

  // Deploy do contrato PublicResolver
  // Muitas vezes o PublicResolver exige como parâmetro o endereço do ENSRegistry
  const PublicResolver = await ethers.getContractFactory("PublicResolver");
  const publicResolver = await PublicResolver.deploy(ensRegistry.address);
  await publicResolver.deployed();
  console.log("PublicResolver deployed at:", publicResolver.address);

  // Opcional: Configurar registros
  // Por exemplo, você pode querer configurar um domínio raiz ou subdomínio,
  // definindo o resolver para um nome específico.
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Erro no deploy:", error);
    process.exit(1);
  });