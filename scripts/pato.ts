import { ethers } from  "hardhat";
import { transferLink } from "./transfer_link";

export async function enablePipelinePATO(
    productAddress: string,
    orgAddress: string,
    url: string,
    createPipelineJobId: string,
) {
    console.log("///////////////////////////////")

    const tokenLink: string = "0x779877A7B0D9E8603169DdbD7836e478b4624789";

    const productContract = await ethers.getContractAt("Product", productAddress);
    const patoAddress = await productContract.getProductAtOrganization(orgAddress);

    await transferLink(tokenLink, patoAddress)
    // const jobIdBytes32 = ethers.keccak256(ethers.toUtf8Bytes(createPipelineJobId));
    const jobIdBytes32 = "0x6131363263333430633438353463666262303732633530353139646535613066"

    const patoContract = await ethers.getContractAt("ProductAtOrganization", patoAddress);
    const tx = await patoContract.EnablePipeline(
        url, 
        jobIdBytes32
    );

    const txReceipt = await tx.wait();

    if (!txReceipt) {
        throw new Error("Falha ao obter o receipt da transação.");
    }

    const gasUsed = txReceipt.gasUsed; 
    const gasPrice = tx.gasPrice;

    const totalCostWei = gasUsed * gasPrice;
    const totalCostEther = ethers.formatEther(totalCostWei);

    console.log(`Custo do aceite da organização: \n Organização: ${orgAddress} \n Custo: ${totalCostEther} ETH`);

    console.log("///////////////////////////////")
}
