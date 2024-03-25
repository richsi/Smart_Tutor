import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import LoginForm from "./components/LoginForm";
import LogoutForm from "./components/LogoutForm";

let exportUserIdentifier: () => string | null = () => null;

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [userIdentifier, setUserIdentifier] = useState<string | null>(null);

  // Function to initiate the OAuth flow and get the token
  const signInWithGoogle = () => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError) {
        console.error("SignIn Error:", chrome.runtime.lastError.message);
      } else if (token) {
        console.log("Token acquired:", token);
        setToken(token); //user token
      }
    });
  };

  const checkStoredUser = () => {
    chrome.storage.local.get(["userIdentifier"], function (result) {
      if (result.userIdentifier) {
        setUserIdentifier(result.userIdentifier);
      }
    });
  };

  // Call checkStoredUser when the component mounts
  useEffect(() => {
    checkStoredUser();
  }, []);

  // Use the token to make an authenticated request for user information
  const getUserInfo = async () => {
    if (token) {
      try {
        const response = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("User ID:", response.data.sub);
        setUserIdentifier(response.data.sub);
        exportUserIdentifier = () => userIdentifier;
        chrome.storage.local.set({ userIdentifier: response.data.sub });
        // Handle user information as needed
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    }
  };

  // Call getUserInfo when the token changes and is not null
  useEffect(() => {
    if (token) {
      getUserInfo();
    }
  }, [token]);

  return (
    <div>
      {userIdentifier ? (
        <LogoutForm />
      ) : (
        <LoginForm signInWithGoogle={signInWithGoogle} />
      )}
    </div>
  );
};

export { exportUserIdentifier as getUserIdentifier };

export default App;
