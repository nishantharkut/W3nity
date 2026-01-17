// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title EventTicketNFT
 * @dev Contract for minting event tickets as NFTs
 * @notice This contract allows creation of event tickets as NFTs with associated metadata
 */
contract EventTicketNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    // === State Variables ===
    Counters.Counter private s_tokenIdCounter;
    uint256 private s_tokenCounter;
    
    // === Events ===
    event TicketMinted(
        address indexed to,
        uint256 indexed tokenId,
        string tokenURI
    );
    
    // === Custom Errors ===
    error EventTicketNFT__InvalidOwnerAddress();
    error EventTicketNFT__InvalidRecipientAddress();
    error EventTicketNFT__EmptyTokenURI();

    /**
     * @dev Contract constructor
     * @param initialOwner Address that will own this contract
     */
    constructor(address initialOwner)
        ERC721("Event Ticket", "ETIX")
        Ownable() // ✅ Fixed: no arguments allowed in OZ v4
    {
        if (initialOwner == address(0)) {
            revert EventTicketNFT__InvalidOwnerAddress();
        }
        transferOwnership(initialOwner); // ✅ Set the real owner
        s_tokenCounter = 0;
    }

    /**
     * @dev Public function to mint a new ticket
     * @param tokenURI The metadata URI for this ticket
     * @return newTokenId The ID of the newly minted ticket
     */
    function mintTicket(string memory tokenURI) public returns (uint256) {
        if (bytes(tokenURI).length == 0) {
            revert EventTicketNFT__EmptyTokenURI();
        }
        
        uint256 newTokenId = s_tokenCounter;
        
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        s_tokenCounter += 1;
        
        emit TicketMinted(msg.sender, newTokenId, tokenURI);
        
        return newTokenId;
    }

    /**
     * @dev Owner-only function to mint a ticket to a specific address
     * @param to The address that will own the minted ticket
     * @param uri The metadata URI for this ticket
     */
    function safeMint(address to, string memory uri) public onlyOwner {
        if (to == address(0)) {
            revert EventTicketNFT__InvalidRecipientAddress();
        }
        
        if (bytes(uri).length == 0) {
            revert EventTicketNFT__EmptyTokenURI();
        }
        
        uint256 tokenId = s_tokenIdCounter.current();
        s_tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        emit TicketMinted(to, tokenId, uri);
    }
    
    /**
     * @dev Get the current token counter value
     * @return The current token counter
     */
    function getTokenCounter() external view returns (uint256) {
        return s_tokenCounter;
    }
}
