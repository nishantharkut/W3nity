// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Escrow {
    address public client;
    address public freelancer;
    uint256 public amount;
    bool public isComplete;

    constructor(address _freelancer) payable {
        client = msg.sender;
        freelancer = _freelancer;
        amount = msg.value;
        isComplete = false;
    }

    function releaseFunds() external {
        require(msg.sender == client, "Only client can release funds");
        require(!isComplete, "Already released");

        isComplete = true;
        payable(freelancer).transfer(amount);
    }
}
