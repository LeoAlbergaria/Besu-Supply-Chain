import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import SupplyChainArtifact from "./artifacts/contracts/SupplyChain.sol/SupplyChain.json";
import ParticipationManagerArtifact from "./artifacts/contracts/ParticipationManager.sol/ParticipationManager.json";
import OrganizationArtifact from "./artifacts/contracts/Organization.sol/Organization.json";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [supplyChainContract, setSupplyChainContract] = useState(null);
  const [participationManagerContract, setParticipationManagerContract] = useState(null);
  const [participationManagerContractAddress, setParticipationManagerContractAddress] = useState("");
  const [provider, setProvider] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [organizations, setOrganizations] = useState("");
  
  // Remove trailing spaces from addresses
  const supplyChainAddress = "0xf812A1F169C8cD6f853688a9fD38ae8e71A2D99A";
  const organizationAddress = "0xD72a9f4184Ef9587399942A98f4cD9a1dD1D854f";

  useEffect(() => {
    console.log("window.ethereum", window.ethereum);
  }, []);

  async function connectWallet() {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        
        const customNetwork = {
          name: "besu",
          chainId: 1337,
          ensAddress: null, 
        };
        const privateKey = "0xe18414ceb180a62508d31eb2cc206885f7351a3afa096aefcf880617e13a6805";
        const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545", customNetwork);
        const wallet = new ethers.Wallet(privateKey, provider);
        setWalletAddress(provider);
        setWallet(wallet);

        const supplyChainContract = new ethers.Contract(
          supplyChainAddress,
          SupplyChainArtifact.abi,
          wallet
        );
        setSupplyChainContract(supplyChainContract);
        const walletAddress = await wallet.getAddress();
        setWalletAddress(walletAddress);
        loadParticipationManagerAddress(supplyChainContract);

        console.log("Initialization successful:", {
          provider,
          wallet,
          supplyChainContract,
          walletAddress,
        });
      } catch (error) {
        console.error("Error initializing contract:", error);
        alert("Error connecting wallet");
      }
    } else {
      alert("Please install MetaMask!");
    }
  }

  async function loadParticipationManagerAddress(contract) {
    try {
      const participationManagerAddress = await contract.getParticipationManagerAddress();
      console.log("ParticipationManager Address:", participationManagerAddress);
      setParticipationManagerContractAddress(participationManagerAddress)
    } catch (error) {
      console.error("Error loading ParticipationManager Address:", error);
    }
  }

  async function connectParticipationManager() {
    try {
      const participationManagerContract = new ethers.Contract(
        participationManagerContractAddress,
        ParticipationManagerArtifact.abi,
        wallet
      );
      setParticipationManagerContract(participationManagerContract);

      loadOrganizationsAddresses(participationManagerContract);

      console.log("Participation Manager Initialization successful:", {
        provider,
        wallet,
        participationManagerContract,
        walletAddress,
      });
    } catch (error) {
      console.error("Error initializing contract:", error);
      alert("Error connecting wallet");
    }
  }

  async function loadOrganizationsAddresses(contract) {
    try {
      const organizationsAddresses = await contract.GetOrganizations();
      console.log("Organizations Addresses:", organizationsAddresses);
    } catch (error) {
      console.error("Error loading Organizations Addresses:", error);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", background: "#fff" }}>
      <button onClick={connectWallet}>Conectar Carteira</button>
      {walletAddress && <p>Conectado: {walletAddress}</p>}
      <button onClick={connectParticipationManager}>Listar Organizações</button>
      {organizations && organizations.length > 0 && (
        <div>
          <h3>Organizações:</h3>
          <ul>
            {organizations.map((org, index) => (
              <li key={index}>{org}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
