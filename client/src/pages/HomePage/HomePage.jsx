import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Navigate } from "react-router-dom";
import CurrencyInput from "../../components/CurrencyInput";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../../utils/authProvider";

const HomePage = () => {
  const [newTransfer, setNewTransfer] = useState(false);
  const [transferValue, setTransferValue] = useState("");
  const [transferDestination, setTransferDestination] = useState("");
  const [transferResponse, setTransferResponse] = useState("");
  const [topUp, setTopUp] = useState(false);
  const [topUpValue, setTopUpValue] = useState("");
  const [topUpResponse, setTopUpResponse] = useState("");
  const [isErrorMsg, setIsErrorMsg] = useState(false);
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
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
  }, [])

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

  const handleTopUpSubmit = async (event) => {};

  const handleDestinationChange = (event) => {
    setTransferDestination(event.target.value);
  };

  if (user.accountType !== "customer") {
    return <Navigate to="/admin" />;
  }

  return (
    <div>
      {userData ? <div>
        <h1>Welcome {userData.username}!</h1>
        <p>Your account balance: {userData.balance} zł</p>
        <button
          onClick={() => {
            setNewTransfer(!newTransfer);
            setTopUp(false);
          }}
        >
          New transfer
        </button>
        <button
          onClick={() => {
            setTopUp(!topUp);
            setNewTransfer(false);
          }}
        >
          Top up your account
        </button>

        {newTransfer ? (
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

        {topUp ? (
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
      </div> : <p>Wait until your profile is loading...</p>}
    </div>
  );
};

export default HomePage;
