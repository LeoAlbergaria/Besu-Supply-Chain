import { ethers } from "hardhat";

export async function deployProduct(
    supplyChainAddress: string,
    name: string, 
    productId: string, 
    organizationAddress: string
) {

    const [deployer] = await ethers.getSigners();

    console.log("Deploy by account:", deployer.address);
    console.log("///////////////////////////////")

    const supplyChainContract = await ethers.getContractAt("SupplyChain", supplyChainAddress);

    // Defina a interface do evento
    const eventInterface = new ethers.Interface([
        "event ProductCreated(address indexed contractAddress)"
    ]);

    const tx = await supplyChainContract.NewProduct(
        name,
        productId,
        organizationAddress
    );

    const receipt = await tx.wait();
    if (!receipt) {
        throw new Error("sem resposta da transação");
    }
    
    // Procura o log do evento "ContractCreated"
    const eventLog = receipt.logs.find((log) => {
        try {
            const parsedLog = eventInterface.parseLog(log);
            if (!parsedLog) {
                throw new Error("sem resposta da parsed");
            }
            
            return parsedLog.name === "ProductCreated"; // Verifica se é o evento desejado
        } catch {
            return false;
        }
    });

    // Se o evento não for encontrado
    if (!eventLog) {
        throw new Error("Evento 'ProductCreated' não encontrado.");
    }

    // Decodificando o log do evento para obter o endereço do contrato
    const parsedEvent = eventInterface.parseLog(eventLog);
    if (!parsedEvent) {
        throw new Error("sem resposta da parsed event");
    }
    const productAddress = parsedEvent.args.contractAddress;

    const gasUsed = receipt.gasUsed; 
    const gasPrice = tx.gasPrice;

    const totalCostWei = gasUsed * gasPrice;
    const totalCostEther = ethers.formatEther(totalCostWei);

    console.log(`Custo do deploy produto: \n Produto: ${productAddress} \n Custo: ${totalCostEther} ETH`);

    console.log("///////////////////////////////")

    return productAddress;
}
