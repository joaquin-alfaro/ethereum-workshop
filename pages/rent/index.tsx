import { NextPage } from 'next'
import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import Layout from '../../components/layout'
import { useRouter } from 'next/router'
import RentingBusContract from '../../src/domain/RentingBusContract'

const Rent: NextPage = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleOnCreate = async (e: any) => {
        e.preventDefault()
        setLoading(true)
        try {
            const rentingBusContract = await RentingBusContract.create({
                plate: e.target.plate.value,
            })
            console.log('Smart contract created', rentingBusContract.getContract().options.address)
        } finally {
            setLoading(false)
        }
    }
    const handleOnSearch = (e: any) => {
        e.preventDefault()
        router.push(`/rent/${e.target.address.value}`)
    }
    return (
        <Layout>
            <div className='row'>
                <div className='col-12 d-flex justify-content-center'>
                    <div className="card pe-5" style={{width: '48rem'}}>
                        <div className="card-body">
                            <h4 className="card-title">Create contract for renting</h4>
                            <p className='text-muted'>Creates a collection of NFTs for renting contracts</p>
                            <Form onSubmit={handleOnCreate} className='mt-4'>
                                <Form.Group className="mb-3" controlId="plate" style={{width: '24rem'}}>
                                    <Form.Control placeholder="License plate..." size='lg'/>
                                </Form.Group>
                                <Button variant="primary" type="submit" size='lg' disabled={loading}>
                                    Create
                                </Button>
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
                            <h4 className="card-title">Load existing contract</h4>
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

export default Rent