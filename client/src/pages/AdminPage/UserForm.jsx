import React from "react";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export const DisplayNewUserForm = (props) => {
  const {
    newUserResponse,
    setNewUserResponse,
    newUserError,
    setNewUserError,
    newUserPassword,
    setNewUserPassword,
    newUserUsername,
    setNewUserUsername,
    newUserId,
    setNewUserId,
    newUserFirstName,
    setNewUserFirstName,
    newUserLastName,
    setNewUserLastName,
    setNewUserPESEL,
    newUserPESEL,
  } = props;

  const handleNewUserIdChange = () => {
    setNewUserId(uuidv4());
  };

  const handleNewUserUsernameChange = (event) => {
    setNewUserUsername(event.target.value);
  };

  const handleNewUserPasswordChange = (event) => {
    setNewUserPassword(event.target.value);
  };

  const handleNewUserFirstNameChange = (event) => {
    setNewUserFirstName(event.target.value);
  };

  const handleNewUserLastNameChange = (event) => {
    setNewUserLastName(event.target.value);
  };

  const handleNewUserPESELChange = (event) => {
    const inputValue = event.target.value;

    const cleanedValue = inputValue.replace(/[^0-9.]/g, "");

    props.setNewUserPESEL(cleanedValue);
  };

  const handleNewUserSubmit = async (event) => {
    event.preventDefault();

    if (!newUserId) {
      setNewUserError("Please generate new ID");
      return;
    } else {
      setNewUserError("");
    }

    const newUserData = {
      userId: newUserId,
      username: newUserUsername,
      password: newUserPassword,
      accountType: "customer",
      balance: 0,
      firstName: newUserFirstName,
      lastName: newUserLastName,
      PESEL: newUserPESEL
    };

    await axios
      .post("/api/newuser", newUserData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        if (response.data.error) {
          setNewUserError(response.data.error);
        } else {
          setNewUserId("");
          setNewUserUsername("");
          setNewUserPassword("");
          setNewUserFirstName("");
          setNewUserLastName("");
          setNewUserPESEL("");
          setNewUserResponse(response.data.message);
          setTimeout(() => {
            setNewUserResponse("");
          }, 10000);
        }
      })
      .catch((error) => {
        setNewUserError(`Server error: ${error}`);
      });
  };

  return (
    <Card className="mt-4 p-4 w-50 container" border="secondary">
      <Card.Title>
        <h1>Create new user</h1>
      </Card.Title>
      <Card.Body>
        <Form.Group className="mb-3" controlId="newUserId">
          <Form.Label>
            Unique ID: <b>{newUserId}</b>
          </Form.Label>
          <br></br>
          <Button
            variant="secondary"
            type="button"
            onClick={handleNewUserIdChange}
          >
            Generate new ID
          </Button>
        </Form.Group>

        <Form onSubmit={handleNewUserSubmit} className="w-75">
          <Form.Group className="mb-3" controlId="newUserUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              onChange={handleNewUserUsernameChange}
              type="text"
              value={newUserUsername}
              placeholder="Enter new username"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="newUserPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="text"
              placeholder="Password"
              value={newUserPassword}
              onChange={handleNewUserPasswordChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="newUserFirstName">
            <Form.Label>First name</Form.Label>
            <Form.Control
              type="text"
              placeholder="First name"
              value={newUserFirstName}
              onChange={handleNewUserFirstNameChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="newUserLastName">
            <Form.Label>Last name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Last name"
              value={newUserLastName}
              onChange={handleNewUserLastNameChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="newUserPesel">
            <Form.Label>PESEL</Form.Label>

            <Form.Control
              type="text"
              placeholder="PESEL"
              value={newUserPESEL}
              onChange={handleNewUserPESELChange}
              required
              minLength={11}
              maxLength={11}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Create
          </Button>
          {newUserError.length > 0 ? (
            <Alert variant="danger" className="mt-2">
              {newUserError}
            </Alert>
          ) : (
            <></>
          )}
          {newUserResponse.length > 0 ? (
            <Alert variant="success" className="mt-2">
              {newUserResponse}
            </Alert>
          ) : (
            <></>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
};
