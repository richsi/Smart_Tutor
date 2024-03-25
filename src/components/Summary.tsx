import React from "react";

// Define the interface for the component's props
interface SummaryProps {
  summary: string;
}

// React functional component for displaying a summary
const Summary: React.FC<SummaryProps> = ({ summary }) => {
  // Render the summary text
  return <div>{summary}</div>;
};

// Export the Summary component
export default Summary;
