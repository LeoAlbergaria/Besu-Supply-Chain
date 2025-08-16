// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Product.sol";
import "./ParticipationManager.sol";
import "./SupplyChainRegistry.sol";

contract SupplyChain {
    string public productType;
    address[] public deployedProducts;
    address public participationManagerAddress;
    address public registryAddress;

    event ProductCreated(address indexed contractAddress);

    constructor(
        address[] memory _possibleOrganizations,
        string memory _productType,
        address _registryAddress
    ) {
        productType = _productType;
        participationManagerAddress = address(new ParticipationManager(_possibleOrganizations));
        registryAddress = _registryAddress;

        for (uint256 i = 0; i < _possibleOrganizations.length; i++) {
            SupplyChainRegistry(registryAddress).registerParticipation(_possibleOrganizations[i], address(this));
        }
    }

    function acceptParticipation(address orgAddress) public {
        ParticipationManager participationManager = ParticipationManager(participationManagerAddress);
        participationManager.acceptParticipation(orgAddress);
    }

    function NewProduct(
        string memory _productName, 
        string memory _productId, 
        address _organizationAddress
    ) public {
        ParticipationManager participationManager = ParticipationManager(participationManagerAddress);
        require(participationManager.GetIsReady(), "All organizations need to accept participation");

        address newProduct = address(new Product(
            _productName,
            _productId,
            _organizationAddress, 
            participationManager.GetOrganizations()
        ));

        deployedProducts.push(newProduct);
        emit ProductCreated(newProduct);
    }

    function getParticipationManagerAddress() public view returns (address) {
        return participationManagerAddress;
    }

    function getDeployedProducts() public view returns (address[] memory) {
        return deployedProducts;
    }
}
