pragma solidity ^0.4.23;


contract Database is Ownable {

    // Here the 'Table' event is treated as an SQL table
    // Each property is indexed and can be retrieved easily via web3.js
    // Event Table + web3.js = Makeshift Relational Database on the Blockchain
    event Table(uint256 indexed _row, string indexed _column, string indexed _value);
    /*
    _______
    |||Table|||
    -----------
    | row |    _column    |    _column2   |
    |  1  |    _value     |    _value     |
    |  2  |    _value     |    _value     |
    |  3  |    _value     |    _value     |
    */

    function put(uint256 _row, string _column, string _value) public onlyOwner {
        emit Table(_row, _column, _value);
    }
}
