import web3 from './Web3Provider'
import { TransferBus } from '../../ethereum'

class TransferBusContract {
    private readonly contract: any

    constructor({ contract }: { contract: any }) {
        this.contract = contract
    }
    
    getContract(): any {
        return this.contract
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