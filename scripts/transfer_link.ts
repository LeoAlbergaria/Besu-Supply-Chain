import { ethers } from "hardhat";

export async function transferLink(tokenLinkAddress: string, receiverAddress: string) {
    const [sender] = await ethers.getSigners();

    const linkToken = await ethers.getContractAt("IERC677", tokenLinkAddress);

    const amount = ethers.parseUnits("10", 18); // 10 LINK

    console.log(`Transferring ${ethers.formatUnits(amount, 18)} LINK to ${receiverAddress}`);

    const tx = await linkToken.transfer(receiverAddress, amount);
    const txReceipt = await tx.wait();
    if (!txReceipt) {
        throw new Error("Falha ao obter o receipt da transação.");
    }

    const gasUsed = txReceipt.gasUsed; 
    const gasPrice = tx.gasPrice;

    const totalCostWei = gasUsed * gasPrice;
    const totalCostEther = ethers.formatEther(totalCostWei);

    console.log(`Custo da transferencia de token: \n Custo: ${totalCostEther} ETH`);
    console.log("Transfer completed!");

    console.log("///////////////////////////////")
}
