import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../utils/authProvider";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import logo from "../../img/lecina.jpg";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await axios
      .post(
        "/api/login",
        {
          password: password,
          username: username,
          isAdmin: isAdmin,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((response) => {
        if (response.data.length < 1) {
          setError("Please check the username");
          return null;
        }
        if (
          response.data[0].username === username &&
          response.data[0].password === password
        ) {
          setError("");
          login(response.data[0]);
          console.log(response.data[0]);
        } else if (response.data[0].password !== password) {
          setError("Password incorrect");
          return null;
        }
      });

    setUsername("");
    setPassword("");
  };

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
      </Navbar>
      <Card className="container mt-4" border="secondary">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                onChange={handleUsernameChange}
                type="text"
                value={username}
                placeholder="Enter your username"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
              />
              <Form.Text className="text-muted">
                Protect your password! (We won't do it)
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check
                type="checkbox"
                label="Login as admin"
                checked={isAdmin}
                onChange={() => setIsAdmin(!isAdmin)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Login
            </Button>
            {error.length > 0 ? <Alert variant="danger">{error}</Alert> : <></>}
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default LoginPage;
