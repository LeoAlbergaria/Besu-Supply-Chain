// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC677 {
    function transferAndCall(address to, uint256 value, bytes calldata data) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}
