
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract TokenERC721 is ERC721URIStorage {
    uint256 _currentTokenId = 0;

    constructor() ERC721("TokenERC721", "MET721") {}

    function mint(address to, string memory tokenUri) external {
        uint256 tokenId = _currentTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenUri);
    }

}
//0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0