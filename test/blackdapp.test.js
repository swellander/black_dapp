const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledBlackdapp = require('../ethereum/build/Blackdapp.json');

let blackdappContract;

beforeEach(async () => {

  accounts = await web3.eth.getAccounts();
  console.log(accounts);

  // use one of those accounts to deploy the contract
  blackdappContract = await new web3.eth.Contract(JSON.parse(compiledBlackdapp.interface))
    .deploy({ data: compiledBlackdapp.bytecode })
    .send({ from: accounts[0], gas: '1000000' });
});

describe('Blackdapp', () => {
  it('deploys a blackdapp contract', () => {
    assert.ok(blackdappContract.options.address);
  });

  it('init deck', async () => {
    await blackdappContract.methods.initDeckMapping()
      .send({from: accounts[0], gas: '1000000' });
    
    const deck = await blackdappContract.methods.getDeck().call();

    assert.ok(deck);
    console.log('deck', deck);
  });

  /*it('shuffle deck', async () => {
    await blackdappContract.methods.shuffleDeck()
      .send({from: accounts[0], gas: '1000000' });
    
    const shuffledDeck = await blackdappContract.methods.getDeck().call();

    assert.ok(shuffledDeck);
    console.log('shuffledDeck', shuffledDeck);
  });*/
});
