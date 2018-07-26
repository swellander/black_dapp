import web3 from './web3';

const address = '0x224761054653d3056c32b097c250c1ca3c12fb55';

const abi = [
  {"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"games","outputs":[{"name":"player","type":"address"},{"name":"payout","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
  {"constant":true,"inputs":[],"name":"manager","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},
  {"constant":false,"inputs":[{"name":"gameId","type":"uint256"},{"name":"playerCards","type":"uint8[]"},{"name":"numberOfPlayerCards","type":"uint8"},{"name":"dealerCards","type":"uint8[]"},{"name":"deck","type":"uint8[]"}],"name":"finalize","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"nonpayable","type":"function"},
  {"constant":true,"inputs":[{"name":"card","type":"uint8"}],"name":"computeCardValue","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"pure","type":"function"},
  {"constant":true,"inputs":[{"name":"card","type":"uint8[9]"}],"name":"computePlayerHandValue","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"pure","type":"function"},
  {"constant":false,"inputs":[{"name":"gameId","type":"uint256"}],"name":"enter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
  {"constant":true,"inputs":[{"name":"cards","type":"uint8[]"},{"name":"numberOfCards","type":"uint8"}],"name":"computePlayerHand","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"pure","type":"function"},
  {"constant":true,"inputs":[{"name":"playerHandValue","type":"uint8"},{"name":"dealerCardValue","type":"uint8"}],"name":"dealerDecision","outputs":[{"name":"","type":"bytes2"}],"payable":false,"stateMutability":"pure","type":"function"},
  {"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},
  {"anonymous":false,"inputs":[{"indexed":false,"name":"gameId","type":"uint256"},{"indexed":false,"name":"player","type":"address"}],"name":"GameStarted","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":false,"name":"gameId","type":"uint256"},{"indexed":false,"name":"player","type":"address"},{"indexed":false,"name":"outcome","type":"uint8"},{"indexed":false,"name":"playerHandValue","type":"uint8"},{"indexed":false,"name":"dealerHandValue","type":"uint8"}],"name":"GameEnded","type":"event"}
];

export default new web3.eth.Contract(abi, address);
