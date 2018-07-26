class BackDappUi {

    constructor(){
        this.gameId = Math.random() * 1000000000;
        this.playerCardsAfterTwo = 0;
        this.deck = this.makeShuffledDeck();
    }

    getGameId(){
        return this.gameId;
    }

    hit(){
      this.playerCardsAfterTwo = this.playerCardsAfterTwo + 1;
      console.log('hit', this.playerCardsAfterTwo)
    }

    getPlayerCardsGiven(){
        return this.playerCardsAfterTwo + 2;
    }

    stand(){
        // call contract
    }

    getPlayerCards(){
        var playerCards = [];
        let deck = this.getDeck();
        let playerCard1 = deck[0];
        let playerCard2 = deck[1];

        playerCards.push(playerCard1);
        playerCards.push(playerCard2);

        for (var i = 0; i<this.playerCardsAfterTwo; i++){
            playerCards.push(deck[4+i]);
        }

        console.log('getPlayerCards.length', playerCards.length)

        return playerCards;
    }

    getRemainingDeck(){
        //console.log('getRemainingDeck', this.getPlayerCardsGiven(), this.getDeck());
        return this.getDeck().slice(this.getPlayerCardsGiven()+2, this.getPlayerCardsGiven()+2+12);
    }

    getDealerCards(){
        var dealerCards = [];
        let deck = this.getDeck();

        dealerCards.push(deck[2]);
        dealerCards.push(deck[3]);

        return dealerCards;
    }

    makeShuffledDeck(){
        var d = [];

        // init deck
        for (let i = 0; i < 52; i++) {
            d[i] = i;
        }

        // shuffle
        this.shuffle(d)

        return d;
    }

    getDeck(){
        return this.deck;
    }

    /**
     * Shuffles array in place.
     * @param {Array} a items An array containing the items.
     */
    shuffle(a) {
        var j, x, i;

        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }

        return a;
    }

}

//use following line for tests
//module.exports.BackDappUi = BackDappUi;

// use following line for ui
export default BackDappUi;
