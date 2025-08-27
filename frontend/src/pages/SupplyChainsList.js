import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar/SearchBar.js';
import TextAction from '../components/TextAction.js';
import Header from '../components/Header.js';
import Title from '../components/Title.js';
import { Colors, Metrics } from '../styles';

import { ethers } from "ethers";

import SupplyChainArtifact from "../artifacts/contracts/SupplyChain.sol/SupplyChain.json";
import SupplyChainRegistryArtifact from "../artifacts/contracts/SupplyChainRegistry.sol/SupplyChainRegistry.json";

export default function SupplyChainsList() {
  const [search, setSearch] = useState('');
  const [supplyChains, setSupplyChains] = useState([]);

  // Wallet and provider
  const [walletAddress, setWalletAddress] = useState("");
  const [wallet, setWallet] = useState(null);
  const [provider, setProvider] = useState(null);

  const [supplyChainContract, setSupplyChainContract] = useState(null);
  const [productType, setProductType] = useState("");
  const [supplyChainAddress, setSupplyChainAddress] = useState("");
  const [registryContract, setRegistryContract] = useState(null);

  // 👇 Replace this with your actual deployed registry contract address:
  const registryAddress = "0x8ac3544b75Fe04eD291Ea21ddB46810A859D1153";

  useEffect(() => {
    if (window.ethereum) {
      connectWallet();
    }
  }, []);

  async function connectWallet() {
  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    console.log(address);

    setProvider(provider);
    setWallet(signer);
    setWalletAddress(address);

    const registry = new ethers.Contract(registryAddress, SupplyChainRegistryArtifact.abi, signer);
    setRegistryContract(registry);

    await loadAllSupplyChains(registry, signer, address);
  } catch (error) {
    console.error("Error connecting wallet:", error);
    alert("Error connecting wallet");
  }
}

  async function loadAllSupplyChains(registry, signer, orgAddress) {
    try {
      const supplyChainAddresses = await registry.getAllMySupplyChains();
    console.log(supplyChainAddresses)

      const supplyChainData = await Promise.all(
        supplyChainAddresses.map(async (address) => {
          try {
            const contract = new ethers.Contract(address, SupplyChainArtifact.abi, signer);
            const productType = await contract.productType();
            const deployedProducts = await contract.getDeployedProducts();
            return {
              address,
              productType,
              productCount: deployedProducts.length,
            };
          } catch (error) {
            console.error(`Erro ao carregar SupplyChain ${address}:`, error);
            return null;
          }
        })
      );

      const validSupplyChains = supplyChainData.filter(Boolean);
      console.log("Supplychains:", validSupplyChains)
      setSupplyChains(validSupplyChains);
    } catch (error) {
      console.error("Erro ao carregar supply chains da organização:", error);
    }
  }

  const filtered = supplyChains.filter(chain =>
    chain.productType.toLowerCase().includes(search.toLowerCase())
  );

  const navigate = useNavigate();

  const handleViewDetails = (chain) => {
    navigate(`/supplychain/${chain.address}`, {
      state: { chain },
    });
  };

  const handleViewEvents = (chain) => {
    navigate(`/events/${chain.address}`, {
      state: { chain },
    });
  };

  return (
    <>
      <Header />
      <div style={{ padding: '20px 160px', backgroundColor: Colors.background, minHeight: '100vh' }}>
        {/* H1Group */}
        <div style={{ padding: Metrics.padding.standard }}>
          <Title
            title="Supply Chains"
          />
        </div>

        {/* SearchBarGroup */}
        <div style={{ padding: Metrics.padding.standard }}>
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product type"
          />
        </div>

        {/* TableGroup */}
        <div style={{ padding: Metrics.padding.standard }}>
          <table className="app-table">
            <thead>
              <tr>
                <th>Product Type</th>
                <th>Address</th>
                <th># of Products</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((chain, idx) => (
                <tr key={idx}>
                  <td>{chain.productType}</td>
                  <td>{chain.address}</td>
                  <td>{chain.productCount}</td>
                  <td>
                    <div style={{ display: 'flex', gap: Metrics.padding.standard }}>
                      <TextAction onClick={() => handleViewDetails(chain)}>
                        View Products
                      </TextAction>
                      <TextAction onClick={() => handleViewEvents(chain)}>
                        View Events
                      </TextAction>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// import React, { useState, useEffect } from "react";
// import { ethers } from "ethers";
// import "./App.css";

// import SupplyChainArtifact from "./artifacts/contracts/SupplyChain.sol/SupplyChain.json";
// import ParticipationManagerArtifact from "./artifacts/contracts/ParticipationManager.sol/ParticipationManager.json";
// import OrganizationArtifact from "./artifacts/contracts/Organization.sol/Organization.json";
// import ProductArtifact from "./artifacts/contracts/Product.sol/Product.json";
// import ProductAtOrganizationArtifact from "./artifacts/contracts/ProductAtOrganization.sol/ProductAtOrganization.json";

// function App() {
//   // Wallet and provider
//   const [walletAddress, setWalletAddress] = useState("");
//   const [wallet, setWallet] = useState(null);
//   const [provider, setProvider] = useState(null);

//   // Contracts
//   const [supplyChainContract, setSupplyChainContract] = useState(null);
//   const [participationManagerContractAddress, setParticipationManagerContractAddress] = useState("");
//   const [participationManagerContract, setParticipationManagerContract] = useState(null);
//   const [organizationContract, setOrganizationContract] = useState(null);

//   // Organizations
//   const [organizations, setOrganizations] = useState([]);
//   const [selectedOrganization, setSelectedOrganization] = useState(null);

//   // Products
//   const [productsList, setProductsList] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   // Events
//   const [productEvents, setProductEvents] = useState([]);

//   // Supply Chain Address
//   const supplyChainAddress = "0xa9242687f519f72Acd127F05DBfc91942F94Ca94";

//   // Auto-connect wallet on mount
//   useEffect(() => {
//     if (window.ethereum) {
//       connectWallet();
//     }
//   }, []);

//   async function connectWallet() {
//     try {
//       await window.ethereum.request({ method: "eth_requestAccounts" });
//       const besuNetwork = { name: "besu", chainId: 1337, ensAddress: null };
//       const rpcProvider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545", besuNetwork);
//       const privateKey = "0xe18414ceb180a62508d31eb2cc206885f7351a3afa096aefcf880617e13a6805";
//       const signerWallet = new ethers.Wallet(privateKey, rpcProvider);
//       setProvider(rpcProvider);
//       setWallet(signerWallet);
//       const addr = await signerWallet.getAddress();
//       setWalletAddress(addr);

//       const supplyChain = new ethers.Contract(supplyChainAddress, SupplyChainArtifact.abi, signerWallet);
//       setSupplyChainContract(supplyChain);

//       await loadParticipationManagerAddress(supplyChain, signerWallet);
//       console.log("Initialization successful:", {
//         provider: rpcProvider,
//         wallet: signerWallet,
//         supplyChainContract: supplyChain,
//         walletAddress: addr,
//       });
//     } catch (error) {
//       console.error("Error connecting wallet:", error);
//       alert("Error connecting wallet");
//     }
//   }

//   async function loadParticipationManagerAddress(contract, walletInstance) {
//     try {
//       const pmAddress = await contract.getParticipationManagerAddress();
//       console.log("ParticipationManager Address:", pmAddress);
//       setParticipationManagerContractAddress(pmAddress);
//       const pmContract = new ethers.Contract(pmAddress, ParticipationManagerArtifact.abi, walletInstance);
//       setParticipationManagerContract(pmContract);
//       await loadOrganizations(pmContract, walletInstance);
//     } catch (error) {
//       console.error("Error loading ParticipationManager Address:", error);
//     }
//   }

//   async function loadOrganizations(pmContract, walletInstance) {
//     try {
//       const orgs = await pmContract.GetOrganizations();
//       console.log("Organizations Addresses:", orgs);
//       let orgsInfo = [];
//       for (let i = 0; i < orgs.length; i++) {
//         const orgAddr = orgs[i];
//         const orgContract = new ethers.Contract(orgAddr, OrganizationArtifact.abi, walletInstance);
//         try {
//           const info = await orgContract.getInfo();
//           orgsInfo.push({ address: orgAddr, info });
//         } catch (error) {
//           console.error("Error loading org info for", orgAddr, error);
//         }
//       }
//       setOrganizations(orgsInfo);
//     } catch (error) {
//       console.error("Error loading Organizations:", error);
//     }
//   }

//   async function handleOrganizationClick(org) {
//     resetProducts();
//     setSelectedOrganization(org);
//     await loadProductsForOrganization(org.address);
//     await connectOrganization(org.address);
//   }

//   async function resetProducts() {
//     setSelectedProduct(null);
//     setProductEvents([]);
//   }

//   async function loadProductsForOrganization(orgAddress) {
//     try {
//       const deployedProducts = await supplyChainContract.getDeployedProducts();
//       let productsForOrg = [];
//       for (let i = 0; i < deployedProducts.length; i++) {
//         const productAddr = deployedProducts[i];
//         const productContract = new ethers.Contract(productAddr, ProductArtifact.abi, wallet);
//         try {
//           const productAtOrgAddr = await productContract.getProductAtOrganization(orgAddress);
//           if (productAtOrgAddr !== ethers.constants.AddressZero) {
//             let productDetails;
//             if (typeof productContract.getProductInfo === "function") {
//               productDetails = await productContract.getProductInfo();
//             } else {
//               const name = await productContract.getName();
//               productDetails = { name, id: "N/A" };
//             }
//             productsForOrg.push({
//               productAddress: productAddr,
//               productAtOrgAddress: productAtOrgAddr,
//               productName: productDetails.name,
//               productId: productDetails.id,
//             });
//           }
//         } catch (err) {
//           console.error("Error for product", productAddr, err);
//         }
//       }
//       console.log("Products for organization", orgAddress, productsForOrg);
//       setProductsList(productsForOrg);
//     } catch (error) {
//       console.error("Error loading products for organization:", error);
//     }
//   }

//   async function connectOrganization(orgAddress) {
//     try {
//       const orgContract = new ethers.Contract(orgAddress, OrganizationArtifact.abi, wallet);
//       setOrganizationContract(orgContract);
//     } catch (error) {
//       console.error("Error connecting organization contract:", error);
//     }
//   }

//   async function handleProductClick(product) {
//     setSelectedProduct(product);
//     await loadProductEvents(product.productAtOrgAddress);
//   }

//   async function loadProductEvents(productAtOrgAddr) {
//     try {
//       const productAtOrgContract = new ethers.Contract(productAtOrgAddr, ProductAtOrganizationArtifact.abi, wallet);
//       const events = await productAtOrgContract.getEvents();
//       console.log("Product Events:", events);
//       setProductEvents(events);
//     } catch (error) {
//       console.error("Error loading product events:", error);
//     }
//   }

//   return (
//     <div className="container">
//       <div className="left">
//         <div className="section">
//           <h2>Organizations</h2>
//           {organizations.length > 0 ? (
//             <ul className="list">
//               {organizations.map((org, index) => (
//                 <li key={index} className="cell">
//                   <button onClick={() => handleOrganizationClick(org)} className="button">
//                     {org.info.companyName} <br /> <span className="small-text">({org.address})</span>
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p>No organizations found.</p>
//           )}
//         </div>
//         <div className="section">
//           <h2>
//             Products for Organization:{" "}
//             {selectedOrganization ? selectedOrganization.info.companyName : "None selected"}
//           </h2>
//           {productsList.length > 0 ? (
//             <ul className="list">
//               {productsList.map((prod, index) => (
//                 <li key={index} className="cell">
//                   <button onClick={() => handleProductClick(prod)} className="button">
//                     {prod.productName} <br /> <span className="small-text">({prod.productAddress})</span>
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p>No products for selected organization.</p>
//           )}
//         </div>
//       </div>
//       <div className="right">
//         <h2>
//           Product Events:{" "}
//           {selectedProduct ? selectedProduct.productName : "None selected"}
//         </h2>
//         {productEvents.length > 0 ? (
//           <ul className="list">
//             {productEvents.map((event, index) => (
//               <li key={index} className="cell">
//                 <p><strong>Type:</strong> {event.typeEvent}</p>
//                 <p><strong>Time:</strong> {event.timeEvent}</p>
//                 <p><strong>Data:</strong></p>
//                 <pre className="json-data">{JSON.stringify(JSON.parse(event.jsonEvent), null, 2)}</pre>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No events for selected product.</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;