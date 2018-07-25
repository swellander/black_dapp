pragma solidity ^0.4.22;

// 1 deck of 52 cards
// ACE is 11
// i could use unicode card number https://en.wikipedia.org/wiki/Standard_52-card_deck

contract Blackdapp {
    address public manager;
    
    // uint8[52] public deck;
    // uint8[9] public playerCards;
    // uint8[9] public dealerCards;

    mapping (uint8 => uint8) deck;
    mapping (uint8 => uint8) playerCards;
    mapping (uint8 => uint8) dealerCards;

    uint numDeck;

    constructor() public {
        manager = msg.sender;

        // initDeck(deck);
        // initPlayerHand(playerCards);
        // initDealerHand(dealerCards);
    }

    function enter() public payable {
        // TODO shuffle
        
        require(msg.value > .01 ether);
    }

    function shuffleDeckArray() public {
        uint8[52] d;

        for (uint8 i = 0; i < 52-1; i++) {
            uint256 rand = randHash(i);
            uint8 randIndex = randomBetween(rand, i, 52);
            
            swapArray(d, i, randIndex);
        }
    }

    function shuffleDeckMapping() public {

        for (uint8 i = 0; i < 52-1; i++) {
            uint256 rand = randHash(i);
            uint8 randIndex = randomBetween(rand, i, 52);
            
            uint8 card1 = deck[i];
            uint8 card2 = deck[randIndex];

            // init on the fly
            if (card1 == 0) {
                card1 = i + 1;
            }
            // init on the fly
            if (card2 == 0) {
                card2 = randIndex + 1;
            }

            ( deck[i], deck[randIndex] ) = swap(card1, card2);
        }
    }

    function giveTwoCardsToPlayer() public {
        uint8 deckCardGiven = 100;
        uint8 undefinedPlayerCard = 0;

        uint8 cardsToGive = 0;
        //uint8[] memory cardsGiven = new uint8[](2);
        uint8[2] memory cardsGiven;

        // pick two cards from deck
        for (uint8 i = 0; i < 52 && cardsToGive < 2; i++) {
            if(deck[i] != deckCardGiven){
                cardsGiven[cardsToGive] = deck[i];
                deck[i] = deckCardGiven;
                cardsToGive++;
            }
        }

        // assign cards to player
        for (uint8 j = 0; j < 9 && cardsToGive > 0; j++) {
            if(playerCards[j] == undefinedPlayerCard) {
                cardsToGive--;
                playerCards[j] = cardsGiven[cardsToGive];
            }
        }
    }

    function giveTwoCardsToDealer() public {
        uint8 deckCardGiven = 100;
        uint8 undefinedPlayerCard = 0;

        uint8 cardsToGive = 0;
        //uint8[] memory cardsGiven = new uint8[](2);
        uint8[2] memory cardsGiven;

        // pick two cards from deck
        for (uint8 i = 0; i < 52 && cardsToGive < 2; i++) {
            if(deck[i] != deckCardGiven){
                cardsGiven[cardsToGive] = deck[i];
                deck[i] = deckCardGiven;
                cardsToGive++;
            }
        }

        // assign cards to dealer
        for (uint8 j = 0; j < 9 && cardsToGive > 0; j++) {
            if(dealerCards[j] == undefinedPlayerCard) {
                cardsToGive--;
                dealerCards[j] = cardsGiven[cardsToGive];
            }
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
        uint8 undefinedPlayerCard = 0;

        if (card == undefinedPlayerCard) {
            return 0;
        } else if (card >= 1 && card <= 9) {
            // clubs [2-10]
            return card;
        } else if (card >= 14 && card <= 22) {
            // diamonds [2-10]
            return card - 12;
        } else if (card >= 27 && card <= 35) {
            // hearts [2-10]
            return card - 25;
        } else if (card >= 40 && card <= 48) {
            // spades [2-10]
            return card - 38;
        } else if (card == 0 || card == 13 || card == 26 || card == 39) {
            // ACE
            return 11;
        } else {
            // JACK or QUEEN or KING
            return 10;
        }
    }

    function computePlayerHandValue(uint8[9] card) public pure returns (uint8) {
        uint8 undefinedCard = 0;
        uint8 handValue = 0;

        for (uint8 i = 0; i < 9; i++) {
            if (card[i] != undefinedCard) {
                handValue = handValue + computeCardValue(card[i]);
            }
        }

        return handValue;
    }

    function dealerDecision(uint8 playerHandValue, uint8 dealerCardValue) public pure returns (bytes2) {
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

    function swap(uint8 card1, uint8 card2) private pure returns (uint8, uint8) {
        return (card2, card1);
    }

    function swapArray(uint8[52] storage d, uint8 index1, uint8 index2) private {
        uint8 tmp = d[index1];
        d[index1] = d[index2];
        d[index2] = tmp;
    }

    function randHash(uint8 _seed) private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, _seed)));
    }

    // https://www.i-programmer.info/programming/theory/2744-how-not-to-shuffle-the-kunth-fisher-yates-algorithm.html
    function randomBetween(uint256 _rand, uint8 _min, uint8 _max) private pure returns (uint8) {
        return uint8(_min + (_rand % (_max-_min)));
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function getDealerVisibleCard() public view returns (uint8) {
        return dealerCards[0];
    }



    function initDeckMapping() public {
        for (uint8 i = 0; i < 52; i++) {
            deck[i] = i + 1;
        }
    }

    function initDeck(uint8[52] storage d) private {
        for (uint8 i = 0; i < 52; i++) {
            d[i] = i + 1;
        }
    }

    function initPlayerHand(uint8[9] storage hand) private {
        uint8 undefinedCard = 0;

        for (uint8 i = 0; i < 9; i++) {
            hand[i] = undefinedCard;
        }
    }

    function initDealerHand(uint8[9] storage hand) private {
        uint8 undefinedCard = 0;

        for (uint8 i = 0; i < 9; i++) {
            hand[i] = undefinedCard;
        }
    }
}