import React from "react";

export default function CopyButton({ data }) {
  const handleCopy = () => {
    const jsonString = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      alert("Data copied to clipboard!");
    });
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        padding: "8px 16px",
        borderRadius: "4px",
        border: "none",
        cursor: "pointer",
        backgroundColor: "#1976d2",
        color: "white",
        marginBottom: "1rem",
      }}
    >
      Copy Data as JSON
    </button>
  );
}
