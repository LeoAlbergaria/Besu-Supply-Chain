import { ethers } from "hardhat";

export async function deployProduct(
    supplyChainAddress: string,
    name: string, 
    productId: string, 
    organizationAddress: string
) {

    const supplyChainContract = await ethers.getContractAt("SupplyChain", supplyChainAddress);

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
    
    const eventLog = receipt.logs.find((log) => {
        try {
            const parsedLog = eventInterface.parseLog(log);
            if (!parsedLog) {
                throw new Error("sem resposta da parsed");
            }
            
            return parsedLog.name === "ProductCreated";
        } catch {
            return false;
        }
    });
    if (!eventLog) {
        throw new Error("Evento 'ProductCreated' não encontrado.");
    }

    const parsedEvent = eventInterface.parseLog(eventLog);
    if (!parsedEvent) {
        throw new Error("sem resposta da parsed event");
    }

    const productAddress = parsedEvent.args.contractAddress;
    const product = await ethers.getContractAt("Product", productAddress);

    const prodName = await product.getName();
    const prodId = await product.getId();
    const manager = await product.manager();
    const pendingManager = await product.pendingManager();
    const history = await product.getOwnershipHistory();

    const patoAddress = await product.getProductAtOrganization(organizationAddress);

    console.log("///////////////////////////////");
    console.log("Product Deployed");
    console.log(" Address:", productAddress);
    console.log(" Name:", prodName);
    console.log(" Id:", prodId);
    console.log(" Manager:", manager);
    console.log(" Pending Manager:", pendingManager);
    console.log(" Ownership History:", history);
    console.log(" Pato atual:", patoAddress);
    console.log("///////////////////////////////\n");

    const pato = await ethers.getContractAt("ProductAtOrganization", patoAddress);
    const patoInfo = await pato.getInfo();
    const patoManager = await pato.manager();
    // const events = await pato.getEvents();

    console.log("///////////////////////////////");
    console.log("Pato Deployed");
    console.log(" Address:", patoAddress);
    console.log(" Product Address:", patoInfo.productAddress);
    console.log(" Organization Address:", patoInfo.organizationAddress);
    console.log(" Manager:", patoManager);
    // console.log(" Events Count:", events.length);
    console.log("///////////////////////////////\n");

    return productAddress;
}
