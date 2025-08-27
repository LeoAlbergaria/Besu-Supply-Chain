import { ethers } from "hardhat";

async function main() {
    const [signer] = await ethers.getSigners();

    console.log("Signer:", signer.address);

    const SupplyChainRegistryContract = await ethers.getContractAt(
        "SupplyChainRegistry",
        "0x8ac3544b75Fe04eD291Ea21ddB46810A859D1153"
    );

    const supplyChains = await SupplyChainRegistryContract.getAllMySupplyChains();
    console.log("My Supply Chains:", supplyChains);

    const supplyChainContract = await ethers.getContractAt(
        "SupplyChain",
        supplyChains[0]
    );

    const products = await supplyChainContract.getDeployedProducts();
    console.log("My Products:", products);

    const productContract = await ethers.getContractAt(
        "Product",
        products[0]
    );

    const pato = await productContract.getProductAtOrganization("0x639347d9232056630724512c5a5263c2A52C473a");
    console.log("Pato:", pato);

    const patoContract = await ethers.getContractAt(
        "ProductAtOrganization",
        pato
    );

    const events = await patoContract.getEvents("0x639347d9232056630724512c5a5263c2A52C473a");
    console.log("Events:", events);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });