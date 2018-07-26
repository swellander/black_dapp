const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledBlackdapp = require('./build/Blackdapp.json');

const provider = new HDWalletProvider(
  'begin real blur wrestle climb blast text engage frown solve smart carpet',
  'https://rinkeby.infura.io/nrfIZK4W5YMsRemYjf5L'
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  try {
    const result = await new web3.eth.Contract(
      JSON.parse(compiledBlackdapp.interface)
    )
      .deploy({ data: compiledBlackdapp.bytecode })
      .send({ gas: '3000000', from: accounts[0] });

    console.log(compiledBlackdapp.interface);
    console.log('Contract deployed to', result.options.address);

  } catch(err) {
    console.log(err);
  }
};
deploy();
