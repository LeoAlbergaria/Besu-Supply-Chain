// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChainRegistry {
    mapping(address => address[]) private supplyChainsByOrg;

    event SupplyChainRegistered(address indexed organization, address indexed supplyChain);

    function registerParticipation(address org, address supplyChain) external {
        supplyChainsByOrg[org].push(supplyChain);
        emit SupplyChainRegistered(org, supplyChain);
    }

    function getSupplyChainsForOrg(address org) public view returns (address[] memory) {
        return supplyChainsByOrg[org];
    }
}
