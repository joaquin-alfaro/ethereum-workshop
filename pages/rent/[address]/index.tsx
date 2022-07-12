import { GetServerSidePropsContext } from "next"
import { useEffect, useState } from "react"
import { Button, Form } from "react-bootstrap"
import Layout from "../../../components/layout"
import RentingBusContract from "../../../src/domain/RentingBusContract"

const NFTCard = ({url, tokenId}: {url: string, tokenId: number}) => {
    return (
        <div className="card" style={{width: "18rem"}}>
            <div className="card-body">
                <h5 className="card-title">NFT {tokenId}</h5>
                <a href={url} rel='noreferrer' target='_blank' className="btn btn-primary">Show metadata</a>
            </div>
        </div>        
    )
}
const RentDetail = ({address}: ServerSideReturnType) => {
    /*
    https://bafyreiazv2ucrjrrbfi6jszllzxuyr7vt6f7qnjb2cyzuoyq2bmspnk2p4.ipfs.nftstorage.link/metadata.json
    https://bafybeifssrcjoafovlto5ydrsy62r6ur4ryiwz4zj45j5l4yxvxkrxpt7y.ipfs.nftstorage.link/bus.png
    */
    const [rentingBusContract, setRentingBusContract] = useState<RentingBusContract>()
    const [rentingDetail, setRentingDetail] = useState<any>()
    const [processing, seProcessing] = useState(false)

    const handleOnCreate = async (e: any) => {
        e.preventDefault()
        if (!rentingBusContract) return

        seProcessing(true)
        try {
            await rentingBusContract.rent({
                date: e.target.date.value,
                days: e.target.days.value,
                region: e.target.region.value, 
                km: e.target.km.value
            })
        } finally {
            seProcessing(false)
        }
    }

    useEffect(()=> {
        RentingBusContract
          .init(address)
          .then((contract) => setRentingBusContract(contract))
      }, [address])
    
      useEffect(()=> {
        if (!rentingBusContract) return
    
        rentingBusContract
          .getCollection()
          .then(response => setRentingDetail(response))
      }, [rentingBusContract])
    
    return (
        <Layout>
            <div className="card px-2 w-75">
                <div className="card-body">
                    <h4 className="card-title">Rent bus {rentingDetail?.plate}</h4>
                    <Form onSubmit={handleOnCreate} className='mt-4'>
                        <Form.Group className="mb-3" controlId="date" style={{width: '12rem'}}>
                            <Form.Control type="date" placeholder="Date..."/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="days" style={{width: '8rem'}}>
                            <Form.Control type="number" placeholder="Days..."/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="region">
                            <Form.Control placeholder="Region..."/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="km" style={{width: '8rem'}}>
                            <Form.Control type="number" placeholder="Km..."/>
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={processing}>
                            Rent
                        </Button>
                    </Form>
                </div>
            </div>

            {
                rentingDetail &&
                <div className='row'>
                    {rentingDetail.tokens.map((token: any, i: number) => {
                        return (
                            <div className='col my-3' key={token.tokenId}>
                                <NFTCard
                                    url={token.url}
                                    tokenId={token.tokenId}
                                />
                            </div>
                        )
                    })}
                </div>       

            }
        </Layout>
    )
}

export default RentDetail

interface ServerSideReturnType {
    address: string
  }
export async function getServerSideProps(
    context: GetServerSidePropsContext
): Promise<{ props: ServerSideReturnType }> {
    const address: string = context.query.address as string
    return {
      props: {
        address
      }
    }
  }
