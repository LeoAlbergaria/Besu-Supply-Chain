import { ethers } from "hardhat";

export async function deployOrganization(url: string, name: string) {
    console.log("///////////////////////////////")

    const OrganizationContract = await ethers.getContractFactory("Organization");
    
    const organization1 = await OrganizationContract.deploy(
        url,
        name,
    );
    if (!organization1) {
        throw new Error("Falha ao obter o receipt da transação.");
    }
    const deploymentTransaction = await organization1.deploymentTransaction()
    if (!deploymentTransaction) {
        throw new Error("Falha ao obter o receipt da transação.");
    }

    const txReceipt = await deploymentTransaction.wait();
    if (!txReceipt) {
        throw new Error("Falha ao obter o receipt da transação.");
    }

    const gasUsed = txReceipt.gasUsed; 
    const gasPrice = deploymentTransaction.gasPrice;

    const totalCostWei = gasUsed * gasPrice;
    const totalCostEther = ethers.formatEther(totalCostWei);

    const orgAddress = await organization1.getAddress()

    console.log(`Custo do deploy da organização: \n Address: ${orgAddress} \n Custo: ${totalCostEther} ETH`);
    console.log("///////////////////////////////")

    return orgAddress;
}

// export async function deploySelfOrganization(url: string, name: string) {
//   console.log("///////////////////////////////");

//   const orgPrivateKey = "0xe18414ceb180a62508d31eb2cc206885f7351a3afa096aefcf880617e13a6805";
//   const provider = ethers.provider;
//   const orgSigner = new ethers.Wallet(orgPrivateKey, provider);

//   const OrganizationContract = await ethers.getContractFactory("Organization", orgSigner);
//   const organization1 = await OrganizationContract.deploy(url, name);

//   const deploymentTransaction = organization1.deploymentTransaction();
//   if (deploymentTransaction === null) {
//     throw new Error("Falha ao obter a transação de deploy.");
//   }

//   const txReceipt = await deploymentTransaction.wait();
//     if (txReceipt === null) {
//     throw new Error("Falha ao obter a transação de deploy.");
//   }

//   const gasUsed = txReceipt.gasUsed;
//   const gasPrice = deploymentTransaction.gasPrice;
//   const totalCostWei = gasUsed * gasPrice;
//   const totalCostEther = ethers.formatEther(totalCostWei);

//   const orgAddress = await orgSigner.getAddress();

//   console.log(`Custo do deploy da organização: \n Address: ${orgAddress} \n Custo: ${totalCostEther} ETH`);
//   console.log("///////////////////////////////");

//   return orgAddress;
// }