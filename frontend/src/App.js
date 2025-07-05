import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";

import SupplyChainArtifact from "./artifacts/contracts/SupplyChain.sol/SupplyChain.json";
import ParticipationManagerArtifact from "./artifacts/contracts/ParticipationManager.sol/ParticipationManager.json";
import OrganizationArtifact from "./artifacts/contracts/Organization.sol/Organization.json";
import ProductArtifact from "./artifacts/contracts/Product.sol/Product.json";
import ProductAtOrganizationArtifact from "./artifacts/contracts/ProductAtOrganization.sol/ProductAtOrganization.json";

function App() {
  // Wallet and provider
  const [walletAddress, setWalletAddress] = useState("");
  const [wallet, setWallet] = useState(null);
  const [provider, setProvider] = useState(null);

  // Contracts
  const [supplyChainContract, setSupplyChainContract] = useState(null);
  const [participationManagerContractAddress, setParticipationManagerContractAddress] = useState("");
  const [participationManagerContract, setParticipationManagerContract] = useState(null);
  const [organizationContract, setOrganizationContract] = useState(null);

  // Organizations
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState(null);

  // Products
  const [productsList, setProductsList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Events
  const [productEvents, setProductEvents] = useState([]);

  // Supply Chain Address
  const supplyChainAddress = "0xD193Be079bAf38c8D1391839e81b6382C0469469";

  // Auto-connect wallet on mount
  useEffect(() => {
    if (window.ethereum) {
      connectWallet();
    }
  }, []);

  async function connectWallet() {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const besuNetwork = { name: "besu", chainId: 1337, ensAddress: null };
      const rpcProvider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545", besuNetwork);
      const privateKey = "0xe18414ceb180a62508d31eb2cc206885f7351a3afa096aefcf880617e13a6805";
      const signerWallet = new ethers.Wallet(privateKey, rpcProvider);
      setProvider(rpcProvider);
      setWallet(signerWallet);
      const addr = await signerWallet.getAddress();
      setWalletAddress(addr);

      const supplyChain = new ethers.Contract(supplyChainAddress, SupplyChainArtifact.abi, signerWallet);
      setSupplyChainContract(supplyChain);

      await loadParticipationManagerAddress(supplyChain, signerWallet);
      console.log("Initialization successful:", {
        provider: rpcProvider,
        wallet: signerWallet,
        supplyChainContract: supplyChain,
        walletAddress: addr,
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Error connecting wallet");
    }
  }

  async function loadParticipationManagerAddress(contract, walletInstance) {
    try {
      const pmAddress = await contract.getParticipationManagerAddress();
      console.log("ParticipationManager Address:", pmAddress);
      setParticipationManagerContractAddress(pmAddress);
      const pmContract = new ethers.Contract(pmAddress, ParticipationManagerArtifact.abi, walletInstance);
      setParticipationManagerContract(pmContract);
      await loadOrganizations(pmContract, walletInstance);
    } catch (error) {
      console.error("Error loading ParticipationManager Address:", error);
    }
  }

  async function loadOrganizations(pmContract, walletInstance) {
    try {
      const orgs = await pmContract.GetOrganizations();
      console.log("Organizations Addresses:", orgs);
      let orgsInfo = [];
      for (let i = 0; i < orgs.length; i++) {
        const orgAddr = orgs[i];
        const orgContract = new ethers.Contract(orgAddr, OrganizationArtifact.abi, walletInstance);
        try {
          const info = await orgContract.getInfo();
          orgsInfo.push({ address: orgAddr, info });
        } catch (error) {
          console.error("Error loading org info for", orgAddr, error);
        }
      }
      setOrganizations(orgsInfo);
    } catch (error) {
      console.error("Error loading Organizations:", error);
    }
  }

  async function handleOrganizationClick(org) {
    resetProducts();
    setSelectedOrganization(org);
    await loadProductsForOrganization(org.address);
    await connectOrganization(org.address);
  }

  async function resetProducts() {
    setSelectedProduct(null);
    setProductEvents([]);
  }

  async function loadProductsForOrganization(orgAddress) {
    try {
      const deployedProducts = await supplyChainContract.getDeployedProducts();
      let productsForOrg = [];
      for (let i = 0; i < deployedProducts.length; i++) {
        const productAddr = deployedProducts[i];
        const productContract = new ethers.Contract(productAddr, ProductArtifact.abi, wallet);
        try {
          const productAtOrgAddr = await productContract.getProductAtOrganization(orgAddress);
          if (productAtOrgAddr !== ethers.constants.AddressZero) {
            let productDetails;
            if (typeof productContract.getProductInfo === "function") {
              productDetails = await productContract.getProductInfo();
            } else {
              const name = await productContract.getName();
              productDetails = { name, id: "N/A" };
            }
            productsForOrg.push({
              productAddress: productAddr,
              productAtOrgAddress: productAtOrgAddr,
              productName: productDetails.name,
              productId: productDetails.id,
            });
          }
        } catch (err) {
          console.error("Error for product", productAddr, err);
        }
      }
      console.log("Products for organization", orgAddress, productsForOrg);
      setProductsList(productsForOrg);
    } catch (error) {
      console.error("Error loading products for organization:", error);
    }
  }

  async function connectOrganization(orgAddress) {
    try {
      const orgContract = new ethers.Contract(orgAddress, OrganizationArtifact.abi, wallet);
      setOrganizationContract(orgContract);
    } catch (error) {
      console.error("Error connecting organization contract:", error);
    }
  }

  async function handleProductClick(product) {
    setSelectedProduct(product);
    await loadProductEvents(product.productAtOrgAddress);
  }

  async function loadProductEvents(productAtOrgAddr) {
    try {
      const productAtOrgContract = new ethers.Contract(productAtOrgAddr, ProductAtOrganizationArtifact.abi, wallet);
      const events = await productAtOrgContract.getEvents();
      console.log("Product Events:", events);
      setProductEvents(events);
    } catch (error) {
      console.error("Error loading product events:", error);
    }
  }

  return (
    <div className="container">
      <div className="left">
        <div className="section">
          <h2>Organizations</h2>
          {organizations.length > 0 ? (
            <ul className="list">
              {organizations.map((org, index) => (
                <li key={index} className="cell">
                  <button onClick={() => handleOrganizationClick(org)} className="button">
                    {org.info.companyName} <br /> <span className="small-text">({org.address})</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No organizations found.</p>
          )}
        </div>
        <div className="section">
          <h2>
            Products for Organization:{" "}
            {selectedOrganization ? selectedOrganization.info.companyName : "None selected"}
          </h2>
          {productsList.length > 0 ? (
            <ul className="list">
              {productsList.map((prod, index) => (
                <li key={index} className="cell">
                  <button onClick={() => handleProductClick(prod)} className="button">
                    {prod.productName} <br /> <span className="small-text">({prod.productAddress})</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No products for selected organization.</p>
          )}
        </div>
      </div>
      <div className="right">
        <h2>
          Product Events:{" "}
          {selectedProduct ? selectedProduct.productName : "None selected"}
        </h2>
        {productEvents.length > 0 ? (
          <ul className="list">
            {productEvents.map((event, index) => (
              <li key={index} className="cell">
                <p><strong>Type:</strong> {event.typeEvent}</p>
                <p><strong>Time:</strong> {event.timeEvent}</p>
                <p><strong>Data:</strong></p>
                <pre className="json-data">{JSON.stringify(JSON.parse(event.jsonEvent), null, 2)}</pre>
              </li>
            ))}
          </ul>
        ) : (
          <p>No events for selected product.</p>
        )}
      </div>
    </div>
  );
}

export default App;
