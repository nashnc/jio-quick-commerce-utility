import React from "react";

export default function CopyButton({ data }) {
  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    let successful = false;
    try {
      successful = document.execCommand("copy");
    } catch (err) {
      successful = false;
    }

    document.body.removeChild(textArea);
    return successful;
  };

  const handleCopy = () => {
    if (!data || data.length === 0) {
      alert("No data to copy.");
      return;
    }

    const textToCopy = JSON.stringify(data, null, 2);

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => alert("Copied!"))
        .catch(() => {
          // fallback if clipboard.writeText fails
          const success = fallbackCopyTextToClipboard(textToCopy);
          if (success) alert("Copied (fallback)!");
          else alert("Copy failed.");
        });
    } else {
      // fallback for older browsers
      const success = fallbackCopyTextToClipboard(textToCopy);
      if (success) alert("Copied (fallback)!");
      else alert("Clipboard API not supported.");
    }
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        padding: "8px 16px",
        borderRadius: 4,
        border: "none",
        cursor: "pointer",
        backgroundColor: "#1976d2",
        color: "#fff",
        marginBottom: 16,
      }}
    >
      Copy Data as JSON
    </button>
  );
}
