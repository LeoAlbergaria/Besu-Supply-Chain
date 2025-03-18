// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Organization {
    struct Info {
        string companyName;
        string urlCompany;
        bool isEnabled;
    }
    
    Info private organizationInfo;
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    constructor(
        string memory _url, 
        string memory _companyName
    ) {
        owner = msg.sender;
        organizationInfo = Info({
            urlCompany: _url,
            companyName: _companyName,
            isEnabled: true
        });
    }

    function getInfo() public view returns (Info memory) {
        return organizationInfo;
    }

    function setCompanyName(string memory _companyName) public {
        organizationInfo.companyName = _companyName;
    }

    function setUrlCompany(string memory _urlCompany) public {
        organizationInfo.urlCompany = _urlCompany;
    }

    function disable() public onlyOwner {
        organizationInfo.isEnabled = false;
    }

    function IsOwner() public view returns (bool) {
        return msg.sender == owner;
    }
}
