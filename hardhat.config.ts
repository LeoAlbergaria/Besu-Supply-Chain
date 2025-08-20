import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  paths: {
    artifacts: './frontend/src/artifacts',
  },
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337, // Configuração para a rede local
    },
    sepolia: {
      gas: 12000000, // Defina um valor maior para gasLimit
      gasPrice: 20000000000, // Preço do gás em wei (20 gwei)
      url: process.env.SEPOLIA_RPC_URL || "", // URL do nó RPC da rede Sepolia
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [], // Conta privada
      chainId: 11155111, // Identificador único da rede Sepolia
    },
    besu: {
      url: "http://127.0.0.1:8545", // adjust if your Besu node is on a different host/port
      chainId: 1337,
      accounts: ["0xe18414ceb180a62508d31eb2cc206885f7351a3afa096aefcf880617e13a6805",
        "0xec0c32caf84b78c09c9c28cacd31f817994118f378756e9075b4ca3550fb2a7d",
        "0x69ea8569592d3ddef5a861c4884c00bf12561eec960fb2c13df9cfbcb3e52b57",
        "0x77b5e874c0def81e4f73f8b0a6fb370a7982469a08dcbc6520c56602c646362c",
        "092231b4ef7c3a5a1b02aa8a04e296bf102705da0d80b986377cecfa406f62ec",
        "2ac7adfac739fdac7e1a9b37234f544c337d9ca1dda485dbcd51a75ad05d619f",
        "a55d5e2a33d6d21861a4431ec3c223058f7696f2907da8b3d54114090de7c592",
        "3dfb0cd1042cee1845c85dbd84ba71636c488d75711942f37a3b7ef051b0e7fc",
        "045f9c0aa8acb2228f1a41683f80eb47e8217d7856a33d7a6cf42cd30a66a5e6",
        "a83b01fcb55e8e69a19b01a1c9eb226d903be10b61dc77b2fba797505d1591d1"], // Replace with your deployer's private key
    },
  },
};

export default config;