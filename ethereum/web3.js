/*
// Compilation errors. ganache.provider() does not return the type required by Web3
import Web3 from 'web3';
import ganache from 'ganache'

const options = { gasLimit: 5000000 }
export default new Web3(ganache.provider(options));
*/

const Web3 = require('web3');
const ganache = require('ganache');
const options = {
    gasLimit: 5000000,
    logging: {
        quiet: true 
    }
}
module.exports = new Web3(ganache.provider(options));
