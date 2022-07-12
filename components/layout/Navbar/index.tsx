import { Navbar as NavbarBs, Nav, Container, Button } from 'react-bootstrap'
import useMetamask from '../../../src/hooks/useMetamask';
import MetaMaskOnboarding from '@metamask/onboarding'
import Link from 'next/link';

const LoginButton = () => {
  const { accounts, isInstalled: isMetamask, connect } = useMetamask()
  
  if (!isMetamask) {
    return (
      <Button size='lg' onClick={ () => {const metamaskOnBoarding = new MetaMaskOnboarding(); metamaskOnBoarding.startOnboarding()}}>
        Install Metamask
      </Button>
    )
  }

  const isLogged = accounts?.length > 0
  if (!isLogged) {
    return (
      <Button size='lg' onClick={connect}>
        Login
      </Button>
    )
  }

  return (
    <Link href='/account'>
      <a style={{textDecoration: 'none'}}><h5 className='text-muted'>{`${accounts[0].slice(0, 5)}...${accounts[0].slice(-4)}`}</h5></a>
    </Link>
    
  )
}
const Navbar = () => {
    return (
      <NavbarBs
        collapseOnSelect
        expand='md'
        fixed='top'
        className='border bg-white px-md-5'
      >
        <Container fluid>
          <NavbarBs.Brand href='/'>
            <h1>Transfers Dapp</h1>
          </NavbarBs.Brand>
          <div className='d-flex flex-row order-2 order-md-3 align-items-center'>
            <Nav.Item>
              {LoginButton()}
            </Nav.Item>
            <NavbarBs.Toggle className='navbar-light justify-content-start' />
          </div>
          <NavbarBs.Collapse
            id='basic-navbar-nav'
            className='justify-content-end order-3 order-md-2'
          >
            <NavbarBs.Text>
              <Nav.Link href='/bus'>Transfers</Nav.Link>
            </NavbarBs.Text>
            <NavbarBs.Text>|</NavbarBs.Text>
            <NavbarBs.Text>
              <Nav.Link href='/rent'>Rent</Nav.Link>
            </NavbarBs.Text>
          </NavbarBs.Collapse>
        </Container>
      </NavbarBs>
    )
  }
  
  export default Navbar
  