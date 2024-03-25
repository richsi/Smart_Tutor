import { DOMMessage, DOMMessageResponse } from "../types";
import "../index.css";
import ReactDOM from "react-dom";
import ChatBox from "../components/ChatBox";
import { collection, getDocs } from "firebase/firestore";
import { useState } from "react";

const styleSheetContent = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');

body {
  font-family: 'Calibri', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Bebas Neue', sans-serif;
}

/* Other styles can go here */
`;

// // Create a style element
// const styleElement = document.createElement("style");
// styleElement.type = "text/css";

// // Add the style rules to the style element
// styleElement.appendChild(document.createTextNode(styleSheetContent));

// // Append the style element to the document head
// document.head.appendChild(styleElement);

let currentVideoId: string | null = null;

// Check if the current page is a YouTube watch page and start polling for the comments section
if (
  window.location.hostname === "www.youtube.com" &&
  window.location.pathname.startsWith("/watch")
) {
  startPollingForCommentsSection();
}

// Poll for the comments section and update it with the custom discussion section if necessary
function startPollingForCommentsSection(): void {
  const intervalId = setInterval(() => {
    const commentsSection: Element | null =
      document.querySelector("ytd-comments");
    const videoId: string | null = new URLSearchParams(
      window.location.search
    ).get("v");

    // Check if the comments section is present and if the video ID has changed or the discussion section is not present
    if (
      commentsSection &&
      videoId &&
      (videoId !== currentVideoId ||
        !document.getElementById("smartTutorDiscussion"))
    ) {
      //console.log("newVideo", videoId);
      currentVideoId = videoId; // Update the current video ID
      addOrUpdateDiscussionSection(commentsSection, videoId); // Pass videoId as the second argument
    }
  }, 1000); // Check every second
}

async function addOrUpdateDiscussionSection(
  commentsSection: Element,
  videoId: string
): Promise<void> {
  let discussionDiv: HTMLElement | null = document.getElementById(
    "smartTutorDiscussion"
  );

  // If the discussion section doesn't exist, create it
  if (!discussionDiv) {
    discussionDiv = document.createElement("div");
    discussionDiv.id = "smartTutorDiscussion";
    commentsSection.parentNode?.insertBefore(discussionDiv, commentsSection);
  }
  ReactDOM.render(<ChatBox videoId={videoId} />, discussionDiv);
}

// You would need CSS to style your tabs and content area, which you can add to your stylesheets

// Listener for messages from the extension
const messagesFromReactAppListener = (
  msg: DOMMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: DOMMessageResponse) => void
) => {
  console.log("[content.js]. Message received", msg);

  const response: DOMMessageResponse = {
    title: document.title,
    headlines: Array.from(document.getElementsByTagName<"h1">("h1")).map(
      (h1) => h1.innerText
    ),
  };

  console.log("[content.js]. Message response", response);

  sendResponse(response);
};

// Add the message listener to the runtime
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
