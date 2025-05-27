// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract EventNFT is ERC721URIStorage {
    uint256 public tokenCount;

    constructor() ERC721("EventTicket", "EVT") {}

    function mint(string memory _tokenURI) public returns (uint256) {
        tokenCount++;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        return tokenCount;
    }
}
