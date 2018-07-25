const fs = require('fs');
const path = require('path');
const solc = require('solc');

const blackDappPath = path.resolve(__dirname, 'contracts', 'blackdapp.sol');
const source = fs.readFileSync(blackDappPath, 'utf8');

const compiledBlackDapp = solc.compile(source, 1).contracts[':Blackdapp'];

fs.writeFileSync('./compiledBlackDapp.json', JSON.stringify(compiledBlackDapp));