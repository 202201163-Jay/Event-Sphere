import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUserName] = useState("");
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  // const [userData, setUserData] = useState(null);
  const [image, setimage] = useState(null); // Default or fallback image

  const authorizationToken = `Bearer ${token}`;

  const storeTokenInLs = (serverToken, name, userId, image) => {
    setToken(serverToken);
    setUserName(name);
    setUserId(userId);
    setimage(image);
   
    localStorage.setItem("token", serverToken);
    localStorage.setItem("userId", userId);
    localStorage.setItem("image", image);
  };

  const isLoggedIn = !!token;

  const [isCollegeRepresentative, setIsCollegeRepresentative] = useState(false);

  const Logout = () => {
    setToken("");
    setUserName("");
    setUserId("");
    setimage(""); // Clear profile image on logout
    setIsCollegeRepresentative(false);
    
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("image"); // Remove profile image from local storage
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        storeTokenInLs,
        Logout,
        authorizationToken,
        isCollegeRepresentative,
        setIsCollegeRepresentative,
        username,
        userId,
        image, // Make profile image available in context
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
