import { GetServerSidePropsContext } from 'next'
import Layout from '../../../components/layout'

const BusDetail = ({address}: ServerSideReturnType) => {
    return (
        <Layout>
            <h1>
                Detail of bus {address}
            </h1>
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
  