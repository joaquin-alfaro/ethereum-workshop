import web3 from './Web3Provider'
import { TransferBus } from '../../ethereum'
import { BusDetail, Transfer } from './types'
import TransferTokenContract from './TransferTokenContract'

class TransferBusContract {
    private readonly contract: any

    constructor({ contract }: { contract: any }) {
        this.contract = contract
    }
    
    getContract(): any {
        return this.contract
    }

    async getSummary(): Promise<BusDetail> {
      const summary = await this.contract.methods.getSummary().call()
      return {
        make: summary[0],
        model: summary[1],
        plate: summary[2],
        seats: summary[3]
      }
    }

    async getPrice(tokenAddress: string): Promise<number> {
      return await this.contract.methods.getPrice(tokenAddress).call()
    }

    async list(transfer: Transfer) {
      const [from] = await web3.eth.getAccounts()

      const tx = await this.contract.methods
        .list(
          transfer.datetime,
          transfer.origin,
          transfer.destination,
          transfer.units,
          web3.utils.toWei(String(transfer.price), 'ether')
        )
        .send({ from })
    }

    async buy(tokenAddress: string, price: number, units: number) {
      const [from] = await web3.eth.getAccounts()
      const value = units*price
      const tx = await this.contract.methods
        .buy(
          tokenAddress,
          units,
        )
        .send({ from, value })
    }

    async getTimetable(): Promise<Array<Transfer>> {
      const timetable = await this.contract.methods.getTimetable().call()

      const result = await Promise.all(timetable.map(async (tokenAddress: string) => {
        const transferTokenContract = await TransferTokenContract.init(tokenAddress)
        const tokenSummary = await transferTokenContract.getSummary()
        const units = await transferTokenContract.balanceOf(this.getContract().options.address)

        const price = await this.getPrice(tokenAddress)
        return {
          datetime: tokenSummary.datetime,
          origin: tokenSummary.origin,
          destination: tokenSummary.destination,
          units,
          price,
          address: tokenAddress
        }
      }))

      return result
    }

    static async create({
        make,
        model,
        plate,
        seats
      }: {
        make: string,
        model: string,
        plate: string
        seats: number
      }): Promise<TransferBusContract> {
        const [from] = await web3.eth.getAccounts()

        const contract: any = await new web3.eth.Contract(
            JSON.parse(TransferBus.abi)
          )
            .deploy({
              data: TransferBus.bytecode,
              arguments: [make, model, plate, seats]
            })
            .send({
              from
        })

        return new TransferBusContract({contract})
    }

    static async init(address: string): Promise<TransferBusContract> {
      const contract: any = await new web3.eth.Contract(
          JSON.parse(TransferBus.abi),
          address
      )
      return new TransferBusContract({contract})
    }
}

export default TransferBusContract