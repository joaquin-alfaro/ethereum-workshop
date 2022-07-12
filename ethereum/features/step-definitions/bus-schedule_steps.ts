import { Given, When, Then } from '@cucumber/cucumber'
import TransferBus from '../../build/TransferBus.json'
import TransferToken from '../../build/TransferToken.json'
import web3 from '../../web3'
import assert from 'assert'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

let accounts: {[key: string]: string} = {}
interface ContexType {
    busContract?: any,
    error?: any,
}
let context: ContexType = {}

/**
 * Scenario: Scheduling transfers for a Bus
 */
// Given Bus '0000 XXX' of 'Verstappen'
Given('Bus {string} of {string}', async function (plate: string, owner: string) {
    const deploy = await new web3.eth.Contract(JSON.parse(TransferBus.abi))
    .deploy({
        data: TransferBus.bytecode,
        arguments: ['MAN', 'LIONS COACH', plate, 61]
    })
    
    let gas = await deploy.estimateGas()
    gas += 100000;
    const sender = await getAccount(owner)
    context.busContract = await deploy.send({
        from: sender,
        gas: gas})
});
       
// When 'Verstappen' schedules the transfer 'Airport' to 'Palma' at '2022-01-14 10:00' at 0.5 ETH
When('{string} schedules the transfer {string} to {string} at {string} at {float} ETH', async function (caller: string, origin: string, destination: string, datetime: string, price: number) {
    const {busContract} = context
    assert(Boolean(busContract))

    const datetimeX = parseDateTime(datetime)
    const method = busContract.methods.list(
        datetimeX,
        origin,
        destination,
        10,
        web3.utils.toWei(String(price), 'ether'))

    const callerAccount = await getAccount(caller)
    try {
        let gas = await method.estimateGas({from: callerAccount})
        gas = Math.trunc(gas * 1.25)
        await method.send({
            from: callerAccount,
            gas
        })
    } catch(e) {
        context.error = e
    }
});
       
// Then transfer 'Airport' to 'Palma' at '2022-01-14 10:00' for 0.5 ETH is scheduled for the Bus '0000 XXX'
Then('transfer {string} to {string} at {string} for {float} ETH is scheduled for the Bus {string}', async function (origin: string, destination: string, datetime: string, price: number, _plate: string) {
    // Get the timetable/schedule of transfers of the bus (list of tokens)
    const {busContract} = context
    const timetable = await busContract.methods.getTimetable().call()

    // Get the address of the transfer contract (it will be the first of the list)
    const transferContractAddress = timetable[0]

    // Get the price of the transfer and 
    const actualPrice = await busContract.methods.getPrice(transferContractAddress).call()
    assert.equal(actualPrice, web3.utils.toWei(String(price), 'ether'));

    // Fetch the transfer contract
    const transferContract = await new web3.eth.Contract(JSON.parse(TransferToken.abi), transferContractAddress)
    assert(transferContract.options.address)

    const [actualDatetime, actualOrigin, actualDestination] = await transferContract.methods.getSummary().call()
    const datetimeX = parseDateTime(datetime)
    assert.equal(actualDatetime, datetimeX)
    assert.equal(actualOrigin, origin)
    assert.equal(actualDestination, destination)
});

// Then operation is rejected
Then('operation is rejected with error {string}', function (message: string) {
    const { error } = context
    assert(error && error.message.indexOf(message) > 0)
});

async function getAccount(name: string) {
    let account = accounts[name]
    if (!account) {
        account = (await web3.eth.getAccounts())[Object.keys(accounts).length]
        accounts[name] = account
    }

    return account
}

function parseDateTime(datetime: string) {
    return dayjs(datetime, 'YYYY-MM-DD HH:mm').utc(true).unix()
}