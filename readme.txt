Black Dapp - A decentralized 21 


# design decisions

contract will not self initialize a deck. it costs too much gas (gas limit reached).
contract will not self shuffle cards. it costs too much gas (gas limit reached).

source of randomness will be done in the UI. 
before a player can play he has to enter(gameId) and pay. gameId is uniqueId generated on the UI. contract use that for multiplayer and track the user blackdapp progress. 

the UI will send an event !PlayerStartedNewGame

the UI will shuffle a deck of 52 cards.
the UI will pick the random cards given to Player-John.
the UI will pick the random cards given to Dealer-Bank.
the UI will remember the cards given, cards[]
    cards[0] is Player-John card-1
    cards[1] is Player-John card-2
    cards[2] is Dealer-Bank card-1
    cards[3] is Dealer-Bank card-2
the UI will hide Dealer-Bank card-2

in the UI, the user will decide to 'Stand' or 'Hit'. 
on 'Stand', the UI will call the contract finalize(cards)
on 'Hit', the UI will call the contract finalize(cards)
the contract will send an event, !GameResult
    finalize(cards), will reject the user if game is not over?

when Player-John decides to stand, the UI will send (cards[] and user-#-of-cards) to the contract and the contract act as Dealer-Bank and decide what to do, Hit/Stand and send the result.
    user card are, if user-#-of-cards 4, 0, 1, 4, 5
    dealer card are, 2, 3 and if delar needs more cards, 6, 7, etc...

contract has a 'Struct Game'
    Game.id
    mapping(uint => Game) games;
    address player;

# UI logic

    1. wait for player to enter($gameId) the game
        $gameId is javascript random number
    2. shuffle deck, implemented in UI, give 2 cards to player and give 2 cards to dealer (only show 1 dealer card to the user)
    3. call public free method contract.computePlayerHand($cards, $#-of-cards-given) -> $handValue
            turn 1 # cards is 4
            turn 2 # cards is 5
    3.1. if blackdapp wait for user to click get reward and call contract.finalize($gameId, $cards, $#-of-player-cards)
    
    3.2. user can choose HIT or STAND
    3.2.1 if HIT, UI gives player a card, $#-of-cards-given++ then continue at step#3.
    3.2.2 if STAND, call method contract.finalize($cards, $#-of-cards-given) -> $payout-uint, $#-new-cards-dealer-uint8, UI displays dealer cards and new cards, and displays result based on $payout-uint


# cards values

see spreadsheet

# contract design

contract blackdapp {

    struct Game {
        address player;
        uint256 payout;
    }

    mapping (uint8 => Game) games;

    function enter(uint256 gameId) {} // creates Game
    function computePlayerHand(uint8[] cards, uint8 numberOfCardsGiven) returns (uint8 playerHandValue) {}
    function finalize(uint256 gameId, uint8[] cards, uint8 numberOfCardsGiven) {}
}


# DONE 1

work on my local jvm ethereum network

write function shuffleDeck(): it will randomly shuffle uint8[52]
write function getDeck() public

# DONE 2

work on my local jvm ethereum network

write function computeCardValue() returns uint8
write function computeHandValue() returns uint8

# DONE 3

work on my local jvm ethereum network

write function dealerDecision() returns bytes2
decision is Hit or Stand

# DONE 4

work on my local jvm ethereum network

write function initPlayerHand()
write function initDealerHand()
write function giveTwoCardsToDealer()
write function giveTwoCardsToPlayer()

100 will be the magic number to tell that the card has been removed from the deck.
200 will be the magic number to tell that the card in player hand is not defined

# DONE 5

work on my local jvm ethereum network

write function getPlayerHand()
write function getDealerVisibleCard()

# TODO 6

work on my local jvm ethereum network

write function nextState()

# TODO 7

on contract init, shuffle cards

merge all the logic together
