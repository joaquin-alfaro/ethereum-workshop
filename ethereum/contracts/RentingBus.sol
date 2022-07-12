// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./utils/Counters.sol";

/**
 * @dev Bus renting. Based on ERC721 standard
 */

contract RentingBus {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address private _owner; // Owner of the Bus
    string private _plate; // "0000 XXX"

    mapping(uint256 => string) private _tokenURIs;

    // Mapping from token ID to owner address
    mapping(uint256 => address) private _owners;

    /**
     * @dev Emitted when `tokenId` token is transferred from `from` to `to`.
     */
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(msg.sender == _owner, "Only the owner can execute this function");
        _;
    }

    constructor (string memory plate) {
        _owner = msg.sender;
        _plate = plate;
    }

    function rent(address customer, string memory uri)
        public
        onlyOwner
        returns (uint256)
    {
        uint256 rentingId = _tokenIds.current();
        _mint(customer, rentingId);
        _setTokenURI(rentingId, uri);

        _tokenIds.increment();
        return rentingId;
    }

    /**
     * @dev Mints `tokenId` and transfers it to `to`.
     *
     * WARNING: Usage of this method is discouraged, use {_safeMint} whenever possible
     *
     * Requirements:
     *
     * - `tokenId` must not exist.
     * - `to` cannot be the zero address.
     *
     * Emits a {Transfer} event.
     */
    function _mint(address to, uint256 tokenId) internal  {
        require(to != address(0), "ERC721: mint to the zero address");
        require(!_exists(tokenId), "ERC721: token already minted");


        _owners[tokenId] = to;

        emit Transfer(address(0), to, tokenId);
    }

    /**
     * @dev Sets `_tokenURI` as the tokenURI of `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view virtual returns (string memory) {
        require(_exists(tokenId), "ERC721URIStorage: URI query for nonexistent token");
        string memory _tokenURI = _tokenURIs[tokenId];
        return _tokenURI;
    }

    /**
     * @dev Returns whether `tokenId` exists.
     *
     * Tokens can be managed by their owner or approved accounts via {approve} or {setApprovalForAll}.
     *
     * Tokens start existing when they are minted (`_mint`),
     * and stop existing when they are burned (`_burn`).
     */
    function _exists(uint256 tokenId) internal view virtual returns (bool) {
        return _owners[tokenId] != address(0);
    }

    function summary() public view returns (string memory, uint256) {
        return (_plate, _tokenIds.current());
    }
}