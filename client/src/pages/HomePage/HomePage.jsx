import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../../utils/authProvider";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Button from "react-bootstrap/Button";

const HomePage = () => {
  const [transferValue, setTransferValue] = useState("");
  const [transferDestination, setTransferDestination] = useState("");
  const [transferResponse, setTransferResponse] = useState("");
  const [transferError, setTransferError] = useState(false);
  const [topUpValue, setTopUpValue] = useState("");
  const [topUpResponse, setTopUpResponse] = useState("");
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [changeModal, setChangeModal] = useState(false);
  const [changePasswordValue, setChangePasswordValue] = useState("");
  const [changeFirstNameValue, setChangeFirstNameValue] = useState("");
  const [changeLastNameValue, setChangeLastNameValue] = useState("");
  const [changePESELValue, setChangePESELValue] = useState("");
  const [changeResponse, setChangeResponse] = useState("");
  const [changeError, setChangeError] = useState(false);

  const radios = [
    { name: "New transfer", value: "1" },
    { name: "Top up your account", value: "2" },
    { name: "Your personal info", value: "3" },
  ];
  const [radioValue, setRadioValue] = useState("");

  const fetchUserData = async () => {
    await axios
      .post("/api/users", user, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        setUserData(response.data.user);
      });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (radioValue === "3") {
      fetchUserData();
    }
  }, [radioValue]);

  const handleChangeModalOpen = () => {
    setChangeModal(true);
    setChangePasswordValue(userData.password);
    setChangeFirstNameValue(userData.firstName);
    setChangeLastNameValue(userData.lastName);
    setChangePESELValue(userData.PESEL);
  };

  const handleChangeModalClose = () => {
    setChangeModal(false);
  };
  const handleChangeModalSave = async () => {
    const newUserChange = {
      username: user.username,
      password: changePasswordValue,
      accountType: user.accountType,
      firstName: changeFirstNameValue,
      lastName: changeLastNameValue,
      PESEL: changePESELValue,
    };

    await axios
      .post("/api/user/edit", newUserChange, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        fetchUserData();
        if (response.data.error) {
          setChangeError(true);
        } else {
          setChangeError(false);
        }
        setChangePasswordValue(response.data.user.password);
        setChangeFirstNameValue(response.data.user.firstName);
        setChangeLastNameValue(response.data.user.lastName);
        setChangePESELValue(response.data.user.PESEL);
        setChangeResponse(response.data.message);
        setTimeout(() => {
          setChangeResponse("");
        }, 10000);
      })
      .catch((error) => {
        setChangeError(true);
        setChangeResponse(`Server error: ${error}`);
      });
  };

  const handleChangePasswordValue = (event) => {
    setChangePasswordValue(event.target.value);
  };
  const handleChangeFirstNameValue = (event) => {
    setChangeFirstNameValue(event.target.value);
  };
  const handleChangeLastNameValue = (event) => {
    setChangeLastNameValue(event.target.value);
  };

  const handleChangePESELValue = (event) => {
    const inputValue = event.target.value;

    const cleanedValue = inputValue.replace(/[^0-9.]/g, "");

    setChangePESELValue(cleanedValue);
  };

  const handleTransferSubmit = async (event) => {
    event.preventDefault();
    const newBalance = userData.balance - transferValue;

    if (newBalance < 0 || user.balance <= 0) {
      setTransferResponse(
        `Insufficient funds! Top up at least ${
          newBalance * -1 + 1
        } złoty first, dirt-poor`
      );
      setTimeout(() => {
        setTransferResponse("");
      }, 10000);
      return null;
    }

    const transfer = {
      transferId: uuidv4(),
      transferSender: user.username,
      transferDestination: transferDestination,
      transferValue: transferValue,
      balance: newBalance,
      transferDate: new Date().toLocaleString("pl-PL", { timeZone: "UTC" }),
      type: "transfer",
    };

    await axios
      .post("/api/transfer", transfer, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        setTransferValue("");
        setTransferDestination("");
        if (response.data.error) {
          setTransferError(true);
        } else {
          setTransferError(false);
        }
        setTransferResponse(response.data.message);
        setUserData(response.data.user);
        setTimeout(() => {
          setTransferResponse("");
        }, 10000);
      })
      .catch((error) => {
        setTransferResponse(`Server error: ${error}`);
      });
  };

  const handleTopUpSubmit = async (event) => {
    event.preventDefault();

    const topUp = {
      transferId: uuidv4(),
      user: user.username,
      topUpValue: topUpValue,
      topUpDate: new Date().toLocaleString("pl-PL", { timeZone: "UTC" }),
      type: "top up",
    };

    await axios
      .post("/api/topup", topUp, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        setTopUpValue("");
        setTopUpResponse(response.data.message);
        setUserData(response.data.user);
        setTimeout(() => {
          setTopUpResponse("");
        }, 10000);
      })
      .catch((error) => {
        setTopUpResponse(`Server error: ${error}`);
      });
  };

  const handleDestinationChange = (event) => {
    setTransferDestination(event.target.value);
  };

  const handleTransferValueChange = (event) => {
    const inputValue = event.target.value;

    const cleanedValue = inputValue.replace(/[^0-9.]/g, "");

    setTransferValue(cleanedValue);
  };

  const handleTopUpValueChange = (event) => {
    const inputValue = event.target.value;

    const cleanedValue = inputValue.replace(/[^0-9.]/g, "");

    setTopUpValue(cleanedValue);
  };

  if (user.accountType !== "customer") {
    return <Navigate to="/admin" />;
  }

  return (
    <div>
      {userData ? (
        <div>
          <Card className="container mt-4" border="secondary">
            <Card.Body>
              <Card.Title className="mb-4">
                <h1>Welcome {userData.username}!</h1>
              </Card.Title>
              <Card.Subtitle className="text-muted">
                <h4>Your account balance:</h4>
              </Card.Subtitle>
              <Card.Text className="mt-2 border-bottom">
                <h1>{userData.balance} zł</h1>
              </Card.Text>
              <ButtonGroup className="mt-2">
                {radios.map((radio, idx) => (
                  <ToggleButton
                    key={idx}
                    id={`radio-${idx}`}
                    type="radio"
                    variant="outline-primary"
                    name="radio"
                    value={radio.value}
                    checked={radioValue === radio.value}
                    onChange={(e) => setRadioValue(e.currentTarget.value)}
                  >
                    {radio.name}
                  </ToggleButton>
                ))}
              </ButtonGroup>
            </Card.Body>
          </Card>

          {radioValue === "1" ? (
            <Card className="mt-4 p-4 container" border="secondary">
              <Card.Title>New transfer</Card.Title>
              <Card.Body>
                <Form onSubmit={handleTransferSubmit} className="w-75">
                  <Form.Group className="mb-3" controlId="transferDestination">
                    <Form.Label>Transfer to:</Form.Label>
                    <Form.Control
                      type="text"
                      value={transferDestination}
                      onChange={handleDestinationChange}
                      placeholder="Enter receiver username"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3 w-50" controlId="quote">
                    <Form.Label>Quote</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Quote in zł"
                      value={transferValue}
                      onChange={handleTransferValueChange}
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Send
                  </Button>
                  {transferResponse.length > 0 ? (
                    <Alert
                      variant={transferError ? "danger" : "info"}
                      className="mt-2"
                    >
                      {transferResponse}
                    </Alert>
                  ) : (
                    <></>
                  )}
                </Form>
              </Card.Body>
            </Card>
          ) : (
            <></>
          )}

          {radioValue === "2" ? (
            <Card className="mt-4 p-4 container" border="secondary">
              <Card.Title>New top up (only your own account)</Card.Title>
              <Card.Body>
                <Form onSubmit={handleTopUpSubmit} className="w-75">
                  <Form.Group className="mb-3 w-50" controlId="quote">
                    <Form.Label>Quote</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Quote in zł"
                      value={topUpValue}
                      onChange={handleTopUpValueChange}
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Top up
                  </Button>
                  {topUpResponse.length > 0 ? (
                    <Alert variant="success" className="mt-2">
                      {topUpResponse}
                    </Alert>
                  ) : (
                    <></>
                  )}
                </Form>
              </Card.Body>
            </Card>
          ) : (
            <></>
          )}
          {radioValue === "3" ? (
            <>
              <Card className="w-50 container mt-4 mb-5" border="secondary">
                <Card.Body>
                  <Card.Title className="mb-4">
                    Your personal information
                  </Card.Title>
                  <table className="table w-75">
                    <tbody>
                      <tr>
                        <td>
                          <h4>Account ID:</h4>
                        </td>
                        <td>{userData.userId}</td>
                      </tr>
                      <tr>
                        <td>
                          <h4>Account type:</h4>
                        </td>
                        <td>{userData.accountType}</td>
                      </tr>
                      <tr>
                        <td>
                          <h4>Username:</h4>
                        </td>
                        <td>{userData.username}</td>
                      </tr>
                      <tr>
                        <td>
                          <h4>Password:</h4>
                        </td>
                        <td>{userData.password}</td>
                      </tr>
                      <tr>
                        <td>
                          <h4>First name:</h4>
                        </td>
                        <td>{userData.firstName}</td>
                      </tr>
                      <tr>
                        <td>
                          <h4>Last name:</h4>
                        </td>
                        <td>{userData.lastName}</td>
                      </tr>
                      <tr>
                        <td>
                          <h4>PESEL:</h4>
                        </td>
                        <td>{userData.PESEL}</td>
                      </tr>
                    </tbody>
                  </table>
                  <Button variant="warning" onClick={handleChangeModalOpen}>
                    Change
                  </Button>
                </Card.Body>
              </Card>
              <Modal
                show={changeModal}
                onHide={handleChangeModalClose}
                backdrop="static"
                keyboard={false}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Change your personal info</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form onSubmit={handleTopUpSubmit} className="w-75">
                    <Form.Group className="mb-3" controlId="changePassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Password"
                        value={changePasswordValue}
                        onChange={handleChangePasswordValue}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="changeFirstName">
                      <Form.Label>First name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="First name"
                        value={changeFirstNameValue}
                        onChange={handleChangeFirstNameValue}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="changeLastName">
                      <Form.Label>Last name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Last name"
                        value={changeLastNameValue}
                        onChange={handleChangeLastNameValue}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="changePESEL">
                      <Form.Label>PESEL</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="PESEL"
                        value={changePESELValue}
                        onChange={handleChangePESELValue}
                        required
                        maxLength={11}
                      />
                    </Form.Group>
                    {changeResponse.length > 0 ? (
                      <Alert variant={changeError ? "danger" :"success"} className="mt-2">
                        {changeResponse}
                      </Alert>
                    ) : (
                      <></>
                    )}
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleChangeModalClose}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleChangeModalSave}>
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <p>Wait until your profile is loading...</p>
      )}
    </div>
  );
};

export default HomePage;
