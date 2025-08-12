import React, { useState } from "react";
import { Plus } from "lucide-react";

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

export default function AddDataForm({ onAddData, existingData }) {
  const [formData, setFormData] = useState({
    articleCode: "",
    articleLabel: "",
    mostBroughtWeight: "",
    isBilledAsEa: false,
  });
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
        (item) =>
          item.articleCode === formData.articleCode &&
          item.articleLabel === formData.articleLabel &&
          item.mostBroughtWeight === formData.mostBroughtWeight,
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
      onAddData(formData);
      setFormData({
        articleCode: "",
        articleLabel: "",
        mostBroughtWeight: "",
        isBilledAsEa: false,
      });
    }
  };

  return (
    <div
      style={{
        padding: "1rem",
        marginBottom: "1rem",
        borderRadius: "6px",
        border: "1px solid #ccc",
      }}
    >
      <h2
        style={{
          marginBottom: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <Plus size={20} />
        Add New Article
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: "1rem",
        }}
      >
        <div>
          <label>Article Code *</label>
          <input
            type="text"
            name="articleCode"
            value={formData.articleCode}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "6px 8px",
              borderRadius: "4px",
              border: errors.articleCode ? "1px solid red" : "1px solid #ccc",
              marginTop: "4px",
            }}
            placeholder="Enter article code"
          />
          {errors.articleCode && (
            <div style={{ color: "red", fontSize: "0.8rem" }}>
              {errors.articleCode}
            </div>
          )}
        </div>
        <div>
          <label>Article Label *</label>
          <input
            type="text"
            name="articleLabel"
            value={formData.articleLabel}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "6px 8px",
              borderRadius: "4px",
              border: errors.articleLabel ? "1px solid red" : "1px solid #ccc",
              marginTop: "4px",
            }}
            placeholder="Enter article label"
          />
          {errors.articleLabel && (
            <div style={{ color: "red", fontSize: "0.8rem" }}>
              {errors.articleLabel}
            </div>
          )}
        </div>
        <div>
          <label>Most Brought Weight</label>
          <select
            name="mostBroughtWeight"
            value={formData.mostBroughtWeight}
            onChange={handleInputChange}
            disabled={formData.isBilledAsEa}
            style={{
              width: "100%",
              padding: "6px 8px",
              borderRadius: "4px",
              border: errors.mostBroughtWeight
                ? "1px solid red"
                : "1px solid #ccc",
              marginTop: "4px",
              backgroundColor: formData.isBilledAsEa ? "#eee" : "white",
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
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginTop: "24px" }}
        >
          <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <input
              type="checkbox"
              name="isBilledAsEa"
              checked={formData.isBilledAsEa}
              onChange={handleInputChange}
            />
            Billed as Each
          </label>
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <button
            onClick={handleSubmit}
            style={{
              padding: "8px 16px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              backgroundColor: "#1976d2",
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Plus size={16} />
            Add Article
          </button>
        </div>
      </div>
    </div>
  );
}
