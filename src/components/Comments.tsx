import { getThreadComments } from "../firebase";
import { CommentItem } from "../types";
import { useState, useEffect, useMemo, useRef } from "react";
import ReplyButton from "./ReplyButton";
import DeleteComment from "./DeleteComment";

interface CommentProps {
  videoId: string;
  threadId: string;
  update: number;
  rerender: () => void;
  userId: string;
}

const Comments: React.FC<CommentProps> = ({
  videoId,
  threadId,
  update,
  rerender,
  userId,
}) => {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [showComments, setShowComments] = useState<boolean>(false);
  const repliesFetchedRef = useRef(false);
  const [numReplies, setNumReplies] = useState<number>(0);

  // Reset repliesFetchedRef when update prop changes

  useEffect(() => {
    repliesFetchedRef.current = false;
  }, [update]);

  useEffect(() => {
    // Fetch comments when component mounts or when update, threadId, or videoId changes

    const fetch = async () => {
      try {
        // Fetch comments for the specified thread

        const commentItems = await getThreadComments(videoId, threadId);
        if (commentItems) {
          setComments(commentItems.comments);
          setNumReplies(commentItems.commentsSize);
        }
      } catch (error) {
        console.error(error);
        //setComments([]);
        setNumReplies(0);
      }
    };
    // Fetch comments only if replies have not been fetched yet and videoId is available

    if (!repliesFetchedRef.current && videoId) {
      fetch();
      repliesFetchedRef.current = true;
    }
  }, [threadId, videoId, update]);
  // Toggle the display of comments

  const toggleReplies = () => {
    setShowComments(!showComments);
  };

  const removeComment = (comment: CommentItem) => {
    comments.splice(comments.indexOf(comment), 1);
    console.log("comments", comments);
    rerender();
  };

  // Iterate over each comment in the snapshot
  // Memoize the rendered comments to avoid unnecessary re-renders

  const renderComments = useMemo(() => {
    // Iterate over each comment in the snapshot

    return comments.map((c) => (
      <div className="text-gray-700 relative">
        {c.CommentText}
        {c.CreatedBy === userId && (
          <DeleteComment
            deleteComment={() => removeComment(c)}
            comment={c}
            videoId={videoId}
            threadId={threadId}
          />
        )}
      </div>
    ));
  }, [comments, threadId, videoId]);

  return (
    <div>
      {numReplies !== 0 && comments.length !== 0 && (
        <ReplyButton onClick={toggleReplies} numReplies={numReplies} />
      )}
      <p>{showComments && comments.length !== 0 && renderComments}</p>
    </div>
  );
};

export default Comments;
