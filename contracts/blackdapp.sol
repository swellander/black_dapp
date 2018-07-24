pragma solidity ^0.4.22;

// 1 deck of 52 cards

contract Blackdapp {
    address public manager;
    uint8[52] public deck;

    constructor() public {
        manager = msg.sender;

        // uint256[] tmpDeck = new uint256[](52);
        for (uint8 i = 0 ; i < 52 ; i ++){
            deck[i] = i;
        }
    }

    function enter() public payable {
        // TODO shuffle
        
        require(msg.value > .01 ether);
    }

    function shuffleDeck() public {
        // uint8[52] storage tmpDeck = deck;
        for (uint8 i = 0; i < 52-1; i++) {
            // swap
            uint256 rand = randHash(i);
            uint8 randIndex = randomBetween(rand, i, 52);
            
            swap(deck, i, randIndex);
        }
    }

    function swap(uint8[52] storage d, uint8 index1, uint8 index2) private {
        uint8 tmp = d[index1];
        d[index1] = d[index2];
        d[index2] = tmp;
    }

    function randHash(uint8 _seed) private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.difficulty, now, _seed)));
    }

    // https://www.i-programmer.info/programming/theory/2744-how-not-to-shuffle-the-kunth-fisher-yates-algorithm.html
    function randomBetween(uint256 _rand, uint8 _min, uint8 _max) private pure returns (uint8) {
        return uint8(_min + (_rand % (_max-_min)));
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function getDeck() public view returns (uint8[52]) {
        return deck;
    }
}