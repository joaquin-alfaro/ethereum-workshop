import { GetServerSidePropsContext } from 'next'
import Layout from '../../../components/layout'

const BuyTickets = ({address}: ServerSideReturnType) => {
    return (
        <Layout>
            <h1>
                Buy tickets for bus {address}
            </h1>
        </Layout>
    )
}

export default BuyTickets

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
  