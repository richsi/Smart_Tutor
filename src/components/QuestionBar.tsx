import React, { useState } from "react";
import axios from "axios";

// Define the interface for the component's props
interface QuestionBarProps {
  createdBy: string | null;
  videoId: string;
  setTab: () => void;
}

// React functional component for a question input bar
const QuestionBar: React.FC<QuestionBarProps> = ({
  createdBy,
  videoId,
  setTab,
}) => {
  // State variables to manage question input and server response
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");

  // Handle input change in the question field
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  // Handle form submission (question asking)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Send a POST request to the server with the question data
      const response = await axios.post(
        "http://127.0.0.1:3000/send-question",
        {
          videoId: videoId,
          createdBy: createdBy,
          question: question,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Update the component state with the server response
      setResponse(response.data.answer);

      // Log information about the question being asked
      // console.log("Creating thread for video ID:", videoId);
      // console.log("Created by user:", createdBy);
      // console.log("Asking:", question);
    } catch (error) {
      // Log an error if there's an issue sending the question
      console.error("Error sending question:", error);
    }

    // Switch to the "Threads" tab after submitting the question
    setTab();
  };

  // Render the QuestionBar component
  return (
    <div className="p-4 bg-white shadow-lg opacity-75 rounded-lg resize-auto">
      <form
        onSubmit={handleSubmit}
        className="flex flex-row space-x-3 resize-auto"
      >
        <input
          type="text"
          value={question}
          onChange={handleChange}
          id="questionInput"
          placeholder="Type question here"
          className="flex-grow w-full p-2 text-black bg-white border border-transparent opacity-75 roudned-md resize-auto focus:outline-none"
        />
        {/* Submit button for sending the question */}
        <button
          type="submit"
          className="self-end p-2 text-blue-950 bg-orange-200 hover:bg-orange-300 rounded-md"
        >
          Send Question
        </button>
        {/* Display the server response, if any */}
        {response && (
          <div>
            <strong>Response:</strong> {response}
          </div>
        )}
      </form>
    </div>
  );
};

// Export the QuestionBar component
export default QuestionBar;
