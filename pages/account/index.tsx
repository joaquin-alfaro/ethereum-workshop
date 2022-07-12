import { useState } from "react"
import { Button, Form } from "react-bootstrap"
import Layout from "../../components/layout"
import useMetamask from "../../src/hooks/useMetamask"
import web3 from '../../src/domain/Web3Provider'

const Account = () => {
    const { accounts, connect } = useMetamask()
    const [signature, setSignature] = useState<string>()
    const [signedBy, setSignedBy] = useState<string>()

    const onSign = async (e: any) => {
        e.preventDefault()
        const signed = await web3.eth.personal.sign(e.target.msg.value, accounts[0], '')
        setSignature(signed)
    }

    const onVerify = async (e: any) => {
        e.preventDefault()
        const address = await web3.eth.personal.ecRecover(e.target.msg.value, e.target.signature.value)
        setSignedBy(address)
    }
    if (!accounts || accounts.length == 0) {
        return (
            <Layout>
                <div className='text-center d-flex align-items-center justify-content-center' style={{height: '60vh'}}>
                    <Button size='lg' onClick={connect}>
                        Login
                    </Button>
                </div>
            </Layout>
        )
    }
    return (
        <Layout>
            <p><strong>Address: </strong>{accounts[0]}</p>
            <div className="card w-75">
                <div className="card-header">
                    <h4>Sign message</h4>
                </div>
                <div className="card-body">
                    <Form onSubmit={onSign}>
                        <Form.Group className="mb-3" controlId="msg">
                            <Form.Control as="textarea" placeholder="Message..." rows={5}/>
                        </Form.Group>
                        <Button variant="primary" type="submit" size='lg' className='mt-2'>
                            Sign
                        </Button>
                    </Form>
                    { signature && 
                        <div className='mt-3'>
                            <h4>Signature</h4> 
                            <div className='border p-2'>{signature}</div>
                        </div>
                    }
                </div>
            </div>

            <div className="card w-75 mt-5">
                <div className="card-header">
                    <h4>Verify signature</h4>
                </div>
                <div className="card-body">
                    <Form onSubmit={onVerify}>
                        <Form.Group className="mb-3" controlId="msg">
                            <Form.Control as="textarea" placeholder="Message..." rows={5}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="signature">
                            <Form.Control as="textarea" placeholder="Signature..." rows={5}/>
                        </Form.Group>
                        <Button variant="primary" type="submit" size='lg' className='mt-2'>
                            Verify
                        </Button>
                    </Form>
                    { signedBy &&
                    <div className="card mt-3">
                        <div className="card-body">
                            Message signed by <strong>{signedBy}</strong>
                        </div>
                  </div>
                    }
                </div>
            </div>
        </Layout>
    )
}

export default Account