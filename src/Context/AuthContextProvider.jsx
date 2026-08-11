import { useState } from "react";
import { authContext } from "./AuthContext";

export default function AuthContextProvider({ children }) {
  const [userToken, setuserToken] = useState(localStorage.getItem("token")||null)
  return (
    <authContext.Provider value={{userToken, setuserToken}}>
      {children}
    </authContext.Provider>
  );
}