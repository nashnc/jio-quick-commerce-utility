import React, { useState } from "react";

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
  const [formData, setFormData] = useState({ ...item });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.articleCode.trim()) {
      newErrors.articleCode = "Article Code is required";
    } else if (
      existingData.some(
        (dataItem) =>
          dataItem.id !== item.id &&
          dataItem.articleCode === formData.articleCode &&
          dataItem.articleLabel === formData.articleLabel &&
          dataItem.mostBroughtWeight === formData.mostBroughtWeight,
      )
    ) {
      newErrors.articleCode = "Duplicate article exists";
    }

    if (!formData.articleLabel.trim()) {
      newErrors.articleLabel = "Article Label is required";
    }

    if (!formData.isBilledAsEa && !formData.mostBroughtWeight) {
      newErrors.mostBroughtWeight = "Weight is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
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
          value={formData.articleCode}
          onChange={handleInputChange}
          style={{
            width: "100%",
            padding: "4px",
            border: errors.articleCode ? "1px solid red" : "1px solid #ccc",
          }}
        />
        {errors.articleCode && (
          <div style={{ color: "red", fontSize: "0.8rem" }}>
            {errors.articleCode}
          </div>
        )}
      </td>
      <td style={{ padding: "6px 8px", border: "1px solid #ddd" }}>
        <input
          type="text"
          name="articleLabel"
          value={formData.articleLabel}
          onChange={handleInputChange}
          style={{
            width: "100%",
            padding: "4px",
            border: errors.articleLabel ? "1px solid red" : "1px solid #ccc",
          }}
        />
        {errors.articleLabel && (
          <div style={{ color: "red", fontSize: "0.8rem" }}>
            {errors.articleLabel}
          </div>
        )}
      </td>
      <td style={{ padding: "6px 8px", border: "1px solid #ddd" }}>
        <select
          name="mostBroughtWeight"
          value={formData.mostBroughtWeight}
          onChange={handleInputChange}
          disabled={formData.isBilledAsEa}
          style={{
            width: "100%",
            padding: "4px",
            border: errors.mostBroughtWeight
              ? "1px solid red"
              : "1px solid #ccc",
            backgroundColor: formData.isBilledAsEa ? "#eee" : "",
          }}
        >
          {weightOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.mostBroughtWeight && (
          <div style={{ color: "red", fontSize: "0.8rem" }}>
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
          checked={formData.isBilledAsEa}
          onChange={handleInputChange}
        />
      </td>
      <td style={{ padding: "6px 8px", border: "1px solid #ddd" }}>
        <button onClick={handleSubmit} style={{ marginRight: "8px" }}>
          Save
        </button>
        <button onClick={onCancel}>Cancel</button>
      </td>
    </tr>
  );
}
