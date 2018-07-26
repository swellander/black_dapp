import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import blackdapp from './blackdapp';
import BackDappUi from './ui';

// Attempting to deploy from account 0x8c31cC3E155f9C4ef847F8C9968BAf87A90E7682
/*
[{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"games","outputs":[{"name":"player","type":"address"},{"name":"payout","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"manager","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"gameId","type":"uint256"},{"name":"playerCards","type":"uint8[]"},{"name":"numberOfPlayerCards","type":"uint8"},{"name":"dealerCards","type":"uint8[]"},{"name":"deck","type":"uint8[]"}],"name":"finalize","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"card","type":"uint8"}],"name":"computeCardValue","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"card","type":"uint8[9]"}],"name":"computePlayerHandValue","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"gameId","type":"uint256"}],"name":"enter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"cards","type":"uint8[]"},{"name":"numberOfCards","type":"uint8"}],"name":"computePlayerHand","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"playerHandValue","type":"uint8"},{"name":"dealerCardValue","type":"uint8"}],"name":"dealerDecision","outputs":[{"name":"","type":"bytes2"}],"payable":false,"stateMutability":"pure","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"gameId","type":"uint256"},{"indexed":false,"name":"player","type":"address"}],"name":"GameStarted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"gameId","type":"uint256"},{"indexed":false,"name":"player","type":"address"},{"indexed":false,"name":"outcome","type":"uint8"},{"indexed":false,"name":"playerHandValue","type":"uint8"},{"indexed":false,"name":"dealerHandValue","type":"uint8"}],"name":"GameEnded","type":"event"}]
*/
// 0x224761054653d3056c32b097c250c1ca3c12fb55

class PlayingCard extends Component {

