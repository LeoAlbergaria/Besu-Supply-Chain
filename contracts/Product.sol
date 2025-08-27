// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ProductAtOrganization.sol";
import "./ProductPermissions.sol";
import "./Organization.sol";

contract Product is ProductPermissions {
    struct ProductInfo {
        string name;
        string id;
    }

    ProductInfo private productInfo;
    mapping(address => address) public organizationToProductAtOrganization;
    address public manager;
    address public pendingManager;

    struct Ownership {
        address organization;
        address manager;
        uint256 startTime;
    }
    Ownership[] public ownershipHistory;

    modifier onlyManager() {
        require(msg.sender == manager, "Only the manager can perform this action");
        _;
    }
    
    address private patoFactoryAddr;
    event ProductCreated(address indexed productAddress);
    event ProductTransferred(address indexed from, address indexed to, address organization, uint256 timestamp);

    constructor(
        string memory _productName,
        string memory _productId, 
        address _organizationAddress,
        address[] memory _participatingOrganizations
    ) ProductPermissions(_participatingOrganizations) {
        productInfo = ProductInfo({ name: _productName, id: _productId });
        manager = tx.origin;
        ownershipHistory.push(Ownership({ organization: _organizationAddress, manager: manager, startTime: block.timestamp }));
        patoFactoryAddr = address(new PATOFactory());
        organizationToProductAtOrganization[_organizationAddress] = PATOFactory(patoFactoryAddr).deploy(address(this), _organizationAddress, manager);
    }

    function getName() public view returns (string memory) {
        return productInfo.name;
    }

    function getId() public view returns (string memory) {
        return productInfo.id;
    }

    function getProductAtOrganization(address _organizationAddress) public view returns (address) {
        require(organizationToProductAtOrganization[_organizationAddress] != address(0), "Product not found for this organization");
        return organizationToProductAtOrganization[_organizationAddress];
    }

    function requestOwnershipTransfer(address newManager) public onlyManager {
        require(newManager != address(0), "New manager cannot be the zero address");
        pendingManager = newManager;
    }

    function approveOwnershipTransfer(address orgAddress) public {
        require(msg.sender == pendingManager, "Only the pending manager can approve the transfer");

        address previousManager = manager;

        manager = pendingManager;
        pendingManager = address(0);

        ownershipHistory.push(Ownership({ organization: ownershipHistory[0].organization, manager: manager, startTime: block.timestamp }));

        emit ProductTransferred(previousManager, manager, orgAddress, block.timestamp);

        nextPATO(orgAddress, manager);
    }

    function nextPATO(address _organizationAddress, address _manager) private {
        organizationToProductAtOrganization[_organizationAddress] = 
            PATOFactory(patoFactoryAddr).deploy(address(this), _organizationAddress, _manager);
    }

    function getOwnershipHistory() public view returns (Ownership[] memory) {
        return ownershipHistory;
    }
}

contract PATOFactory {
    function deploy(
        address _productAddr,
        address _orgAddr, 
        address _manager
    ) external returns (address) {
        return address(new ProductAtOrganization(_productAddr, _orgAddr, _manager));
    }
}
