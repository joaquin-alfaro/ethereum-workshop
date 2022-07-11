import { useEffect, useState } from 'react'
declare let window: any;

interface useMetamaskReturnType {
    isInstalled: boolean
    accounts: Array<any>
    connect: () => void
}
const useMetamask = (): useMetamaskReturnType => {
    const [isInstalled, setIsInstalled] = useState(false)
    const [accounts, setAccounts] = useState()

    useEffect(() => {
        if (isInstalled) {
            const { ethereum } = window;
            ethereum.on('accountsChanged', (newAccounts: any) => { setAccounts(newAccounts) })
            ethereum.request({
                method: 'eth_accounts',
            }).then((newAccounts: any) => {
                setAccounts(newAccounts)
            })
        }
    }, [isInstalled])

    useEffect(() => {
        const { ethereum } = window
        const _isInstalled = Boolean(ethereum && ethereum.isMetaMask)
        setIsInstalled(_isInstalled)
    }, [])

    const connect = async () => {
        try {
            const { ethereum } = window;
            const newAccounts = await ethereum.request({
                method: 'eth_requestAccounts',
            })
            setAccounts(newAccounts)
        } catch (error) {
            console.error(error)
        }
    }
    return {
        isInstalled,
        accounts,
        connect
    }
}

export default useMetamask