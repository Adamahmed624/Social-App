import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { authContext } from "../../Context/AuthContext";

export default function GuestRoute({ children }) {
  const { userToken } = useContext(authContext);
  if (userToken) {
    return <Navigate to="/home" replace />;
  }
  return children;
}