import React from "react";

import axios from "axios";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import { v4 as uuidv4 } from "uuid";

export const DisplayNewAdminForm = (props) => {
  const {
    newAdminResponse,
    setNewAdminResponse,
    newAdminError,
    setNewAdminError,
    newAdminPassword,
    setNewAdminPassword,
    newAdminUsername,
    setNewAdminUsername,
    newAdminId,
    setNewAdminId,
  } = props;

  const handleNewAdminSubmit = async (event) => {
    event.preventDefault();

    if (!newAdminId) {
      setNewAdminError("Please generate new ID");
      return;
    } else {
      setNewAdminError("");
    }

    const newAdminData = {
      userId: newAdminId,
      username: newAdminUsername,
      password: newAdminPassword,
      accountType: "admin",
    };

    await axios
      .post("/api/newadmin", newAdminData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        if (response.data.error) {
          setNewAdminError(response.data.error);
        } else {
          setNewAdminId("");
          setNewAdminUsername("");
          setNewAdminPassword("");
          setNewAdminResponse(response.data.message);
          setTimeout(() => {
            setNewAdminResponse("");
          }, 10000);
        }
      })
      .catch((error) => {
        setNewAdminError(`Server error: ${error}`);
      });
  };

  const handleNewAdminIdChange = () => {
    setNewAdminId(uuidv4());
  };

  const handleNewAdminUsernameChange = (event) => {
    setNewAdminUsername(event.target.value);
  };

  const handleNewAdminPasswordChange = (event) => {
    setNewAdminPassword(event.target.value);
  };
  return (
    <Card className="mt-4 p-4 w-50 container" border="secondary">
      <Card.Title>
        <h1>Create new admin</h1>
      </Card.Title>
      <Card.Body>
        <Form.Group className="mb-3" controlId="newAdminId">
          <Form.Label>
            Unique ID: <b>{newAdminId}</b>
          </Form.Label>
          <br></br>
          <Button
            variant="secondary"
            type="button"
            onClick={handleNewAdminIdChange}
          >
            Generate new ID
          </Button>
        </Form.Group>

        <Form onSubmit={handleNewAdminSubmit} className="w-75">
          <Form.Group className="mb-3" controlId="newAdminUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              onChange={handleNewAdminUsernameChange}
              type="text"
              value={newAdminUsername}
              placeholder="Enter new admin username"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="newAdminPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="text"
              placeholder="Password"
              value={newAdminPassword}
              onChange={handleNewAdminPasswordChange}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Create
          </Button>
          {newAdminError.length > 0 ? (
            <Alert variant="danger" className="mt-2">
              {newAdminError}
            </Alert>
          ) : (
            <></>
          )}
          {newAdminResponse.length > 0 ? (
            <Alert variant="success" className="mt-2">
              {newAdminResponse}
            </Alert>
          ) : (
            <></>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
};
