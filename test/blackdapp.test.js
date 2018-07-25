const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledBlackdapp = require('../ethereum/build/Blackdapp.json');
const BackDappUi = require('../ui.js').BackDappUi;
//console.log('BackDappUi require=', BackDappUi);
const backDappUi = new BackDappUi();

let blackdappContract;

let init = async () => {
  //console.log("###beforeEach###");
  accounts = await web3.eth.getAccounts();
  //console.log(accounts);

  // use one of those accounts to deploy the contract
  blackdappContract = await new web3.eth.Contract(JSON.parse(compiledBlackdapp.interface))
    .deploy({ data: compiledBlackdapp.bytecode })
    .send({ from: accounts[0], gas: '1000000' });
}

beforeEach(init);

describe('Blackdapp', () => {
  it('deploys a blackdapp contract', () => {
    assert.ok(blackdappContract.options.address);
  });

  it('listens to events', () => {
    blackdappContract.events.GameStarted().on('data', function(event) {
      console.log("GameStarted: ", event);
    }).on("error", console.error);
    blackdappContract.events.GameEnded().on('data', function(event) {
      console.log("GameEnded: ", event);
    }).on("error", console.error);
  })

  it('get shuffled deck', async () => {
    const deck = backDappUi.getDeck();
    assert.ok(deck);
    // console.log('deck', deck);
  });

  it('UI has gameId', async () => {
    assert.ok(backDappUi.getGameId());
    console.log('gameId', backDappUi.getGameId());
  });

  it('enter game', async () => {
    await blackdappContract.methods.enter(backDappUi.getGameId())
      .send({from: accounts[0], gas: '1000000' });

    const gameDetails = await blackdappContract.methods.games(backDappUi.getGameId()).call();

    assert.ok(gameDetails);
    console.log('entered gameDetails', gameDetails);
  });

  it('get UI player cards', () => {
    const playerCards = backDappUi.getPlayerCards();

    assert.ok(playerCards);
    console.log('UI playerCards', playerCards);
  });

  it('get UI dealer cards', () => {
    const dealerCards = backDappUi.getDealerCards();

    assert.ok(dealerCards);
    console.log('UI dealerCards', dealerCards);
  });

  it('compute hands', async () => {
    // function computePlayerHand(uint8[] cards, uint8 numberOfCards) public pure returns (uint8) 
    const playerHandValue = await blackdappContract.methods.computePlayerHand(backDappUi.getPlayerCards(), backDappUi.getPlayerCards().length)
      .call();
    const dealerHandValue = await blackdappContract.methods.computePlayerHand(backDappUi.getDealerCards(), backDappUi.getDealerCards().length)
      .call();

    assert.ok(playerHandValue);
    assert.ok(dealerHandValue);
    console.log('playerHandValue=', playerHandValue, 'dealerHandValue=', dealerHandValue);
  });

  it('remaining deck has 52-4 cards', async () => {
    console.log('backDappUi.getRemainingDeck()', backDappUi.getRemainingDeck());

    assert.ok(backDappUi.getRemainingDeck());
    assert(backDappUi.getRemainingDeck().length, 52-4);
  });

  it('player stand', async () => {
    // console.log('play stand, parameters=', backDappUi.getGameId(), backDappUi.getPlayerCards(), backDappUi.getPlayerCardsGiven(), backDappUi.getDealerCards(), backDappUi.getRemainingDeck());

    const result = await blackdappContract.methods.finalize(backDappUi.getGameId(), backDappUi.getPlayerCards(), backDappUi.getPlayerCardsGiven(), backDappUi.getDealerCards(), backDappUi.getRemainingDeck())
      .send({from: accounts[0], gas: '1000000' });

    //assert.ok(result);
    //assert.ok(result.returnValues);
    
    // console.log('play stand. 0 is lose. 1 is win. game ended with=', result);
    // console.log('play stand. 0 is lose. 1 is win. game ended with=', result.events.GameEnded.returnValues);
    console.log('play stand. 0 is lose. 1 is win. game ended with=', result.events.GameEnded.returnValues.outcome);
  });

  /*it('shuffle deck', async () => {
    await blackdappContract.methods.shuffleDeck()
      .send({from: accounts[0], gas: '1000000' });
    
    const shuffledDeck = await blackdappContract.methods.getDeck().call();

    assert.ok(shuffledDeck);
    console.log('shuffledDeck', shuffledDeck);
  });*/
});
