import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import CurrencyInput from "../../components/CurrencyInput";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../../utils/authProvider";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";

const HomePage = () => {
  const [transferValue, setTransferValue] = useState("");
  const [transferDestination, setTransferDestination] = useState("");
  const [transferResponse, setTransferResponse] = useState("");
  const [topUpValue, setTopUpValue] = useState("");
  const [topUpResponse, setTopUpResponse] = useState("");
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
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
            <form onSubmit={handleTransferSubmit}>
              <h2>New transfer</h2>
              <div>
                <label htmlFor="destination">Transfer to (username):</label>
                <input
                  type="text"
                  id="destination"
                  value={transferDestination}
                  onChange={handleDestinationChange}
                />
              </div>
              <div>
                <CurrencyInput
                  transferValue={transferValue}
                  setTransferValue={setTransferValue}
                />
              </div>
              <button type="submit">Send</button>
              {transferResponse ? transferResponse : <></>}
            </form>
          ) : (
            <></>
          )}

          {radioValue === "2" ? (
            <form onSubmit={handleTopUpSubmit}>
              <h2>Top up your account</h2>
              <div>
                <CurrencyInput
                  transferValue={topUpValue}
                  setTransferValue={setTopUpValue}
                />
              </div>
              <button type="submit">Top up</button>
              {topUpResponse ? topUpResponse : <></>}
            </form>
          ) : (
            <></>
          )}
          {radioValue === "3" ? (
            <div>
              <h2>Your personal information</h2>
              <table>
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
              </table>
            </div>
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
