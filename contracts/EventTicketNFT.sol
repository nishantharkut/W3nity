// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EventTicketNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    uint256 public tokenCounter;

    constructor(address initialOwner)
        ERC721("Event Ticket", "ETIX")
        Ownable() // ✅ Fixed: no arguments allowed in OZ v4
    {
        transferOwnership(initialOwner); // ✅ Set the real owner
        tokenCounter = 0;
    }

    function mintTicket(string memory tokenURI) public returns (uint256) {
        uint256 newTokenId = tokenCounter;
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        tokenCounter += 1;
        return newTokenId;
    }

    event TicketMinted(
        address indexed to,
        uint256 indexed tokenId,
        string tokenURI
    );

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        emit TicketMinted(to, tokenId, uri);
    }
}
