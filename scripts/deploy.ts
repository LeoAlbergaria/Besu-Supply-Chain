import { ethers } from "hardhat";
import { deployOrganization } from "./organization";
import { deploySupplyChain, acceptParticipation } from "./supplychain";
import { deployProduct } from "./product";
import { enablePipelinePATO } from "./pato";

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

    // console.log("Contrato org1:", org1Address);
    // console.log("Contrato org2:", org2Address);
    console.log("org array:", orgArray);
      
    const supplyChainAddress = await deploySupplyChain(
        orgArray,
        "vehicle"
    );
    
    // console.log("Contrato supplyChain:", supplyChainAddress);


    await acceptParticipation(org1Address, supplyChainAddress);
    await acceptParticipation(org2Address, supplyChainAddress);

    // ----------------------------------------------------------------
    // const supplyChainAddress = "0xDa20A82Df788C123c31150229DFE3575Fc6e261D"
    // const org1Address = "0x154a9566b1695c90c281a748B734946043E35C68"
    // const productAddress = "0xD18c65eB02661c9a85Ab3C4e4B152408662b7cbf"

    interface Product {
        id: string;
        url: string;
        name: string;
    }

    const products: Product[] = [
        { id: "p1", url: "example.com", name: "product1" },
        { id: "p2", url: "example.com", name: "product2" },
        { id: "p3", url: "example.com", name: "product3" },
    ];

    const product1Address = await deployProduct(
        supplyChainAddress,
        products[0].name,
        products[0].id,
        org1Address
    );

    console.log("Contrato product1:", product1Address);
    console.log("Contrato product1AtOrganization1:", product1Address);

    const product2Address = await deployProduct(
        supplyChainAddress,
        products[1].name,
        products[1].id,
        org1Address
    );

    console.log("Contrato product2:", product2Address);
    console.log("Contrato product1AtOrganization2:", product2Address);

    const product3Address = await deployProduct(
        supplyChainAddress,
        products[2].name,
        products[2].id,
        org2Address
    );

    console.log("Contrato product1:", product3Address);
    console.log("Contrato product1AtOrganization1:", product3Address);


    // ----------------------------------------------------------------    

    // await enablePipelinePATO(
    //     productAddress, 
    //     org1Address, 
    //     "http://200.137.66.30:8082/api/companies/1/objects/urn:epc:id:sgtin:4068194000.000.782149418/events/new",
    //     jobId
    // )

    // ----------------------------------------------------------------

    

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


//   Deploy by account: 0x10BAD79C8CAA20112A397476D9e9693158F6c724
// ///////////////////////////////
// Custo do deploy da organização: 
//  Address: 0x154a9566b1695c90c281a748B734946043E35C68 
//  Custo: 0.0136035 ETH
// ///////////////////////////////
// ///////////////////////////////
// Custo do deploy da organização: 
//  Address: 0x01219433b95fC70Ae2371b156E2Ac9384111066b 
//  Custo: 0.0136035 ETH
// ///////////////////////////////
// org array: [
//   '0x154a9566b1695c90c281a748B734946043E35C68',
//   '0x01219433b95fC70Ae2371b156E2Ac9384111066b'
// ]
// ///////////////////////////////
// Custo do deploy da supplyChain: 
//  Address: 0xDa20A82Df788C123c31150229DFE3575Fc6e261D 
//  Custo: 0.08005958 ETH
// ///////////////////////////////
// ///////////////////////////////
// Custo do aceite da organização: 
//  Organização: 0x154a9566b1695c90c281a748B734946043E35C68 
//  Custo: 0.00192476 ETH
// ///////////////////////////////
// ///////////////////////////////
// Custo do aceite da organização: 
//  Organização: 0x01219433b95fC70Ae2371b156E2Ac9384111066b 
//  Custo: 0.00134124 ETH
// ///////////////////////////////
// ///////////////////////////////
// ///////////////////////////////
// Custo do deploy produto: 
//  Produto: 0x3904e46a48CD769e789dD3F81b1A59e741e601cD 
//  Custo: 0.0913509 ETH
// ///////////////////////////////
// ///////////////////////////////
// Transferring 10.0 LINK to 0xf6557bCa44A21C875974126D6C71a2e16b1250A6
// Custo da transferencia de token: 
//  Custo: 0.00103316 ETH
// Transfer completed!
// ///////////////////////////////