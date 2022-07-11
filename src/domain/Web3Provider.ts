declare let window: any

import Web3 from 'web3'
import { ETHEREUM_PROVIDER_LOCAL } from '../constants'

let web3: Web3 = new Web3();

if (typeof window !== 'undefined' && typeof window.ethereum != 'undefined') {
    // We are in the browser and web3 provider has been injected (probably by Metamask)
    web3 = new Web3(window.ethereum)
} else {
    // No provider injected or execution in server. Create provider
    const provider = ETHEREUM_PROVIDER_LOCAL;   
    if (provider.startsWith('/')) {
        // /Users/myuser/Library/Ethereum/geth.ipc
        const net = require('net')
        web3 = new Web3(new Web3.providers.IpcProvider(provider, net))
    } else if (provider.startsWith('ws')) {
        // ws://localhost:8546
        web3 = new Web3(new Web3.providers.WebsocketProvider(provider))
    } else if (provider.startsWith('http')) {
        // http://localhost:8545
        web3 = new Web3(new Web3.providers.HttpProvider(provider))
    }
}

export default web3;