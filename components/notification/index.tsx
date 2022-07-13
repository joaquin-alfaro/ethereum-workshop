import { useEffect, useState } from 'react'
import { Toast } from 'react-bootstrap'
const Notification = ({address}: {address?: string}) => {
    const [show, setShow] = useState<boolean>()
    useEffect(()=> {
        setShow(Boolean(address))
    }, [address])
    const onClose = () => {
        setShow(false)
    }
    return (
        <Toast show={show} onClose={onClose} className='mt-3 w-75' bg='light'>
            <Toast.Header>
                <h5 className="me-auto">Smart contract deployed</h5>
            </Toast.Header>
            <Toast.Body>{address}</Toast.Body>
        </Toast>
    )
}

export default Notification