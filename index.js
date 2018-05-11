const Web3 = require('web3');

var dbEvents;
var dbAddress;
var dbABI;

function startApp() {
  var dbAddress = 'CONTRACT_ADDRESS';
  var dbABI = {ABI}
  var web3Infura = new Web3(new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/ws'));
  dbEvents = new web3Infura.eth.Contract(dbABI, dbAddress);
}

// This is the starting block we use when querying the blockchain
const startingBlock = 0;

// getLatest() is the important function here

// You can put whatever params and event you want here
// just replace 'Table' with the name of your event
const getLatest = (row) => dbEvents.getPastEvents('Table', {
    filter: {_row: row},
    fromBlock: startingBlock,
    toBlock: 'latest'
}, function(error, events){ return null; }).then(function(events) {
  // `events` is an array of `event` objects that we can iterate
  // In this case we just return the last event in the array

  // latest is an event object that will be return
  let latest = events[events.length - 1];

  // We can restrict the startingBlock to 1 block before the latest events blockNumber
  // This will be important later on when we want to query the latest event without starting from block 0 every time
  startingBlock = latest.blockNumber - 1;

  return latest;
});

const print = (event) => {
  if (!event)
    return

  let output = ``
  output += `----------------------\n`
  output += `New Entry\n`
  output += `----------------------\n`
  output += `Row: ${event._row}\n`
  output += `Column: ${event._column}\n`
  output += `Value: ${event._value}\n`
  output += `----------------------\n`
  console.log(output)
}

const retrieveAndPrint = (row) => {
    let latestEvent = getLatest(row);
    print(latestEvent);
}
