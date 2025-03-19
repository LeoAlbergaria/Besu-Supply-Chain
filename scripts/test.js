const { Interface } = require("ethers");
const iface = new Interface([
  "function getParticipationManagerAddress() view returns (address)"
]);
const data = iface.encodeFunctionData("getParticipationManagerAddress");
console.log(data);