  render() {
    const text = this.props.text;
    let color;
    if(this.props.color){
       color = this.props.color;
    } else {
       color = 'black';
    }

    return (<label style={{fontSize: '90px', color: color}}>{text}</label>);
  }
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { manager: '', playerCards: '', result: '', waitTx:false };
    this.backDappUi = new BackDappUi();
  }

  async componentDidMount() {
    const manager = await blackdapp.methods.manager()
      .call();
    //const backDappUi = BackDappUi();
    this.setState({ manager, playerCards:this.backDappUi.getPlayerCards() });
    this.computePlayerHand();
  }

  computePlayerHand = async () => {
    const playerHandValue = await blackdapp.methods.computePlayerHand(this.backDappUi.getPlayerCards(), this.backDappUi.getPlayerCards().length)
      .call();

    console.log('computePlayerHand', playerHandValue)

    if(playerHandValue > 21){
      this.onClickStand()
    }
  }

  reset = async () => {
    this.backDappUi = new BackDappUi();
    this.setState({ playerCards: this.backDappUi.getPlayerCards(), result: '' });
  }

  onClickHit = async () => {
    console.log('onClickHit')
    this.backDappUi.hit();

    this.computePlayerHand()

    console.log('onClickHit', this.backDappUi.getPlayerCards())
    this.setState({ playerCards: this.backDappUi.getPlayerCards() });

    // const accounts = await web3.eth.getAccounts();
    // this.setState({ message: 'Waiting on transaction success...' });
    // await lottery.methods.pickWinner().send({ from: accounts[0] });
    // this.setState({ message: 'A winner has been picked!' });
  };

  onClickStand = async () => {
    console.log('onClickStand')

    const accounts = await web3.eth.getAccounts();

    this.setState({ result: 'Waiting on transaction...', waitTx: true });

    const result = await blackdapp.methods.finalize(this.backDappUi.getGameId(), this.backDappUi.getPlayerCards(), this.backDappUi.getPlayerCardsGiven(), this.backDappUi.getDealerCards(), this.backDappUi.getRemainingDeck())
      .send({from: accounts[0], gas: '1000000' });
    // const accounts = await web3.eth.getAccounts();
    // this.setState({ message: 'Waiting on transaction success...' });
    // await lottery.methods.pickWinner().send({ from: accounts[0] });
    // this.setState({ message: 'A winner has been picked!' });

    console.log('onClickStand.outcome', result.events.GameEnded.returnValues.outcome, result)

    this.setState({ result: 'Waiting on transaction...', waitTx: false });

    if (result.events.GameEnded.returnValues.outcome === "1" ){
      this.setState({ result: 'You won! tx ' + result.transactionHash });
    } else {
      this.setState({ result: 'You lost! =( tx ' + result.transactionHash });
    }

  };

  render() {
    //console.log('BackDappUi', BackDappUi);
    //console.log('BackDappUi-instance1', new BackDappUi());
    //console.log('BackDappUi-instance2', BackDappUi());
    //console.log('web3.version is', web3.version)
    //web3.eth.getAccounts().then(console.log)

    let toPlayingCardDisplay = (c) => {
      const mod13 = c % 13;
      let suit;
      let color;

      if(c < 13) {
        // clubs
        suit = 56529;
        color = 'black';
      } else if (c < 26) {
        // diamons
        suit = 56513;
        color = 'red';
      } else if (c < 39) {
        // hearts
        suit = 56497;
        color = 'red';
      } else {
        // spades
        suit = 56481;
        color = 'black';
      }

      let letter = suit + mod13;

      // U+1F0A1 0x1F0A1 127137
      // '\uD83C\uDCA1' 0xDCA1 => 56481
      // '\uD83C\uDCA1' 0xDCB1 => 56497
      // '\uD83C\uDCA1' 0xDCC1 => 56513
      // '\uD83C\uDCA1' 0xDCD1 => 56529

      //return (<label>{String.fromCharCode(55356)+String.fromCharCode(letter)}</label>)
      return (<label key={String.fromCharCode(55356)+String.fromCharCode(letter)}><PlayingCard text={String.fromCharCode(55356)+String.fromCharCode(letter)} color={color} /></label>)
      //return String.fromCharCode(55356)+String.fromCharCode(56481)
      //return '\uD83C\uDCA1'
      //return <li key={card1spades}><PlayingCard text={card1spades} /></li>
      //return <PlayingCard text={card1spades} />
    }

    let deck;
    let playerCards;
    let dealerCards;

    if(this.state.playerCards) {
      playerCards = this.state.playerCards.map(toPlayingCardDisplay);
      console.log('this.state.playerCards',this.state.playerCards.join());
    }

    if (this.backDappUi){
      console.log('this.backDappUi.getRemainingDeck()',this.backDappUi.getRemainingDeck().join());
      console.log('this.backDappUi.getDealerCards()',this.backDappUi.getDealerCards().join());
      dealerCards = [this.backDappUi.getDealerCards()[0]].map(toPlayingCardDisplay);
      deck = this.backDappUi.getRemainingDeck().map(toPlayingCardDisplay);
    }

    //const card1 = String.fromCharCode('127137');
    /*const card1spades = '\uD83C\uDCA1';
    const card2spades = '\uD83C\uDCA2';
    const card1hearts = '\uD83C\uDCB1';
    const card2hearts = '\uD83C\uDCB2';
    const card1diamons = '\uD83C\uDCC1';
    const card2diamons = '\uD83C\uDCC2';
    const card1clubs = '\uD83C\uDCD1';
    const card2clubs = '\uD83C\uDCD2';*/

    // <p><PlayingCard text={card1spades}/><PlayingCard text={card1clubs}/></p>
    // <p><PlayingCard text={card1hearts} color='red'/><PlayingCard text={card1diamons} color='red'/></p>

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to BlackDapp</h1>
        </header>
        <p>Contract manager is {this.state.manager}</p>
        <p style={{fontSize: '40px', fontWeight: 'bold'}}>{this.state.result}</p>
        <p>Deck is {deck}</p>
        <p>Player cards are {playerCards}</p>
        <p>Dealer card is {dealerCards}</p>
        <button disabled={this.state.waitTx} onClick={this.onClickHit}>Hit!</button>
        <button disabled={this.state.waitTx} onClick={this.onClickStand}>Stand!</button>
        <button disabled={this.state.waitTx} onClick={this.reset}>reset</button>
      </div>
    );
  }
}

export default App;
