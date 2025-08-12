// components/ArticleCodeInput.jsx
import React, { useRef } from "react";

const ArticleCodeInput = ({ value, onChange }) => {
  const inputRef = useRef(null);
  let tapTimer = null;
  let lastTapTime = 0;

  const handleDoubleTap = () => {
    if (value.length === 9 && inputRef.current) {
      const targetPosition = value.length - 4;
      inputRef.current.focus();
      inputRef.current.setSelectionRange(targetPosition, targetPosition);
    }
  };

  const handleTouch = () => {
    const now = Date.now();
    const timeSince = now - lastTapTime;
    if (timeSince < 300 && timeSince > 0) {
      clearTimeout(tapTimer);
      handleDoubleTap();
    }
    lastTapTime = now;
  };

  return (
    <div className="flex w-full flex-col">
      <input
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        ref={inputRef}
        className="w-full overflow-x-scroll rounded-md border border-[rgba(0,0,0,0.5)] p-1"
        value={value}
        onChange={(e) => {
          const onlyDigits = e.target.value.replace(/\D/g, "");
          onChange(onlyDigits);
        }}
        placeholder="Enter Article Code..."
        onTouchEnd={handleTouch}
      />
    </div>
  );
};

export default ArticleCodeInput;
