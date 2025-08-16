import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();
  const signerAddress = await signer.getAddress();

  // 🔗 Endereços já implantados
  const productAddress = "0x0B2767a57b93d0A8f5BC60A33F8b73A8919d6999";
  const org1Address = "0xad35237ddB00C32247dc24E8123ec4B2E995A8Cd";
  const org2Address = "0xc9b4046Dd7DA7B64d3240D3261479a832444a972";

  console.log(`🧾 Signer em uso: ${signerAddress}`);

  // 📦 Instanciar contrato Product
  const Product = await ethers.getContractAt("Product", productAddress);

  // 👤 Verificar se o signer é o manager atual
  const currentManager = await Product.manager();
  console.log("👤 Manager atual:", currentManager);

  // ✅ 1. Solicitar transferência para o próprio endereço (simulando novo gerente)
  const requestTx = await Product.connect(signer).requestOwnershipTransfer(signerAddress);
  await requestTx.wait();
  console.log("✔ Transferência solicitada para o próprio endereço.");

  // ✅ 2. Aprovar a transferência informando a nova organização
  const approveTx = await Product.connect(signer).approveOwnershipTransfer(org2Address);
  await approveTx.wait();
  console.log("✔ Transferência aprovada com a nova organização.");

  // 📜 3. Exibir histórico de propriedade
  const history = await Product.getOwnershipHistory();
  console.log("📜 Histórico de propriedade:");
  for (let i = 0; i < history.length; i++) {
    const entry = history[i];
    console.log(`→ Manager: ${entry.manager}, desde: ${entry.startTime}`);
  }

  // 🧭 4. Mostrar novo ProductAtOrganization
  const patoAddress = await Product.getProductAtOrganization(org2Address);
  console.log("📍 Novo ProductAtOrganization:", patoAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
