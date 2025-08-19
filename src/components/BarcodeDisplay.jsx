// components/BarcodeDisplay.jsx
import React, { useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";

const BarcodeDisplay = ({ finalCode, DEFAULT_CODE, articleLabel }) => {
  const isDefault = finalCode === DEFAULT_CODE;
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && window.PDF417 && finalCode) {
      // Clear previous drawing
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // Draw PDF417 barcode
      window.PDF417.draw(finalCode, canvasRef.current);
    }
  }, [finalCode]);

  return (
    <section className="mt-5 flex flex-col items-center gap-6">
      {!isDefault ? (
        articleLabel && (
          <p className="mt-1 text-center text-sm text-gray-600">
            {articleLabel}
          </p>
        )
      ) : (
        <p className="mt-1 text-center text-sm text-gray-600">Onion</p>
      )}

      {/* PDF417 Barcode on Canvas */}
      <div className="bg-white p-2">
        <canvas ref={canvasRef} width={300} height={150} />
      </div>

      {/* QR Code */}
      {/* <div className="bg-white p-2">
        <QRCodeSVG value={finalCode} size={120} />
      </div> */}
    </section>
  );
};

export default BarcodeDisplay;
