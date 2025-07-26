// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

/**
 * @title Lock Contract
 * @dev A simple time-locked wallet that allows withdrawal after a specified time
 * @notice Funds are locked until the specified unlock time
 */
contract Lock {
    // === State Variables ===
    uint256 public immutable i_unlockTime;
    address payable public immutable i_owner;

    // === Events ===
    event Withdrawal(uint256 amount, uint256 when);
    event Deposit(address indexed from, uint256 amount);

    /**
     * @dev Contract constructor
     * @param _unlockTime Unix timestamp when funds will be unlockable
     */
    constructor(uint256 _unlockTime) payable {
        require(
            block.timestamp < _unlockTime,
            "Unlock time should be in the future"
        );
        require(msg.value > 0, "Must deposit some funds");

        i_unlockTime = _unlockTime;
        i_owner = payable(msg.sender);
        
        if (msg.value > 0) {
            emit Deposit(msg.sender, msg.value);
        }
    }

    /**
     * @dev Allow deposits to the time lock
     */
    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    /**
     * @dev Withdraws all funds from the contract
     * @notice Can only be called by the owner after unlock time
     */
    function withdraw() external {
        // Check conditions
        require(block.timestamp >= i_unlockTime, "You can't withdraw yet");
        require(msg.sender == i_owner, "You aren't the owner");
        
        uint256 amount = address(this).balance;
        
        // Emit event before external call (follows checks-effects-interactions)
        emit Withdrawal(amount, block.timestamp);

        // Transfer funds
        (bool success, ) = i_owner.call{value: amount}("");
        require(success, "Transfer failed");
    }

    /**
     * @dev Returns the current balance of the contract
     * @return uint256 The contract balance in wei
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Returns the time remaining until unlock
     * @return uint256 Seconds until unlock (0 if already unlocked)
     */
    function getTimeRemaining() external view returns (uint256) {
        if (block.timestamp >= i_unlockTime) {
            return 0;
        }
        return i_unlockTime - block.timestamp;
    }
}
