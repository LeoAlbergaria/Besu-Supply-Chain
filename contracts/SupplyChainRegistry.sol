// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Organization.sol";

contract SupplyChainRegistry {
    mapping(address => address[]) private supplyChainsByOrg;
    address[] public deployedOrgs;

    event SupplyChainRegistered(address indexed organization, address indexed supplyChain);

    function registerParticipation(address org, address supplyChain) external {
        supplyChainsByOrg[org].push(supplyChain);
        deployedOrgs.push(org);
        emit SupplyChainRegistered(org, supplyChain);
    }

    function getAllMySupplyChains() external view returns (address[] memory) {
        for (uint256 i = 0; i < deployedOrgs.length; i++) {
            address org = deployedOrgs[i];
            if (Organization(org).owner() == msg.sender) {
                return supplyChainsByOrg[org];
            }
        }
        return new address[](0);
    }
}
