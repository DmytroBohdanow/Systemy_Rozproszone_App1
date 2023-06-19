import {
  Routes,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import React, { useState } from "react";
import LoginPage from "./pages/LoginPage/LoginPage";
import HomePage from "./pages/HomePage/HomePage";
import AdminPage from "./pages/AdminPage/AdminPage";
import { ProtectedLayout } from "./components/ProtectedLayout";
import { AuthLayout } from "./components/AuthLayout";
import axios from 'axios';

import "./App.css";



const getUserData = async (username, password) => {
  await axios
      .post(
        "/api/login",
        {
          password: password,
          username: username,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((response) => {
        return response.data
      });
}

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>

<Route
      element={<AuthLayout />}
    >
      <Route path="/login" element={<LoginPage />} />

      <Route path="/" element={<ProtectedLayout />}>
        <Route path="customer" element={<HomePage />} />
        <Route path="admin" element={<AdminPage />} />
      </Route>
      </Route>
    </>
  )
);
