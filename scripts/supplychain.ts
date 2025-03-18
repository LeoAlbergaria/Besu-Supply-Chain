import { ethers } from "hardhat";

export async function deploySupplyChain(orgArray: string[], productType: string) {
    console.log("///////////////////////////////")

    const SupplyChainContract = await ethers.getContractFactory("SupplyChain");

    const supplychain = await SupplyChainContract.deploy(
        orgArray,
        productType
    );

    // await supplychain.waitForDeployment();
    if (!supplychain) {
        throw new Error("Falha ao obter o receipt da transação.");
    }
    const deploymentTransaction = await supplychain.deploymentTransaction()
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

    const supplyChainAddress = await supplychain.getAddress()

    console.log(`Custo do deploy da supplyChain: \n Address: ${supplyChainAddress} \n Custo: ${totalCostEther} ETH`);

    console.log("///////////////////////////////")

    return supplyChainAddress;
}


export async function acceptParticipation(orgAddress: string, supplyChainAddress: string) {
    console.log("///////////////////////////////")

    const supplyChainContract = await ethers.getContractAt("SupplyChain", supplyChainAddress);
    const tx = await supplyChainContract.acceptParticipation(orgAddress);
    const txReceipt = await tx.wait()

    if (!txReceipt) {
        throw new Error("Falha ao obter o receipt da transação.");
    }

    const gasUsed = txReceipt.gasUsed; 
    const gasPrice = tx.gasPrice;

    const totalCostWei = gasUsed * gasPrice;
    const totalCostEther = ethers.formatEther(totalCostWei);

    console.log(`Custo do aceite da organização: \n Organização: ${orgAddress} \n Custo: ${totalCostEther} ETH`);

    console.log("///////////////////////////////")


    // console.log("Organization accepted:", orgAddress)
}
