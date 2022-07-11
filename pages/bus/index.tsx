import { NextPage } from 'next'
import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import Layout from '../../components/layout'
import { useRouter } from 'next/router'
import TransferBusContract from '../../src/domain/TransferBusContract'

const Bus: NextPage = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleOnCreate = async (e: any) => {
        e.preventDefault()
        setLoading(true)
        const transferBusContract = await TransferBusContract.create({
            make: e.target.make.value,
            model: e.target.model.value,
            plate: e.target.plate.value,
            seats: e.target.seats.value
        })
        console.log('JALFARO', transferBusContract.getContract().options.address)
        setLoading(false)
    }
    const handleOnSearch = (e: any) => {
        e.preventDefault()
        router.push(`/bus/${e.target.address.value}`)
    }
    return (
        <Layout>
            <div className='row'>
                <div className='col-12 d-flex justify-content-center'>
                    <div className="card pe-5" style={{width: '36rem'}}>
                        <div className="card-body">
                            <h4 className="card-title">Create Bus</h4>
                            <Form onSubmit={handleOnCreate} className='mt-4'>
                                <Form.Group className="mb-3" controlId="make" style={{width: '18rem'}}>
                                    <Form.Control placeholder="Vehicle make..." size='lg'/>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="model" style={{width: '18rem'}}>
                                    <Form.Control placeholder="Vehicle model..." size='lg'/>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="plate" style={{width: '18rem'}}>
                                    <Form.Control placeholder="Vehicle plate..." size='lg'/>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="seats" style={{width: '8rem'}}>
                                    <Form.Control type="number" placeholder="Seats..." size='lg'/>
                                </Form.Group>
                                <Button variant="primary" type="submit" size='lg' disabled={loading}>
                                    Create
                                </Button>
                            </Form>
                        </div>
                    </div>           
                </div>
                <div className='col-12 text-center my-3'>
                    <h5>or</h5>
                </div>
                <div className='col-12 d-flex justify-content-center'>
                    <div className="card pe-5" style={{width: '36rem'}}>
                        <div className="card-body">
                            <h4 className="card-title">Load existing Bus</h4>
                            <Form onSubmit={handleOnSearch} className='mt-4'>
                                <Form.Group className="mb-3" controlId="address">
                                    <Form.Control placeholder="Address of the contract..." size='lg'/>
                                </Form.Group>
                                <Button variant="primary" type="submit" size='lg'>
                                    Load
                                </Button>
                            </Form>
                        </div>
                    </div>           
                </div>
            </div>
        </Layout>
    )
}

export default Bus