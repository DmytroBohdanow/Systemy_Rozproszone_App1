import { Link, Navigate, useOutlet } from "react-router-dom";
import { useAuth } from "../utils/authProvider";

export const ProtectedLayout = () => {
  const { user, logout } = useAuth();
  const outlet = useOutlet();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <nav>
        {user.accountType === 'admin'? <Link to="/admin">Admin</Link> : <Link to="/customer">Customer</Link>}
        <button onClick={logout}>logout</button>
      </nav>
      {outlet}
    </div>
  )
};