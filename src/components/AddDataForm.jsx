import React, { useState, useEffect } from "react";

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

export default function AddDataForm({
  selectedSource,
  existingData,
  onAddData,
}) {
  const initialForm =
    selectedSource === "jiomartqcc"
      ? { articleCode: "", articleLabel: "", upcCode: "", isBilledAsEa: true }
      : {
          articleCode: "",
          articleLabel: "",
          mostBroughtWeight: "",
          isBilledAsEa: false,
        };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(initialForm);
    setErrors({});
  }, [selectedSource]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "isBilledAsEa" && selectedSource === "jiomartqcc") {
      // Prevent change for jiomartqcc source
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      // If isBilledAsEa changed to true, reset mostBroughtWeight
      ...(name === "isBilledAsEa" && checked ? { mostBroughtWeight: "" } : {}),
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    // Article Code: required and exactly 9 digits
    if (!formData.articleCode.trim()) {
      newErrors.articleCode = "Article Code is required";
    } else if (!/^\d{9}$/.test(formData.articleCode.trim())) {
      newErrors.articleCode = "Article Code must be exactly 9 digits";
    }

    // Article Label: required
    if (!formData.articleLabel.trim()) {
      newErrors.articleLabel = "Article Label is required";
    }

    if (selectedSource === "jiomartqcc") {
      // UPC Code: required and numeric
      if (!formData.upcCode.trim()) {
        newErrors.upcCode = "UPC Code is required";
      } else if (!/^\d+$/.test(formData.upcCode.trim())) {
        newErrors.upcCode = "UPC Code must be numeric";
      }
    } else {
      // If billed as weight, validate weight
      if (!formData.isBilledAsEa) {
        if (!formData.mostBroughtWeight) {
          newErrors.mostBroughtWeight = "Most Brought Weight is required";
        } else if (
          !weightOptions.find((opt) => opt.value === formData.mostBroughtWeight)
        ) {
          newErrors.mostBroughtWeight = "Invalid weight selected";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const newId =
      existingData && existingData.length
        ? Math.max(...existingData.map((item) => item.id)) + 1
        : Math.floor(Math.random() * 1000000) + 1; // fallback random id

    const newEntry = {
      id: newId,
      articleCode: formData.articleCode.trim(),
      articleLabel: formData.articleLabel.trim(),
      isBilledAsEa:
        selectedSource === "jiomartqcc" ? true : formData.isBilledAsEa,
    };

    if (selectedSource === "jiomartqcc") {
      newEntry.upcCode = formData.upcCode.trim();
    } else {
      // Only add weight if billed as weight
      if (!newEntry.isBilledAsEa) {
        const weightObj = weightOptions.find(
          (opt) => opt.value === formData.mostBroughtWeight,
        );
        newEntry.mostBroughtWeight = weightObj ? weightObj.label : "";
      }
    }

    onAddData(newEntry);

    setFormData(initialForm);
    setErrors({});
  };

  return (
    <div className="max-w-md rounded-md border border-gray-300 p-4">
      <h2 className="mb-4 text-xl font-semibold">Add New Article</h2>

      {/* Article Code */}
      <div className="mb-4">
        <label className="mb-1 block">Article Code *</label>
        <input
          type="text"
          name="articleCode"
          value={formData.articleCode}
          onChange={handleChange}
          maxLength={9}
          className={`w-full rounded border p-2 ${
            errors.articleCode ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="9-digit Article Code"
        />
        {errors.articleCode && (
          <p className="mt-1 text-sm text-red-500">{errors.articleCode}</p>
        )}
      </div>

      {/* Article Label */}
      <div className="mb-4">
        <label className="mb-1 block">Article Label *</label>
        <input
          type="text"
          name="articleLabel"
          value={formData.articleLabel}
          onChange={handleChange}
          className={`w-full rounded border p-2 ${
            errors.articleLabel ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter Article Label"
        />
        {errors.articleLabel && (
          <p className="mt-1 text-sm text-red-500">{errors.articleLabel}</p>
        )}
      </div>

      {/* Conditional Fields */}
      {selectedSource === "jiomartqcc" ? (
        <>
          {/* UPC Code */}
          <div className="mb-4">
            <label className="mb-1 block">UPC Code *</label>
            <input
              type="text"
              name="upcCode"
              value={formData.upcCode}
              onChange={handleChange}
              className={`w-full rounded border p-2 ${
                errors.upcCode ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter UPC Code"
            />
            {errors.upcCode && (
              <p className="mt-1 text-sm text-red-500">{errors.upcCode}</p>
            )}
          </div>

          {/* isBilledAsEa - fixed true and disabled */}
          <div className="mb-4">
            <label className="inline-flex cursor-not-allowed items-center">
              <input
                type="checkbox"
                name="isBilledAsEa"
                checked={true}
                disabled
                className="mr-2 cursor-not-allowed"
              />
              Billed as Each (Always True)
            </label>
          </div>
        </>
      ) : (
        <>
          {/* Most Brought Weight dropdown */}
          <div className="mb-4">
            <label className="mb-1 block">Most Brought Weight *</label>
            <select
              name="mostBroughtWeight"
              value={formData.mostBroughtWeight}
              onChange={handleChange}
              disabled={formData.isBilledAsEa} // disable if billed as each
              className={`w-full rounded border p-2 ${
                errors.mostBroughtWeight && !formData.isBilledAsEa
                  ? "border-red-500"
                  : "border-gray-300"
              } ${formData.isBilledAsEa ? "cursor-not-allowed bg-gray-200" : ""}`}
            >
              <option value="">Select Weight</option>
              {weightOptions.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {errors.mostBroughtWeight && !formData.isBilledAsEa && (
              <p className="mt-1 text-sm text-red-500">
                {errors.mostBroughtWeight}
              </p>
            )}
          </div>

          {/* isBilledAsEa checkbox editable */}
          <div className="mb-4">
            <label className="inline-flex cursor-pointer select-none items-center">
              <input
                type="checkbox"
                name="isBilledAsEa"
                checked={formData.isBilledAsEa}
                onChange={handleChange}
                className="mr-2 cursor-pointer"
              />
              Billed as Each
            </label>
          </div>
        </>
      )}

      <button
        onClick={handleSubmit}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        type="button"
      >
        Add Article
      </button>
    </div>
  );
}
