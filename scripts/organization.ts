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

