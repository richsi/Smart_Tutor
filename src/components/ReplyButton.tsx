import React from "react";

// Define the interface for the component's props
interface ReplyProps {
  onClick: () => void;
  numReplies: number;
}

// React functional component for a reply button
const ReplyButton: React.FC<ReplyProps> = ({ onClick, numReplies }) => {
  // Determine whether to display "Reply" or "Replies" based on the number of replies
  const replyString = numReplies === 1 ? "Reply" : "Replies";

  // Render the ReplyButton component
  return (
    <button className="text-black" onClick={onClick}>
      {numReplies} {replyString}
    </button>
  );
};

// Export the ReplyButton component
export default ReplyButton;
