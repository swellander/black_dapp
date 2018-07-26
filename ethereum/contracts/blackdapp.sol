pragma solidity ^0.4.22;

// 1 deck of 52 cards
// ACE is 11
// i could use unicode card number https://en.wikipedia.org/wiki/Standard_52-card_deck

contract Blackdapp {
    address public manager;

    // uint8[52] public deck;

    struct Game {
        address player;
        uint256 payout;
    }

    event GameStarted(uint256 gameId, address player);
    // gameended-outcome is 0 player lost, 1 player won
    event GameEnded(uint256 gameId, address player, uint8 outcome, uint8 playerHandValue, uint8 dealerHandValue);

    mapping (uint256 => Game) public games;

    constructor() public {
        manager = msg.sender;
    }

    function enter(uint256 gameId) public {
        // require(msg.value > .01 ether);
        games[gameId] = Game({player: msg.sender, payout: 0});
        emit GameStarted(gameId, msg.sender);
    }

    // return player hand value
    function computePlayerHand(uint8[] cards, uint8 numberOfCards) public pure returns (uint8) {
        uint8 value;

        for (uint8 i = 0; i < numberOfCards; i++) {
            value += computeCardValue(cards[i]);
        }

        return value;
    }

    function finalize(uint256 gameId, uint8[] playerCards, uint8 numberOfPlayerCards, uint8[] dealerCards, uint8[] deck) public returns (uint8) {
        uint8 playerValue = computePlayerHand(playerCards, numberOfPlayerCards);

        uint8 dealerCard1 = dealerCards[0];
        uint8 dealerCard2 = dealerCards[1];
        uint8 dealerValue = computeCardValue(dealerCard1) + computeCardValue(dealerCard2);

        uint8 dealerWantsOneMoreCardCounter = 0;

        bytes2 dealer = dealerDecision(playerValue, dealerValue);
        while(dealer == 'H'){
            uint8 dealerNewCard = deck[dealerWantsOneMoreCardCounter];
            dealerWantsOneMoreCardCounter++;

            dealerValue += computeCardValue(dealerNewCard);
            dealer = dealerDecision(playerValue, dealerValue);
        }

        uint8 result = whoWins(playerValue, dealerValue);

        emit GameEnded(gameId, msg.sender, result, playerValue, dealerValue);
        if(result == 0){
            // play lost
        } else {
            // play won
        }

        return result;
    }

    // returns 0 if player loses
    // returns 1 if player wins
    function whoWins(uint8 playerValue, uint8 dealerValue) private pure returns (uint8) {
        if (playerValue > 21) {
            return 0;
        }

        if (dealerValue > 21) {
            return 1;
        }

        if (playerValue == 21 && dealerValue == 21) {
            return 1;
        }

        if (playerValue > dealerValue) {
            return 1;
        } else {
            return 0;
        }
    }


    // The value of cards two through ten is their pip value (2 through 10).
    // Face cards (Jack, Queen, and King) are all worth ten.
    // Aces can be worth one or eleven.
    // A hand's value is the sum of the card values.
    // Players are allowed to draw additional cards to improve their hands.
    // A hand with an ace valued as 11 is called "soft", meaning that the hand will not bust by taking an additional card;
    // the value of the ace will become one to prevent the hand from exceeding 21. Otherwise, the hand is "hard".
    function computeCardValue(uint8 card) public pure returns (uint8) {
        // uint8 undefinedPlayerCard = 0;

        uint8 mod13 = card % 13;

        if (1 <= mod13 && mod13 <= 9) {
            // [2-9]
            return mod13+1;
        } else if (mod13 == 0) {
            // ACE
            return 11;
        } else {
            // JACK or QUEEN or KING
            return 10;
        }
    }

    function dealerDecision(uint8 playerHandValue, uint8 dealerCardValue) public pure returns (bytes2) {
        if (dealerCardValue >= 17) {
            return 'S';  // stand
        }
        if (dealerCardValue > playerHandValue) {
            return 'S';  // stand
        }

        if (playerHandValue >= 17) {
            return 'S';  // stand

        } else if (playerHandValue == 16 && dealerCardValue <= 6) {
            return 'S';  // stand
        } else if (playerHandValue == 16 && dealerCardValue <= 8) {
            return 'H';  // hit
        } else if (playerHandValue == 16) {
            return 'H'; // surrender or hit

        } else if (playerHandValue == 15 && dealerCardValue < 7) {
            return 'S';  // stand
        } else if (playerHandValue == 15 && dealerCardValue >= 7) {
            return 'H';  // hit

        } else if (playerHandValue >= 13 && dealerCardValue < 7) {
            return 'S';  // stand
        } else if (playerHandValue >= 13 && dealerCardValue >= 7) {
            return 'H';  // hit

        } else if (playerHandValue == 12 && dealerCardValue < 4) {
            return 'H';  // hit
        } else if (playerHandValue == 12 && dealerCardValue < 7) {
            return 'S';  // hit
        } else if (playerHandValue == 12) {
            return 'H';  // hit

        } else if (playerHandValue == 11) {
            return 'H';  // hit - bet DOUBLE

        } else if (playerHandValue == 10 && dealerCardValue < 10) {
            return 'H';  // hit - bet DOUBLE
        } else if (playerHandValue == 10 && dealerCardValue >= 10) {
            return 'H';  // hit

        } else if (playerHandValue == 9 && dealerCardValue == 2) {
           return 'H';  // hit
        } else if (playerHandValue == 9 && dealerCardValue < 7) {
            return 'H';  // hit - bet DOUBLE
        } else if (playerHandValue == 9 && dealerCardValue >= 7) {
            return 'H';  // hit

        } else {
            return 'H';  // hit
        }
    }
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

}
