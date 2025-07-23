// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";
import "./ProductPermissions.sol";
import "./Product.sol";

contract ProductAtOrganization {
    using Strings for address;

    struct Info {
        address organizationAddress;
        address productAddress;
    }

    struct EventInfo {
        string jsonEvent;
        string timeEvent;
        string typeEvent;
    }

    EventInfo[] private events;
    Info private productInfo;
    address public manager;
    ProductPermissions public permissions;

    constructor(
        address _productAddress,
        address _organizationAddress,
        address _manager
    ) {
        manager = _manager;
        productInfo = Info({
            productAddress: _productAddress,
            organizationAddress: _organizationAddress
        });
        permissions = ProductPermissions(_productAddress);
    }

    function getInfo() public view returns (Info memory) {
        return productInfo;
    }

    function addEvent(
        string memory _timeEvent,
        string memory _typeEvent,
        string memory _jsonEvent
    ) public {
        EventInfo memory eventInfo = EventInfo({
            jsonEvent: _jsonEvent,
            timeEvent: _timeEvent,
            typeEvent: _typeEvent
        });
        events.push(eventInfo);
    }

    function getEvents() public view returns (EventInfo[] memory) {
        require(
            permissions.hasPermission(
                msg.sender,
                productInfo.organizationAddress
            ),
            "Access denied: caller not authorized"
        );
        return events;
    }
}
