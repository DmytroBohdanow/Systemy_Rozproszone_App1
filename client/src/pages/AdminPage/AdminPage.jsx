import { Navigate } from 'react-router-dom';
import React from 'react';
import { useAuth } from "../../utils/authProvider";


const AdminPage = () => {
  const { user } = useAuth();


  if (user.accountType !== "admin") {
    return <Navigate to="/customer" />;
  }

  return (
    <div>
      <h1>Welcome to the admin Page</h1>
      <p>This is the admin page of our website.</p>
    </div>
  );
};

export default AdminPage;
