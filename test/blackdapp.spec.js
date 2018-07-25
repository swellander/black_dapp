const expect = require('chai').expect;
const ganache = require('ganache-cli');
const options = { gasLimit: 8000000 }
const Web3 = require('web3');
const web3 = new Web3(ganache.provider(options));
const { interface, bytecode } = require('../compiledBlackDapp.json');

let accounts;
let BlackDapp;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  BlackDapp = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: '8000000' });
});

//TODO: Organizes tests into multiple describe blocks, one for call functions and another for send functions

describe('BlackDapp contract', () => {
  it('it has an address', () => {
    expect(BlackDapp.options.address).to.be.ok;
  });
  it('sets manager to the account that deployed the contract', async () => {
    const manager = await BlackDapp.methods.manager().call();
    expect(manager).to.eql(accounts[0]);
  });
  it('initializes an ordered deck of 52 cards', async () => {
    let expected = [];
    for (let i = 0; i < 52; i++) expected.push(i+'');
    const deck = await BlackDapp.methods.getDeck().call();
    expect(deck).to.eql(expected);
  });

  //TODO: write test to verify that the deck can be shuffled

  it('initializes an empty hand of 9 cards for player', async () => {
    let expected = [];
    for (let i = 0; i < 9; i++) expected.push('200');
    const playerHand = await BlackDapp.methods.getPlayerHand().call();
    expect(playerHand).to.eql(expected);
  });
  it('can deal the player multiple cards from shuffled deck', async () => {
    await BlackDapp.methods.shuffleDeck().send({ from: accounts[0], gas: 8000000 });
    await BlackDapp.methods.giveTwoCardsToPlayer().send({ from: accounts[0] });
    let playerHand = await BlackDapp.methods.getPlayerHand().call();
    expect(playerHand[0]).to.not.eql('200');
    expect(playerHand[1]).to.not.eql('200');

    await BlackDapp.methods.giveTwoCardsToPlayer().send({ from: accounts[0] });
    playerHand = await BlackDapp.methods.getPlayerHand().call();
    expect(playerHand[2]).to.not.eql('200');
    expect(playerHand[3]).to.not.eql('200');
  });
  it('removes cards from deck after dealing', async () => {
    await BlackDapp.methods.shuffleDeck().send({ from: accounts[0], gas: 8000000 });
    await BlackDapp.methods.giveTwoCardsToPlayer().send({ from: accounts[0] });
    const deck = await BlackDapp.methods.getDeck().call();
    expect(deck[0]).to.eql('100');
    expect(deck[1]).to.eql('100');
  });
  it('can compute the value of a given card', async () => {
    let value = await BlackDapp.methods.computeCardValue(34).call();
    expect(value).to.equal('9');
    value = await BlackDapp.methods.computeCardValue(51).call();
    expect(value).to.equal('10');
  });
  it('can compute the value of players hand', async () => {
    let playerHand = [ 200, 200, 200, 200, 200, 200, 200, 200, 200 ]
    let value = await BlackDapp.methods.computePlayerHandValue(playerHand).call();
    expect(value).to.equal('0');

    playerHand = [ 32, 48, 200, 200, 200, 200, 200, 200, 200 ];
    value = await BlackDapp.methods.computePlayerHandValue(playerHand).call();
    expect(value).to.equal('17');
  }); 
  // it('dealer knows when to stay', async () => {

  // })
});

