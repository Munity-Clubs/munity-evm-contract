// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../munity.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

contract ReentrantBuyer is IERC1155Receiver, ERC165 {
    Munity public immutable munity;
    uint256 public targetId;
    bool public attempted;
    bool public blocked;

    constructor(Munity _munity) {
        munity = _munity;
    }

    function attack(uint256 _id, uint256 _amount) external payable {
        targetId = _id;
        munity.buy{value: msg.value}(_id, _amount);
    }

    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes calldata
    ) external override returns (bytes4) {
        if (!attempted) {
            attempted = true;
            try munity.buy(targetId, 1) {
                blocked = false;
            } catch {
                blocked = true;
            }
        }
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] calldata,
        uint256[] calldata,
        bytes calldata
    ) external pure override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC165, IERC165)
        returns (bool)
    {
        return interfaceId == type(IERC1155Receiver).interfaceId || super.supportsInterface(interfaceId);
    }
}
