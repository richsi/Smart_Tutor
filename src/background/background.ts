// src/scripts/background.ts

// Adding an empty export to make this file a module
export {};

// This is a basic background script that listens for a browser event.
// Replace the content with your actual background script logic.

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed and background script loaded.");
  // Perform some initialization if required
});

// Listen for messages from content scripts or popup and respond
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in background script:", message);
  // Process the message as required
  sendResponse({ status: "Message received by background script" });
  return true; // Return true to indicate you wish to send a response asynchronously
});

// This function could be used to fetch user information using the token.
function getUserInfo(token: string): Promise<any> {
  return fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Failed to fetch user info.');
    }
    return response.json();
  });
}

// Listen for messages from the popup.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.token) {
    getUserInfo(request.token)
      .then(userInfo => {
        sendResponse(userInfo);
      })
      .catch(error => {
        console.error('Error fetching user information:', error);
      });
    // Return true to indicate that you want to send a response asynchronously.
    return true;
  }
});
// Add more logic for background tasks as needed
