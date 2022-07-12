import { GetServerSidePropsContext } from 'next'
import { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import Layout from '../../../components/layout'
import TransferBusContract from '../../../src/domain/TransferBusContract'
import { BusDetail, Transfer } from '../../../src/domain/types'
import { formatDate, parseDate } from '../../../src/utils/date'
import Web3 from 'web3'

interface TransferDatePropsType {
  datetime: string
  origin: string
  destination: string
  price: string
  units: number
  onBuy: () => void
}
const TransferDate = ({datetime, origin, destination, price, units, onBuy}: TransferDatePropsType) => {
  const [processing, setProcessing] = useState(false)
  const handleOnBuy = async () => {
    setProcessing(true)
    try {
      await onBuy()
    } finally {
      setProcessing(false)
    }
  }
  return (
    <div className="card mb-4" >
      <div className="card-header">
        <h5>{datetime}</h5>
      </div>
      <div className="card-body">
        <h5 className="card-title">Origin</h5>
        <h6 className="card-subtitle mb-2 text-muted">{origin}</h6>
        <h5 className="card-title">Destination</h5>
        <h6 className="card-subtitle mb-2 text-muted">{destination}</h6>
        <h5 className="card-title">Price</h5>
        <h6 className="card-subtitle mb-2 text-muted">{price} ETH</h6>
        <h5 className="card-title">Seats</h5>
        <h6 className="card-subtitle mb-2 text-muted">{units} available</h6>

        <Button variant="primary" type="submit" className='mt-3' onClick={handleOnBuy} disabled={processing}>
          Buy
        </Button>
      </div>
    </div>
  )
}

const FormAddTransfer = ({onSubmit}: {onSubmit: (e: any)=> void}) => {
  const [processing, setProcessing] = useState(false)

  async function handleOnSubmit(e: any) {
    e.preventDefault()
    try {
      setProcessing(true)
      await onSubmit(e)
    } finally {
      setProcessing(false)
    }
  }
  return (
    <div className="card" >
      <div className="card-body">
          <h4 className="card-title">Schedule transfer</h4>
          <Form className='mt-4' onSubmit={handleOnSubmit}>
              <Form.Group className="mb-3" controlId="datetime" style={{width: '24rem'}}>
                  <Form.Control placeholder="Date time..."/>
                  <Form.Text>YYYY-MM-DD HH24:MI</Form.Text>
              </Form.Group>
              <Form.Group className="mb-3" controlId="origin" style={{width: '36rem'}}>
                  <Form.Control placeholder="Origin..."/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="destination" style={{width: '36rem'}}>
                  <Form.Control placeholder="Destination..."/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="units" style={{width: '8rem'}}>
                  <Form.Control type="number" placeholder="Units..."/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="price">
                  <Form.Control type="float" placeholder="Price..." style={{width: '8rem'}}/>
                  <Form.Text>Price in ETH using &quot;.&quot; as decimal separator</Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit" disabled={processing}>
                  Add
              </Button>
          </Form>
      </div>
  </div>    
  )
}

const BusDetail = ({address}: ServerSideReturnType) => {
  const [transferBus, setTransferBus] = useState<TransferBusContract>()
  const [busDetail, setBusDetail] = useState<BusDetail>()
  const [timetable, setTimetable] = useState<Array<Transfer>>([])
  
  const handleOnAddTransfer = async (e: any) => {
    if (!transferBus) return

    await transferBus.list({
      datetime: parseDate(e.target.datetime.value, 'YYYY-MM-DD HH:mm'),
      origin: e.target.origin.value,
      destination: e.target.destination.value,
      units: e.target.units.value,
      price: e.target.price.value,
    })
  }

  const handleOnBuy = async (price: number, tokenAddress?: string) => {
    if (!transferBus || !tokenAddress) return

    await transferBus.buy(tokenAddress, price, 1)
  }

  useEffect(()=> {
    TransferBusContract
      .init(address)
      .then((contract) => setTransferBus(contract))
  }, [address])

  useEffect(()=> {
    if (!transferBus) return

    transferBus
      .getSummary()
      .then(response => setBusDetail(response))

    transferBus
      .getTimetable()
      .then(response => setTimetable(response))
  }, [transferBus])

  return (
      <Layout>
          {!busDetail && 
            <div className="alert alert-danger" role="alert">
              Missing smart contract for address <span className='text-muted'>{address}</span>
            </div>
          }
          <div className="card w-75" >
            <div className="card-header">
              <h4>Bus {busDetail?.plate}</h4>
              <h6 className="card-subtitle mb-2 text-muted">{address}</h6>
            </div>
            <div className="card-body">
              <h5 className="card-title">Make</h5>
              <h6 className="card-subtitle mb-2 text-muted">{busDetail?.make}</h6>
              <h5 className="card-title">Model</h5>
              <h6 className="card-subtitle mb-2 text-muted">{busDetail?.model}</h6>
              <h5 className="card-title">License plate</h5>
              <h6 className="card-subtitle mb-2 text-muted">{busDetail?.plate}</h6>
              <h5 className="card-title">Number of seats</h5>
              <h6 className="card-subtitle mb-2 text-muted">{busDetail?.seats}</h6>
            </div>
          </div>

          <div className='mt-4'>
            <h4>Timetable</h4>
            <div className='row'>
              <div className='col'>
                {timetable.map((transfer, index) => 
                <TransferDate 
                  key={index}
                  datetime={formatDate(transfer.datetime)}
                  origin={transfer.origin}
                  destination={transfer.destination}
                  price={Web3.utils.fromWei(String(transfer.price), 'ether')}
                  units={transfer.units}
                  onBuy={() => {handleOnBuy(transfer.price, transfer.address)}}
                />
                )}
              </div>
              <div className='col'>
                <FormAddTransfer onSubmit={handleOnAddTransfer}/>
              </div>
            </div>
          </div>
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
  