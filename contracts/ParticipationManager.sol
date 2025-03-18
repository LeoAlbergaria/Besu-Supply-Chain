// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ParticipationManager {
    address[] private organizations;
    mapping(address => bool) public accepted;

    constructor(address[] memory _organizations) {
        organizations = _organizations;
        for (uint256 i = 0; i < _organizations.length; i++) {
            accepted[_organizations[i]] = false;
        }
    }

    function acceptParticipation(address orgAddress) public {
        bool found = false;
        for (uint256 i = 0; i < organizations.length; i++) {
            if (organizations[i] == orgAddress) {
                found = true;
                break;
            }
        }
        require(found, "Organization not found");
        accepted[orgAddress] = true;
    }

    function GetIsReady() public view returns (bool) {
        for (uint256 i = 0; i < organizations.length; i++) {
            if (!accepted[organizations[i]]) {
                return false;
            }
        }
        return true;
    }

    function GetOrganizations() public view returns (address[] memory) {
        return organizations;
    }
}
