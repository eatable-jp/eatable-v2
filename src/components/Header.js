// react router
import { LinkContainer } from "react-router-bootstrap";
import { useHistory } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux";
import {logout } from '../slice/loginSlice'
import {resetUser} from '../slice/userSlice'
// bootstrap
import { Nav, Navbar, Container, Badge } from "react-bootstrap";
export default function Header({ userStatus }) {

  const history = useHistory();
  // setup redux
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const handleLogOut = () => {
    dispatch(logout())
    dispatch(resetUser())
    localStorage.removeItem("eatable");
    history.push("/login")
  }
  return (
    <Navbar className="mb-5" expand="lg">
      {/* displaying different header based on customer type */}
      {userStatus === "seller" ? (
        <Container>
          <LinkContainer to="/seller">
            <Navbar.Brand className="header-heading">Eatable</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <LinkContainer to="/seller-profile">
                <Nav.Link>Profile</Nav.Link>
              </LinkContainer>
              <Nav.Link onClick={()=> handleLogOut()}>Log out</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      ) : userStatus === "buyer" ? (
        <Container>
          <LinkContainer to="/buyer">
            <Navbar.Brand className="header-heading">Eatable</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <LinkContainer to="/buyer-profile">
                <Nav.Link>Profile</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/cart">
                <Nav.Link>Cart <Badge pill bg="danger">{cart.length}</Badge></Nav.Link>
              </LinkContainer>
                <Nav.Link onClick={()=> handleLogOut()}>Log out</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      ) : (
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand className="header-heading">Eatable</Navbar.Brand>
          </LinkContainer>    
        </Container>
      )
    }
    </Navbar>
  );
}
