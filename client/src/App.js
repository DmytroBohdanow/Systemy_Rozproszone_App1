import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import React from "react";
import LoginPage from "./pages/LoginPage/LoginPage";
import HomePage from "./pages/HomePage/HomePage";
import AdminPage from "./pages/AdminPage/AdminPage";
import { ProtectedLayout } from "./components/ProtectedLayout/ProtectedLayout";
import { AuthLayout } from "./components/AuthLayout";

import 'bootstrap/dist/css/bootstrap.min.css';


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
