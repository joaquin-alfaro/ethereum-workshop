import { GetServerSidePropsContext } from 'next'
import { useEffect, useState } from 'react'
import Layout from '../../../components/layout'
import TransferBusContract from '../../../src/domain/TransferBusContract'

const BusDetail = ({address}: ServerSideReturnType) => {

  const [transferBus, setTransferBus] = useState<any>()
  useEffect(()=> {
    TransferBusContract.init(address).then((contract) => setTransferBus(contract))
  }, [address])
  return (
      <Layout>
          <h1>
              Detail of bus {address}
          </h1>
          {
            transferBus && <p>{transferBus.getContract().options.address}</p>
          }
      </Layout>
  )
}

export default BusDetail

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
  