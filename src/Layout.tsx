import React, { useContext, useState } from 'react'
import { ToastType, toastContext } from './contexts/toastContext'
import Toast from './components/Toast/Toast'

interface Props {
    children: React.ReactNode
}

const Layout = ({ children }: Props) => {
    const [toasts, setToasts] = useState<ToastType[]>([])

    return (
        <>
            <toastContext.Provider value={{ toasts, setToasts }}>
                <Toast />
                <div>Layout</div>
                {/* <NavBar /> */}
                {/* <Container> */}
                {children}
                {/* </Container> */}
                {/* <footer></footer> */}
            </toastContext.Provider>
        </>
    )
}

export default Layout