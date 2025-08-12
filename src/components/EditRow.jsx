import React, { useState } from "react";
import { Save, X } from "lucide-react";

const weightOptions = [
  { value: "", label: "Select Weight" },
  { value: "1 kg", label: "1 kg" },
  { value: "2 kg", label: "2 kg" },
  { value: "750 gm", label: "750 gm" },
  { value: "500 gm", label: "500 gm" },
  { value: "250 gm", label: "250 gm" },
  { value: "200 gm", label: "200 gm" },
  { value: "150 gm", label: "150 gm" },
  { value: "100 gm", label: "100 gm" },
];

export default function EditRow({ item, onSave, onCancel, existingData }) {
  const [editData, setEditData] = useState({ ...item });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "isBilledAsEa" && checked ? { mostBroughtWeight: "" } : {}),
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateEdit = () => {
    const newErrors = {};

    if (!editData.articleCode.trim()) {
      newErrors.articleCode = "Article Code is required";
    } else if (
      existingData.some(
        (i) =>
          i.id !== editData.id &&
          i.articleCode === editData.articleCode &&
          i.articleLabel === editData.articleLabel &&
          i.mostBroughtWeight === editData.mostBroughtWeight,
      )
    ) {
      newErrors.articleCode = "Duplicate article exists";
    }

    if (!editData.articleLabel.trim()) {
      newErrors.articleLabel = "Article Label is required";
    }

    if (!editData.isBilledAsEa && !editData.mostBroughtWeight) {
      newErrors.mostBroughtWeight = "Weight is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateEdit()) {
      onSave(editData);
    }
  };

  return (
    <tr>
      <td style={{ padding: "6px 8px", border: "1px solid #ddd" }}>
        {item.id}
      </td>
      <td style={{ padding: "6px 8px", border: "1px solid #ddd" }}>
        <input
          type="text"
          name="articleCode"
          value={editData.articleCode}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "4px 6px",
            borderRadius: "4px",
            border: errors.articleCode ? "1px solid red" : "1px solid #ccc",
          }}
        />
        {errors.articleCode && (
          <div style={{ fontSize: "0.75rem", color: "red" }}>
            {errors.articleCode}
          </div>
        )}
      </td>
      <td style={{ padding: "6px 8px", border: "1px solid #ddd" }}>
        <input
          type="text"
          name="articleLabel"
          value={editData.articleLabel}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "4px 6px",
            borderRadius: "4px",
            border: errors.articleLabel ? "1px solid red" : "1px solid #ccc",
          }}
        />
        {errors.articleLabel && (
          <div style={{ fontSize: "0.75rem", color: "red" }}>
            {errors.articleLabel}
          </div>
        )}
      </td>
      <td style={{ padding: "6px 8px", border: "1px solid #ddd" }}>
        <select
          name="mostBroughtWeight"
          value={editData.mostBroughtWeight}
          onChange={handleChange}
          disabled={editData.isBilledAsEa}
          style={{
            width: "100%",
            padding: "4px 6px",
            borderRadius: "4px",
            border: errors.mostBroughtWeight
              ? "1px solid red"
              : "1px solid #ccc",
            backgroundColor: editData.isBilledAsEa ? "#eee" : "white",
          }}
        >
          {weightOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.mostBroughtWeight && (
          <div style={{ fontSize: "0.75rem", color: "red" }}>
            {errors.mostBroughtWeight}
          </div>
        )}
      </td>
      <td
        style={{
          padding: "6px 8px",
          border: "1px solid #ddd",
          textAlign: "center",
        }}
      >
        <input
          type="checkbox"
          name="isBilledAsEa"
          checked={editData.isBilledAsEa}
          onChange={handleChange}
        />
      </td>
      <td style={{ padding: "6px 8px", border: "1px solid #ddd" }}>
        <button
          onClick={handleSave}
          title="Save"
          style={{ marginRight: "8px" }}
        >
          <Save size={16} />
        </button>
        <button onClick={onCancel} title="Cancel">
          <X size={16} />
        </button>
      </td>
    </tr>
  );
}
