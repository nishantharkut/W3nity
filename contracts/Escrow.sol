// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Escrow {
    address public client;
    address public freelancer;
    uint256 public amount;
    bool public isComplete;

    constructor(address _freelancer) payable {
        require(msg.value > 0, "Must send some ether");
        client = msg.sender;
        freelancer = _freelancer;
        amount = msg.value;
        isComplete = false;
    }

    function releaseFunds() external {
        require(!isComplete, "Funds already released");
        require(address(this).balance >= amount, "Insufficient balance");

        isComplete = true;

        (bool sent, ) = payable(freelancer).call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
