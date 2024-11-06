import { createContext, useContext, useState, useEffect} from "react";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [username, setUserName] = useState("")
  const authorizationToken = `Bearer ${token}`

  const storeTokenInLs = (serverToken, name) => {
    setToken(serverToken)
    setUserName(name)
    localStorage.setItem("token", serverToken)
  }

  const isLoggedIn = !!token
  const [isCollegeRepresentative, setIsCollegeRepresentative] = useState(false)

  const Logout = () => {
    setToken("")
    setUserName("")
    setIsCollegeRepresentative(false)
    localStorage.removeItem("token")
  }

  return (
    <AuthContext.Provider value={{isLoggedIn, storeTokenInLs, Logout, authorizationToken, isCollegeRepresentative, setIsCollegeRepresentative, username}}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
