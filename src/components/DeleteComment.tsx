import React from "react";
import { CommentItem } from "../types";
import { deleteCommentsfromThreads } from "../firebase";

interface DeleteCommentProps {
  videoId: string;
  threadId: string;
  comment: CommentItem;
  deleteComment: () => void;
}

const DeleteComment: React.FC<DeleteCommentProps> = ({
  videoId,
  threadId,
  comment,
  deleteComment,
}) => {
  const handleDeleteComment = async (comment: CommentItem) => {
    try {
      if (comment.CommentId) {
        await deleteCommentsfromThreads(videoId, threadId, comment.CommentId);
        deleteComment();
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  return (
    <button
      onClick={() => handleDeleteComment(comment)}
      className="px-4 py-2 ml-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 absolute right-0"
    >
      Delete
    </button>
  );
};

export default DeleteComment;
