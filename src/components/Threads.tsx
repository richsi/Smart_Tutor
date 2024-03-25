import React, { useState } from "react";
import { ThreadItem } from "../types";
import Comments from "./Comments";
import CommentForm from "./CommentForm";

// Define the interface for the component's props
interface ThreadsProps {
  thread: ThreadItem;
  videoId: string;
  userId: string;
}

// React functional component for displaying thread information and comments
const Threads: React.FC<ThreadsProps> = ({ thread, videoId, userId }) => {
  // State variable to trigger a rerender when comments are added
  const [update, forceUpdate] = useState(0);

  // Function to handle the click event and trigger a rerender
  const handleClick = () => {
    // Update the state with an empty object (a value that doesn't impact the UI)
    forceUpdate(update + 1);
  };

  // Render the Threads component
  return (
    <div className="p-4 text-black bg-white rounded shadow-lg">
      {/* Display the thread title and first comment */}
      <h3 className="text-lg font-bold">{thread.Title}</h3>
      <p className="text-gray-700">{thread.FirstComment}</p>

      {/* Render the CommentForm component for adding new comments */}
      <CommentForm
        threadId={thread.ThreadId}
        videoId={videoId}
        userId={userId}
        rerender={handleClick}
      />

      <div className="mt-2 space-y-4 text-gray-700">
        <Comments
          threadId={thread.ThreadId}
          videoId={videoId}
          update={update}
          rerender={handleClick}
          userId={userId}
        />

        {/* Render the Comments component to display existing comments */}

      </div>
    </div>
  );
};

// Export the Threads component
export default Threads;
