
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import TopBar from './topBar';
import logo from '../assets/image/logo.png'
import spiderMan from '../assets/image/spiderman.jpeg'
import '../styles/navigation.css'
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function isHomePage(){
  return window.location.pathname === '/Home' || window.location.pathname === '/';
}
const backgroundStyle = isHomePage() ? {
  backgroundImage: `url(${spiderMan})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      height: '50vh',
      width: '100vw',
     
} :{};
const navLinkStyle = isHomePage() ? { color: 'white' } : {color: 'black'};
const background = isHomePage() ? {backgroundColor: 'transparent'} : { backgroundColor: 'white'}

function Navigation() {
  const[pageLocation, setPageLocaiton] = useState(window.location.pathname)
  if(pageLocation === '/dashboard'){
    return null;
  }
  return (
    <div>
      {/* <TopBar/>  */}
        <div style={{ boxShadow: 'rgba(17, 17, 26, 0.1) 0px 1px 0px', ...backgroundStyle }}>
          <Navbar expand="sm" style={{ padding: '0', ...background }} className={isHomePage ? 'homepage' : ''}>
            <Container fluid>
              <Navbar.Brand href="/Home">
                <img
                  src={logo}
                  width="100"
                  height="40"
                  className="d-inline-block align-top"
                  alt="Assassins Theater Logo"
                />
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="navbarScroll" />
              <Navbar.Collapse id="navbarScroll">
                <Nav
                  className="ms-auto my-2 my-lg-0"
                  style={{ maxHeight: '200px' }}
                  navbarScroll
                >
                  <Nav.Link id='nav-content' href="/Show" style={navLinkStyle}>Show</Nav.Link>
                  {/* <Nav.Link id='nav-content' href="/FoodAndDrink" style={navLinkStyle}>Food & Drinks</Nav.Link> */}
                  <Nav.Link id='nav-content' href="/Locations" style={navLinkStyle}>Location</Nav.Link>
                  <Nav.Link id='nav-content' href="/Membership" style={navLinkStyle}>Memberships</Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </div>
      {/* <div style={{ boxShadow: 'rgba(17, 17, 26, 0.1) 0px 1px 0px', ...backgroundStyle}}>
        <Navbar expand="sm" style={{ padding: '0',  ...background}} className={isHomePage() ? 'homepage' : ''} >
          <Container fluid>
            <Navbar.Brand href="/Home">
              <img
                src={logo}
                width="100" 
                height="40" 
                className="d-inline-block align-top"
                alt="Assassins Theater Logo"
              />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll" >
              <Nav
                className="ms-auto my-2 my-lg-0"
                style={{ maxHeight: '200px'}}
                navbarScroll
              >  
                  <Nav.Link id = 'nav-content' href="/Show" style={navLinkStyle}>show</Nav.Link>
                  <Nav.Link id = 'nav-content' href="/FoodAndDrink" style={navLinkStyle}>food & drinks</Nav.Link>
                  <Nav.Link id = 'nav-content' href="/Locations" style={navLinkStyle}>location</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div> */}
    </div>
  );
}




export default Navigation;