import React, { useEffect, useState } from "react";
import { CommentItem } from "../types";
import { addCommentstoThreads } from "../firebase";

interface CommentFormProps {
  videoId: string;
  threadId: string;
  userId: string;
  rerender: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
  videoId,
  threadId,
  userId,
  rerender,
}) => {
  // State variables

  const [comment, setComment] = useState<string>("");
  const [commentItem, setCommentItem] = useState<CommentItem>({
    CommentText: comment,
    CreatedBy: userId,
  });
  // Update commentItem when the comment changes

  useEffect(() => {
    setCommentItem((prevItem) => ({
      ...prevItem,
      CommentText: comment,
    }));
  }, [comment]);
  // Handle changes in the comment input field

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };
  // Handle the submission of a new comment

  const handleSubmitComment = async () => {
    try {
      if (commentItem) {
        // Add the comment to the thread in Firebase

        await addCommentstoThreads(videoId, threadId, commentItem);
        // Trigger a rerender of the parent component

        rerender();
      }
      // Clear the comment input field after submission

      setComment("");
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };
  // Render the component

  return (
    <div className="flex items-center py-2 border-t border-gray-200">
      <input
        type="text"
        placeholder="Type your message..."
        value={comment}
        onChange={handleMessageChange}
        className="w-full px-4 border-none outline-none focus:ring-0"
      />
      <button
        onClick={handleSubmitComment}
        disabled={comment === ""}
        className="px-4 py-2 ml-2 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Reply
      </button>
    </div>
  );
};

export default CommentForm;
