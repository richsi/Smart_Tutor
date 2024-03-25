import React, { useState } from "react";
import "../index.css";

import smartTutorIcon from "../smart-tutor-icon.png";

// Props for the LoginForm component

interface LoginFormProps {
  onLogin?: (username: string, password: string) => void;
  signInWithGoogle?: () => void;
  Logout?: () => void;
}

// React functional component for a login form
const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  signInWithGoogle,
  Logout,
}) => {
  // State variables to manage username and password input values
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Handle login button click
  const handleLogin = () => {
    // Perform validation if needed
    // For simplicity, assuming the validation is successful
    if (onLogin) {
      onLogin(username, password);
    }
  };

  // Render the LoginForm component
  return (
    <div className="px-10 w-full bg-orange-100 h-48 padding-bottom: 10px">
      <div className="flex flex-col items-stretch justify-evenly justify-center">
        <div className="flex items-center justify-center text-xl text-blue-950 text-center py-10">
          <img src={smartTutorIcon} className="mr-4 w-8 h-8" />
          SmartTutor
        </div>

        {/* Google sign-in button */}
        <button
          className="justify-center text-2xl text-blue-950 bg-orange-200 rounded-md shadow-md hover:bg-orange-300"
          type="button"
          onClick={signInWithGoogle}
        >
          Login
        </button>

        {/* Create an account button */}
        <button className="font-normal text-white text-l ">
          Don’t have an account? Create One
        </button>
      </div>
    </div>
  );
};

// Export the LoginForm component
export default LoginForm;
