import { ethers } from "hardhat";

export async function deploySupplyChain(orgArray: string[], productType: string) {

    const RegistryFactory = await ethers.getContractFactory("SupplyChainRegistry");
    const registry = await RegistryFactory.deploy();

    const registryTx = await registry.deploymentTransaction();
    if (!registryTx) throw new Error("Failed to get deployment transaction for registry.");
    await registryTx.wait();

    const registryAddress = await registry.getAddress()

    const SupplyChainContract = await ethers.getContractFactory("SupplyChain");

    const supplychain = await SupplyChainContract.deploy(
        orgArray,
        productType,
        registryAddress
    );
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

    const supplyChainAddress = await supplychain.getAddress();
    const supplyChainProductType = await supplychain.productType();
    const participationManager = await supplychain.participationManagerAddress();
    const supplychainRegistry = await supplychain.registryAddress();
    const deployedProducts = await supplychain.getDeployedProducts();

    console.log("///////////////////////////////")
    console.log("SupplyChain Deployed");
    console.log(" Address:", supplyChainAddress);
    console.log(" Product Type:", supplyChainProductType);
    console.log(" Participation Manager Address:", participationManager);
    console.log(" Registry Address:", supplychainRegistry);
    console.log(" Deployed Products:", deployedProducts);
    console.log("///////////////////////////////\n")

    console.log("///////////////////////////////");
    console.log("Registry Deployed");
    console.log(" Address:", registryAddress);
    for (const org of orgArray) {
        const registered = await registry.getAllMySupplyChains();
        console.log(` OrganizationAddress ${org} -> SupplyChainAddress:`, registered);
    }
    console.log("///////////////////////////////\n");

    return supplyChainAddress;
}

export async function acceptParticipation(orgAddress: string, supplyChainAddress: string) {

    const supplyChainContract = await ethers.getContractAt("SupplyChain", supplyChainAddress);
    const tx = await supplyChainContract.acceptParticipation(orgAddress);
    const txReceipt = await tx.wait()
    if (!txReceipt) {
        throw new Error("Falha ao obter o receipt da transação.");
    }

    console.log("///////////////////////////////")
    console.log("Org Accepted:", orgAddress);
    console.log("///////////////////////////////\n")
}
