// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract TokenERC1155 is ERC1155 {

    constructor() ERC1155("TokenERC1155") {}

    function mint(address account, uint256 id, uint256 amount, string memory uri, bytes memory data) external {
        _mint(account, id, amount, data);
        _setURI(uri);
    }
}
//0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9