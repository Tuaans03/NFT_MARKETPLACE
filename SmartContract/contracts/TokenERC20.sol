// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenERC20 is ERC20 {
    address public admin;

    constructor() ERC20("TokenERC20", "MET20") {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    function mint(address account, uint256 amount) external onlyAdmin {
        _mint(account, amount);
    }
}
///0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512