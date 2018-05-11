pragma solidity ^0.4.23;


contract Token {

    // Here the 'Balances' event is treated as an SQL Table
    // Each property is indexed and can be retrieved easily via web3.js
    // Event Tables + web3.js = Makeshift Relational Database on the Blockchain
    event Balances(uint256 indexed _address, uint256 indexed _amount, string indexed _action);
    /*
    _______
    |||Balances|||
    -----------
    | addresses |    balances    |
    | 0x1...    |              1 |
    | 0x2...    |              2 |
    | 0x3...    |           9001 |
    */

    function deposit(address _addr, uint256 _amount) public {
        emit Balances(_addr, _amount, "plus");
    }

    function withdraw(address _addr, uint256 _amount) public {
        emit Balances(_addr, _amount, "minus");
    }

    function transfer(address _from, address _to, uint256 _amount) public {
        withdraw(_from, _amount);
        deposit(_to, _amount);
    }
}
