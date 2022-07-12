import web3 from './Web3Provider'
import { RentingBus } from '../../ethereum'
import nftstorage, { File } from '../client/NFTStorage'

class RentingBusContract {
    private readonly contract: any

    constructor({ contract }: { contract: any }) {
        this.contract = contract
    }
    
    getContract(): any {
        return this.contract
    }

    async getCollection(): Promise<any> {
      const summary = await this.contract.methods.summary().call()
      const size = Number(summary[1])

      const range = Array(size).fill('')

      const tokens = await Promise.all(range.map(async (_, tokenId) => {
        const uri = await this.contract.methods.tokenURI(tokenId).call()

        // CORS error when fetching file from nftstorage 
        // const url = `https://ipfs.nftstorage.link/${uri.replace('ipfs://', '')}`
        const url = `https://ipfs.io/ipfs/${uri.replace('ipfs://', '')}`
        return {
          tokenId,
          url
        }
      }))
      return {
        plate: summary[0],
        size,
        tokens,
      }
    }

    async rent({date, days, region, km}: {date: string, days: number, region: string, km: number}) {
      // 1. Upload image +  metadata
      const blob = await (await fetch('http://localhost:3000/nft/bus.png')).blob()
      const image = new File([blob], 'bus.png', {
        type: 'image/png',
      })
      const {url} = await nftstorage.store({
                    image: image,
                    name: 'Bus renting',
                    description: 'NFT for bus renting',
                    properties: {
                        date,
                        days,
                        region,
                        km
                    }
                })
      // 2. Mint token
      const [from] = await web3.eth.getAccounts()
      await this.contract.methods.rent(from, url).send({from})
    }
    
    static async create({
        plate,
      }: {
        plate: string
      }): Promise<RentingBusContract> {
        const [from] = await web3.eth.getAccounts()

        const contract: any = await new web3.eth.Contract(
            JSON.parse(RentingBus.abi)
          )
            .deploy({
              data: RentingBus.bytecode,
              arguments: [plate]
            })
            .send({
              from
        })

        return new RentingBusContract({contract})
    }

    static async init(address: string): Promise<RentingBusContract> {
      const contract: any = await new web3.eth.Contract(
          JSON.parse(RentingBus.abi),
          address
      )
      return new RentingBusContract({contract})
    }
}

export default RentingBusContract