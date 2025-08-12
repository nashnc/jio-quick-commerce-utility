// components/BarcodeDisplay.jsx
import React from "react";
import Barcode from "react-barcode";
import { QRCodeSVG } from "qrcode.react";

const BarcodeDisplay = ({ finalCode, DEFAULT_CODE, articleLabel }) => {
  const isDefault = finalCode === DEFAULT_CODE;

  return (
    <section className="mt-5 flex flex-col items-center gap-6">
      {!isDefault ? (
        articleLabel && (
          <p className="mt-1 text-center text-sm text-gray-600">
            {articleLabel}
          </p>
        )
      ) : (
        <p className="mt-1 text-center text-sm text-gray-600">Onion </p>
      )}

      <Barcode value={finalCode} />
      <div className="bg-white p-2">
        <QRCodeSVG value={finalCode} size={180} />
      </div>
    </section>
  );
};

export default BarcodeDisplay;
