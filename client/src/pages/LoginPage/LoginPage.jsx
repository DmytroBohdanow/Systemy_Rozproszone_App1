import React, { useState } from "react";
import axios from "axios";
import { useAuth } from '../../utils/authProvider';

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
        if (response.data[0].username === username && response.data[0].password === password) {
          
          setError("");
          login(response.data[0]);
          console.log(response.data[0]);
        } else if (response.data[0].password !== password) {
          setError("Password incorrect");
          return null;
        }
      });

    // Reset the form fields
    setUsername("");
    setPassword("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={handleUsernameChange}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
        />
      <label>
        <input type="checkbox" checked={isAdmin} onChange={() => setIsAdmin(!isAdmin)}/>
        Login as admin
      </label>
      
      </div>
      {error.length > 0 ? <p>{error}</p> : <></>}
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginPage;
