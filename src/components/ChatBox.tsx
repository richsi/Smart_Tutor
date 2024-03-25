import React, { useEffect, useState } from "react";
import "../index.css";
import { ThreadItem } from "../types";
import Threads from "./Threads";
import { getVideoSummary, getVideoThreads } from "../firebase";
import Summary from "./Summary";
import QuestionBar from "./QuestionBar";
import axios from "axios";
interface ChatBoxProps {
  videoId: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ videoId }) => {
  // State variables
  const [tab, setTab] = useState("Summary");
  const [threadItems, setThreadItems] = useState<ThreadItem[]>([]);
  const [summary, setSummary] = useState("");
  const [promptValue] = useState<string>("summarize this video");
  const [userId, setUserId] = useState("");
  // Fetch user ID from Chrome local storage on component mount

  useEffect(() => {
    chrome.storage.local.get(["userIdentifier"], function (result) {
      setUserId(result.userIdentifier);
    });
  }, []);
  // Handle submit of the summary request to the Flask server

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("link", videoId);
    formData.append("prompt", promptValue); // adding prompt to formData
    console.log("videoID:", videoId);
    try {
      const response = await axios.post(
        "http://127.0.0.1:3000/data",
        {
          link: videoId,
          prompt: promptValue,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setSummary(response.data.context);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };
  // Fetch video summary when component mounts or when videoId changes

  useEffect(() => {
    //gets videoSummary if in firebase and if not sends a request to Flask server requesting summary
    const fetch = async () => {
      try {
        setSummary("");
        const summary = await getVideoSummary(videoId);
        setSummary(summary);
      } catch (error) {
        console.error(error);
        setSummary("");
        handleSubmit();
      }
    };
    if (videoId) fetch();
  }, [videoId]);
  // Fetch video threads when component mounts or when tab changes

  useEffect(() => {
    //gets VideoThreads
    const fetch = async () => {
      try {
        const threads = await getVideoThreads(videoId);
        setThreadItems(threads);
      } catch (error) {
        setThreadItems([]);
        console.error(error);
      }
    };

    if (videoId) fetch();
  }, [videoId, tab]);
  // Map thread items to Threads components
  useEffect(() => {
    setTab("Summary");
  }, [videoId]);
  const renderThreads = threadItems.map((t) => (
    <Threads videoId={videoId} thread={t} userId={userId} />
  ));
  // Render the component

  return (
    <div className="flex flex-row text-blue-950 bg-orange-100 border-2 border-black md:flex-col min-h-[300px] max-h-[500px] overflow-y-auto rounded-lg text-2xl">
      <div className="flex border-r-2 border-black justify-items-center">
        <button
          className="border-b-2 border-b-gray-50 border-r border-r-gray-50 flex-auto p-10 text-center transition duration-300 bg-orange-200 border-b-2-gray-50 cursor-pointer hover:bg-orange-300 text-blue-950 font-bold"
          id="tab-summary"
          onClick={() => setTab("Summary")}
        >
          Summary
        </button>
        <button
          className="border-b-2 border-b-gray-50 border-r border-r-gray-50 flex-auto p-10 text-center transition duration-300 bg-orange-200 border-b-2-gray-50 cursor-pointer hover:bg-orange-300 text-blue-950 font-bold"
          id="tab-threads"
          onClick={() => setTab("Threads")}
        >
          Threads
        </button>
        <button
          className="flex-auto p-10 text-center transition duration-300 bg-orange-200 border-b-2 border-b-gray-50 cursor-pointer hover:bg-orange-300 text-blue-950 font-bold"
          id="tab-ask"
          onClick={() => setTab("Ask a Question")}
        >
          Ask a Question
        </button>
      </div>
      <div className="flex-grow overflow-y-scroll">
        <h2 className="p-4" id="discussionTitle">
          {tab}
        </h2>
        <div id="discussionBody" className="p-4 space-y-4">
          {tab === "Summary" && <Summary summary={summary} />}
          {tab === "Threads" && renderThreads}
          {tab === "Ask a Question" && (
            <QuestionBar
              createdBy={userId}
              videoId={videoId}
              setTab={() => setTab("Threads")}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default ChatBox;
