import web3 from './Web3Provider'
import { TransferToken } from '../../ethereum'
import { TransferToken as TransferTokenType } from './types'

class TransferTokenContract {
    private readonly contract: any

    constructor({ contract }: { contract: any }) {
        this.contract = contract
    }

    getContract(): any {
        return this.contract
    }

    async balanceOf(address: string): Promise<number> {
        return await this.contract.methods.balanceOf(address).call()
    }
  
    async getSummary(): Promise<TransferTokenType> {
      const summary = await this.contract.methods.getSummary().call()
      return {
        datetime: summary[0],
        origin: summary[1],
        destination: summary[2],
      }
    }

    static async init(address: string): Promise<TransferTokenContract> {
        const contract: any = await new web3.eth.Contract(
            JSON.parse(TransferToken.abi),
            address
        )
        return new TransferTokenContract({contract})
      }
}

export default TransferTokenContract