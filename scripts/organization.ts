import { ethers } from "hardhat";

export async function deployOrganization(url: string, name: string) {
    console.log("///////////////////////////////")

    const OrganizationContract = await ethers.getContractFactory("Organization");

    const organization = await OrganizationContract.deploy(
        url,
        name,
    );
    if (!organization) {
        throw new Error("Falha ao obter o receipt da transação.");
    }

    const deploymentTransaction = await organization.deploymentTransaction()
    if (!deploymentTransaction) {
        throw new Error("Falha ao obter o receipt da transação.");
    }

    const txReceipt = await deploymentTransaction.wait();
    if (!txReceipt) {
        throw new Error("Falha ao obter o receipt da transação.");
    }

    // const gasUsed = txReceipt.gasUsed; 

    const orgAddress = await organization.getAddress()
    const orgInfo = await organization.getInfo();
    const owner = await organization.owner();

    console.log("Organization Deployed");
    console.log(" Address:", orgAddress);
    console.log(" Owner:", owner);
    console.log(" Company Name:", orgInfo.companyName);
    console.log(" Company URL:", orgInfo.urlCompany);
    console.log(" Enabled:", orgInfo.isEnabled);
    console.log("///////////////////////////////\n")

    return orgAddress;
}