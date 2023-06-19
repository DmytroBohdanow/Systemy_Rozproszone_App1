import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
const AuthContext = createContext();

export const AuthProvider = ({ children, userData }) => {
  const [user, setUser] = useLocalStorage("user", userData);
  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const login = (data) => {
    setUser(data);
    console.log(user)
    if(data.accountType === "admin") {
      navigate("/admin");
    } else {
      navigate("/customer");
    }
  };

  const refreshUserData = (data) => {
    setUser(data);
  }

  // call this function to sign out logged in user
  const logout = () => {
    setUser(null);
    navigate("/login", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};