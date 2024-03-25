import React, { useState } from "react";
import "../index.css";
import smartTutorIcon from '../smart-tutor-icon.png'

// Props for the LogoutForm component

interface LogoutFormProps {
  onLogin?: (username: string, password: string) => void;
  signInWithGoogle?: () => void;
  Logout?: () => void;
}

// React functional component for a logout form
const LogoutForm: React.FC<LogoutFormProps> = ({ onLogin, signInWithGoogle, Logout }) => {
  // State variables to manage username and password input values
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Handle logout button click
  const handleLogout = () => {
    // Perform validation if needed
    // For simplicity, assuming the validation is successful
    if (onLogin) {
      onLogin(username, password);
    }
  };

  // Render the LogoutForm component
  return (
    <div className="px-10 w-full bg-orange-100 h-60 padding-bottom: 10px">
      <div className="flex flex-col items-stretch justify-evenly justify-center">
        <div className="flex items-center justify-center text-xl text-blue-950 text-center py-10">
          <img src={smartTutorIcon} className="mr-4 w-8 h-8"/>
          welcome to SmartTutor!
        </div>
      </div>
    </div>
  );
};

// Export the LogoutForm component
export default LogoutForm;
