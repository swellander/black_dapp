# Black Dapp - A decentralized 21 

Install with npm (OSX)
-----------------
Make sure you have npm and node installed globally on your machine.
```
> npm -v
6.1.0
> node -v
v8.9.4
```
Then run 
```
> npm istall
```
Then compile the contract for testing by running
```
> node compile.js
```
To run tests: 
```
> npm test
```

## cards values

see spreadsheet


## DONE 1

work on my local jvm ethereum network

- [x] write function shuffleDeck(): it will randomly shuffle uint8[52]
- [x] write function getDeck() public

## DONE 2

work on my local jvm ethereum network

- [x] write function computeCardValue() returns uint8
- [x] write function computeHandValue() returns uint8

## DONE 3

work on my local jvm ethereum network

- [x] write function dealerDecision() returns bytes2
- [x] decision is Hit or Stand

## DONE 4

work on my local jvm ethereum network

- [x] write function initPlayerHand()
- [x] write function initDealerHand()
- [x] write function giveTwoCardsToDealer()
- [x] write function giveTwoCardsToPlayer()

100 will be the magic number to tell that the card has been removed from the deck.
200 will be the magic number to tell that the card in player hand is not defined

## DONE 5

work on my local jvm ethereum network

- [x] write function getPlayerHand()
- [x] write function getDealerVisibleCard()

## TODO 6

work on my local jvm ethereum network

- [ ] write function nextState()

## TODO 7

- [ ] on contract init, shuffle cards

- [ ] merge all the logic together

## TODO 8
- [x] add testing suite (did this mostly because I wanted the practice)
 
