// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

abstract contract ProductPermissions {
    address[] public orgAddresses;
    mapping(address => mapping(address => int)) public permissionsMatrix;

    event PermissionChanged(address indexed org1, address indexed org2, int256 permission);

    constructor(address[] memory _orgAddresses) {
        orgAddresses = _orgAddresses;
        for (uint256 i = 0; i < _orgAddresses.length; i++) {
            for (uint256 j = 0; j < _orgAddresses.length; j++) {
                permissionsMatrix[_orgAddresses[i]][_orgAddresses[j]] = 1;
            }
        }
    }

    function setPermission(address org1, address org2, int256 permission) public {
        require(permission == 0 || permission == 1, "Permission must be 0 or 1.");
        permissionsMatrix[org1][org2] = permission;
        emit PermissionChanged(org1, org2, permission);
    }

    function hasPermission(address org1, address org2) public view returns (bool) {
        return permissionsMatrix[org1][org2] == 1;
    }

    //Esta sendo usado?
    function getAllMyPermissedOrgs(address organizationAddr) public view returns (address[] memory) {
        uint256 permittedOrgCount = 0;
        for (uint256 i = 0; i < orgAddresses.length; i++) {
            if (permissionsMatrix[organizationAddr][orgAddresses[i]] > 0) {
                permittedOrgCount++;
            }
        }
        address[] memory permittedOrgList = new address[](permittedOrgCount);
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < orgAddresses.length; i++) {
            if (permissionsMatrix[organizationAddr][orgAddresses[i]] > 0) {
                permittedOrgList[currentIndex] = orgAddresses[i];
                currentIndex++;
            }
        }
        return permittedOrgList;
    }
}
