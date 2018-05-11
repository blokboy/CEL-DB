const Web3 = require('web3');

var tokenEvents;
var tokenAddress;
var tokenABI;

function startApp() {
  var tokenAddress = 'CONTRACT_ADDRESS';
  var tokenABI = {ABI}
  var web3Infura = new Web3(new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/ws'));
  tokenEvents = new web3Infura.eth.Contract(tokenABI, tokenAddress);
}

tokenEvents.events.Balances()
.on('data', function(event) {
  let data = event.returnValues;
  if(data._action === 'minus') let amount = data._amount * -1;
  else let amount = data._amount;
  emit(data._address, amount);
}).on('error', console.error);

const getBalance = (key) => function(key, values) {
  return sum(values);
}
