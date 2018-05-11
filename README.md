# CEL-DB
The Contract Event Log Database - log data in event logs on smart contracts, retrieve the data with web3.js
*An experiment by Ghilia Weldesselasie*

## Challenge

To build a database system that is/can:
[x] Fully decentralized (no closed backend)
[x] Hold data from smart contract event logs
[x] Be queried by anyone
[x] Be easily shared

One could use [OrbitDB](https://github.com/orbitdb/orbit-db) because it can be easily shared (via the address hash) and be queried by anyone who has the DB address, but it requires a closed backend that receives event data and adds it to the DB. This defeats the purpose of the challenge.

## Methodology

This challenge required rethinking how events need to be treated. Currently event logs are only considered a way to get your data from the blockchain to your app. You can then either add the data to your own closed DB or choose to manipulate and do something with that data. Since event logs can't be read by contracts since they are not part of consensus state this is logs were treated up until now.

The main gripe I have with this way of thinking is that if we are going to be putting data on the blockchain shouldn't we be able to continuously query the blockchain for the data we want? We already do this with smart contracts and their `view` functions, why can't we do this with event logs as well instead of watching for events, passing their data on to other functions and discarding the events?

This experiment reimagines what events represent. Instead of event logs being "messages" or "packages" delivered to your Dapp frontend in the form of data, we treat events as being their own SQL tables in a sense, meaning contracts can now act as simple databases.

Here's a Solidity example of an "Event Table":
```
  event Table(uint256 indexed _row, string indexed _column, string indexed _value);

  function put(uint256 _row, string _column, string _value) public {
    emit Table(_row, _column, _value);
  }
```
In this example, our "Table" (table in quotes refers to our makeshift SQL table) has a row parameter, a column parameter and a value parameter. The fact they are all indexed means we can filter the blockchain for specific values and obtain other values from the table in a relational manner. Emitting our Table event can be seen as PUTting data in our row and column fields, with the only downside being you can't delete said additions from the blockchain, but where we're headed that won't be necessary. The smart contract is only the first part of the puzzle.

The second part, web3.js, allows developers to query the blockchain and obtain all past events of a certain event at a particular block number ranges with specific filters. By querying our smart contract for the latest instance of our Table event with specific row and column(optional) values we can obtain the data in our "Table". Now, instead of event logs being data that passes through our Dapp when our node picks them up, logs can be things we query to search for the latest value in a table. Only obtaining the latest instance of an event is essential in order to know the current values of our table since the blockchain never erases or forgets data. This is a trivial function to implement using web3.

To prevent our app from starting at block 0 every time we query the blockchain, we use a strtingBlock variable that holds the block at which the latest event instance returned was published at minus 1. So if our latest event was caught at block #9001, our new starting block when querying the blockchain for another responses would be block #9000. If we didn't do this, our serach would take a long time eventually as our DB becomes more and more populated and more changes are made.

## Findings

My findings using this approach to decentralized DBs are more than satisfactory.

Here's a tl;dr of my findings:

- This type of DB can be easily shared by sharing the contract address and ABI.
- The DB holds data for as long as the blockchain persists in the event logs
- The DB can be queried by anyone who has the contract address and ABI
- It is fully decentralized, there is no closed backend that is adding data to the DB. It's all done via smart contract.
- This strategy could have some pretty neat applications for upgradeable contracts and eternal storage. Writing permissions could always be transferred to different contracts via the `Ownable` contract.

Explore the Database smart contract, `Database.sol`, and the `index.js` file to see how data is added to our event table and the latest instance of an event is retrieved.
