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
    
    // === Custom Errors ===
    error Lock__UnlockTimeNotInFuture();
    error Lock__NoFundsProvided();
    error Lock__WithdrawalTooEarly(uint256 currentTime, uint256 unlockTime);
    error Lock__NotOwner(address caller, address owner);
    error Lock__TransferFailed();

    /**
     * @dev Contract constructor
     * @param _unlockTime Unix timestamp when funds will be unlockable
     */
    constructor(uint256 _unlockTime) payable {
        if (block.timestamp >= _unlockTime) {
            revert Lock__UnlockTimeNotInFuture();
        }
        if (msg.value <= 0) {
            revert Lock__NoFundsProvided();
        }

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
        if (block.timestamp < i_unlockTime) {
            revert Lock__WithdrawalTooEarly(block.timestamp, i_unlockTime);
        }
        if (msg.sender != i_owner) {
            revert Lock__NotOwner(msg.sender, i_owner);
        }
        
        uint256 amount = address(this).balance;
        
        // Emit event before external call (follows checks-effects-interactions)
        emit Withdrawal(amount, block.timestamp);

        // Transfer funds
        (bool success, ) = i_owner.call{value: amount}("");
        if (!success) {
            revert Lock__TransferFailed();
        }
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
