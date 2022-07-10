// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./TransferToken.sol";

/**
 * @dev Tokenization transfers. Based on ERC20 standard
 */
contract TransferBus {
    address payable private _owner; // Owner of the Bus
    string private _make;  // Make of the bus - e.g. IVECO -
    string private _model; // Model of the bus - e.g. MAGELYS -
    string private _plate; // "0000 XXX"
    uint8 private _seats;  // Number of seats

    mapping(address => uint256) private _price;
    address[] private _schedule;

    /**
     * @dev Emitted when listing transfer from `origin` to `destination` 
     * for (`datetime`).
     */
    event TransferListed(uint256 indexed datetime, string origin, string destination);

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(msg.sender == _owner, "Only the owner can execute this function");
        _;
    }

    constructor (string memory make, string memory model, string memory plate, uint8 seats) {
        _owner = payable(msg.sender);

        _make = make;
        _model = model;
        _plate = plate;
        _seats = seats;
    }

    function list(uint256 datetime, string memory origin, string memory destination, uint8 seats, uint256 price) public onlyOwner {
        require(seats <= _seats, "Not allowed to list more seats than supported by the bus");

        TransferToken transfer = new TransferToken(datetime, origin, destination, seats);
        _schedule.push(address(transfer));
        _price[address(transfer)] = price;

        emit TransferListed(datetime, origin, destination);
    }

    function buy(address schedule, uint8 units) public payable {
        uint256 price = _price[schedule];
        uint256 amount = units*price;
        require(msg.value == amount, "Not enough funds");

        TransferToken(schedule).transfer(msg.sender, units);
    }

    function getSchedule() public view returns (address[] memory) {
        return _schedule;
    }

    function getPrice(address transfer) public view returns (uint256) {
        return _price[transfer];
    }
}
