import React from "react"
import { ToastContainer, Toast } from "react-bootstrap"

const Event = ({children}: {children: React.ReactNode}) => {
    return (
        <div
            aria-live="polite"
            aria-atomic="true"
            style={{ minHeight: '110px' }}
        >
            <ToastContainer className="mt-5 p-5" position='top-center'>
                <Toast>
                    <Toast.Header>
                    <strong className="me-auto">Event</strong>
                    </Toast.Header>
                    <Toast.Body>
                        {children}
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    )
}

export default Event
