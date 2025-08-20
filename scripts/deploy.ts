import { ethers } from "hardhat";
import { deployOrganization } from "./organization";
import { deploySupplyChain, acceptParticipation } from "./supplychain";
import { deployProduct } from "./product";

async function main() {
    interface Organization {
        url: string;
        name: string;
    }

    const orgs: Organization[] = [
        { url: "example.com", name: "organization1" },
        { url: "example.com", name: "organization2" },
    ];

    const [deployer] = await ethers.getSigners();

    console.log("Deploy by account:", deployer.address);

    const org1Address = await deployOrganization(
        orgs[0].url,
        orgs[0].name
    );

    const org2Address = await deployOrganization(
        orgs[1].url,
        orgs[1].name
    );

    const orgArray = [org1Address, org2Address];

    const supplyChainAddress = await deploySupplyChain(
        orgArray,
        "Vehicles"
    );

    await acceptParticipation(org1Address, supplyChainAddress);
    await acceptParticipation(org2Address, supplyChainAddress);

    interface Product {
        id: string;
        url: string;
        name: string;
    }

    const products: Product[] = [
        { id: "p1", url: "example.com", name: "Onix" },
        { id: "p2", url: "example.com", name: "Spin" },
        { id: "p3", url: "example.com", name: "Captiva" },
    ];

    const product1Address = await deployProduct(
        supplyChainAddress,
        products[0].name,
        products[0].id,
        org1Address
    );

    const product2Address = await deployProduct(
        supplyChainAddress,
        products[1].name,
        products[1].id,
        org1Address
    );

    const product3Address = await deployProduct(
        supplyChainAddress,
        products[2].name,
        products[2].id,
        org2Address
    );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });