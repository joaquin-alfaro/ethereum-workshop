import { NextPage } from 'next'
import React, { useState } from 'react'
import { Button, Form, Spinner } from 'react-bootstrap'
import Layout from '../../components/layout'
import { useRouter } from 'next/router'
import TransferBusContract from '../../src/domain/TransferBusContract'
import Notification from '../../components/notification'

const Bus: NextPage = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [address, setAddress] = useState<string>()

    const handleOnCreate = async (e: any) => {
        e.preventDefault()
        setLoading(true)
        try {
            const transferBusContract = await TransferBusContract.create({
                make: e.target.make.value,
                model: e.target.model.value,
                plate: e.target.plate.value,
                seats: e.target.seats.value
            })
            console.log('Smart contract created', transferBusContract.getContract().options.address)
            setAddress(transferBusContract.getContract().options.address)
        } finally {
            setLoading(false)
        }
    }
    const handleOnSearch = (e: any) => {
        e.preventDefault()
        router.push(`/bus/${e.target.address.value}`)
    }
    return (
        <Layout>
            <div className='row'>
                <div className='col-12 d-flex justify-content-center'>
                    <div className="card pe-5" style={{width: '48rem'}}>
                        <div className="card-body">
                            <h4 className="card-title">Create Bus</h4>
                            <Form onSubmit={handleOnCreate} className='mt-4'>
                                <Form.Group className="mb-3" controlId="make" style={{width: '36rem'}}>
                                    <Form.Control placeholder="Vehicle make..." size='lg'/>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="model" style={{width: '36rem'}}>
                                    <Form.Control placeholder="Vehicle model..." size='lg'/>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="plate" style={{width: '24rem'}}>
                                    <Form.Control placeholder="License plate..." size='lg'/>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="seats" style={{width: '8rem'}}>
                                    <Form.Control type="number" placeholder="Seats..." size='lg'/>
                                </Form.Group>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    size='lg'
                                    disabled={loading}
                                >
                                    Create
                                    {loading && 
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        className="ms-2"
                                    />
                                    }
                                </Button>
                                <Notification address={address} />
                            </Form>
                        </div>
                    </div>           
                </div>
                <div className='col-12 text-center my-3'>
                    <h5>Or</h5>
                </div>
                <div className='col-12 d-flex justify-content-center'>
                    <div className="card" style={{width: '48rem'}}>
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