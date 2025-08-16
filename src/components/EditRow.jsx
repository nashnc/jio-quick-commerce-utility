import React, { useState } from "react";

const weightOptions = [
  { value: "010150", label: "1 kg" },
  { value: "020150", label: "2 kg" },
  { value: "007810", label: "750 gm" },
  { value: "005150", label: "500 gm" },
  { value: "002710", label: "250 gm" },
  { value: "002150", label: "200 gm" },
  { value: "015150", label: "150 gm" },
  { value: "001150", label: "100 gm" },
];

export default function EditRow({
  item,
  existingData,
  onSave,
  onCancel,
  selectedSource,
}) {
  const [formData, setFormData] = useState({ ...item });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "isBilledAsEa" && checked ? { mostBroughtWeight: "" } : {}),
    }));
    delete errors[name];
  };

  const validate = () => {
    const errs = {};
    if (!formData.articleCode.trim()) errs.articleCode = "Required";
    else if (!/^\d{9}$/.test(formData.articleCode.trim()))
      errs.articleCode = "Must be exactly 9 digits";

    if (!formData.articleLabel.trim()) errs.articleLabel = "Required";

    if (selectedSource !== "jiomartqcc" && !formData.isBilledAsEa) {
      if (!formData.mostBroughtWeight) errs.mostBroughtWeight = "Required";
      else if (
        !weightOptions.some((o) => o.value === formData.mostBroughtWeight)
      )
        errs.mostBroughtWeight = "Invalid";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  return (
    <tr>
      <td style={{ border: "1px solid #ddd", padding: 8 }}>{item.id}</td>
      <td style={{ border: "1px solid #ddd", padding: 8 }}>
        <input
          type="text"
          name="articleCode"
          value={formData.articleCode}
          onChange={handleChange}
          maxLength={9}
          style={{
            width: "100%",
            borderColor: errors.articleCode ? "red" : "#ccc",
          }}
        />
        {errors.articleCode && (
          <div style={{ color: "red" }}>{errors.articleCode}</div>
        )}
      </td>
      <td style={{ border: "1px solid #ddd", padding: 8 }}>
        <input
          name="articleLabel"
          value={formData.articleLabel}
          onChange={handleChange}
          style={{
            width: "100%",
            borderColor: errors.articleLabel ? "red" : "#ccc",
          }}
        />
        {errors.articleLabel && (
          <div style={{ color: "red" }}>{errors.articleLabel}</div>
        )}
      </td>
      {selectedSource === "articleCodes" ? (
        <td style={{ border: "1px solid #ddd", padding: 8 }}>
          <select
            name="mostBroughtWeight"
            value={formData.mostBroughtWeight}
            onChange={handleChange}
            disabled={formData.isBilledAsEa}
            style={{
              background: formData.isBilledAsEa ? "#eee" : "#fff",
              borderColor: errors.mostBroughtWeight ? "red" : "#ccc",
            }}
          >
            <option value="">Select Weight</option>
            {weightOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.mostBroughtWeight && (
            <div style={{ color: "red" }}>{errors.mostBroughtWeight}</div>
          )}
        </td>
      ) : (
        <td style={{ border: "1px solid #ddd", padding: 8 }}>—</td>
      )}
      {selectedSource === "jiomartqcc" ? (
        <td style={{ border: "1px solid #ddd", padding: 8 }}>
          <input
            name="upcCode"
            value={formData.upcCode || ""}
            onChange={handleChange}
          />
        </td>
      ) : (
        <td style={{ border: "1px solid #ddd", padding: 8 }} />
      )}
      <td style={{ border: "1px solid #ddd", padding: 8, textAlign: "center" }}>
        <input
          type="checkbox"
          name="isBilledAsEa"
          checked={formData.isBilledAsEa}
          onChange={handleChange}
        />
      </td>
      <td style={{ border: "1px solid #ddd", padding: 8 }}>
        <button onClick={() => validate() && onSave(formData)}>Save</button>
        <button onClick={onCancel} style={{ marginLeft: 8 }}>
          Cancel
        </button>
      </td>
    </tr>
  );
}
