import React, { useState, useEffect } from 'react';
import './App.css';
import { Navbar, Nav, NavItem, Container } from "react-bootstrap";
import Routes from "./Routes";
import { AppContext } from "./libs/contextLib";
import { Auth } from "aws-amplify";
import { Link, useHistory } from "react-router-dom";
import { onError } from "./libs/errorLib";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const history = useHistory();
  // calls function the first time component is rendered (empty array)
  // if no array, hook exectued everytime component is rendered
  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    }
    catch (e) {
      if (e !== 'No current user') {
        onError(e);
      }
    }
    setIsAuthenticating(false);
  }
  async function handleLogout() {
    await Auth.signOut();
    userHasAuthenticated(false)
    history.push("/");
  }
  return (
    !isAuthenticating &&
    <Container>
      <Navbar>

        <Navbar.Collapse>
          <Nav>
            {isAuthenticated
              ? <>
                <Nav.Link><Link style={{ textDecoration: 'none' }} to="/">Shopping</Link></Nav.Link>
                <Nav.Link><Link style={{ textDecoration: 'none' }} to="/inventory">Inventory</Link></Nav.Link>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                </>
                  : <>
                    <Nav.Link>
                      <Link to="/signup">Sign Up</Link>
                    </Nav.Link>
                    <Nav.Link>
                      <Link to="/login">Login</Link>
                    </Nav.Link>
                  </>
            }
          </Nav>
              </Navbar.Collapse>
      </Navbar>
          <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
            <Routes />
          </AppContext.Provider>
    </Container>
  );
}

export default App;
