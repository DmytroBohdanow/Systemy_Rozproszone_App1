import { Navigate, useOutlet } from "react-router-dom";
import { useAuth } from "../../utils/authProvider";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import logo from "../../img/lecina.jpg";

export const ProtectedLayout = () => {
  const { user, logout } = useAuth();
  const outlet = useOutlet();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Navbar fill bg="dark" data-bs-theme="dark">
        <Navbar.Brand className="p-2">
          <img
            alt=""
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          Web Banking im. Bogusława Lęciny
        </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Nav className="ms-2">
            <Navbar.Text>
              Signed in as:{" "}
              <a href={user.accountType === "admin" ? "/admin" : "/customer"}>
                {user.username}
              </a>
            </Navbar.Text>
          </Nav>
          <Nav className="ms-2 me-2">
            <Nav.Item>
              <Button onClick={logout} variant="primary">
                logout
              </Button>{" "}
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Navbar fixed="bottom" className="justify-content-center" data-bs-theme="light">
            <Navbar.Text>
              Pieniądze nie dają szczęścia tylko luksus
            </Navbar.Text>
      </Navbar>
      {outlet}
    </>
  );
};
