import { createContext, useContext, useState, useEffect} from "react";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [username, setUserName] = useState("")
  const authorizationToken = `Bearer ${token}`
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  const storeTokenInLs = (serverToken, name, userId) => {
    setToken(serverToken)
    setUserName(name)
    setUserId(userId); 
    localStorage.setItem("token", serverToken)
    localStorage.setItem("userId", userId); 
  }

  const isLoggedIn = !!token
  console.log(isLoggedIn)
  const [isCollegeRepresentative, setIsCollegeRepresentative] = useState(false)

  const Logout = () => {
    setToken("")
    setUserName("")
    setUserId("");
    setIsCollegeRepresentative(false)
    localStorage.removeItem("token")
  }

  return (
    <AuthContext.Provider value={{isLoggedIn, storeTokenInLs, Logout, authorizationToken, isCollegeRepresentative, setIsCollegeRepresentative, username, userId}}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
