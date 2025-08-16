import React, { useEffect, useState } from "react";
import AddDataForm from "../components/AddDataForm";
import EditRow from "../components/EditRow";
import CopyButton from "../components/CopyButton";

// Weight options (used for display mapping)
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

// Helper to convert code or raw value to display label
const getWeightLabel = (value) => {
  if (!value) return "-";
  // If already a human-readable weight, return it
  if (/^\d+\s?(gm|kg)$/i.test(value.trim())) return value;
  // Else, map code to label
  return weightOptions.find((opt) => opt.value === value)?.label || value;
};

export default function AddDataToJson() {
  const articleCodesUrl =
    "https://gist.githubusercontent.com/khayozreaper/b1eaa0ff484d3113864c7cff865d3bc3/raw/articleCodes.json";
  const jiomartqccUrl =
    "https://gist.githubusercontent.com/khayozreaper/db87a671f23c45a6443df222208bb71b/raw/jiomartqcc.json";

  const [selectedSource, setSelectedSource] = useState(
    () => localStorage.getItem("selectedSource") || "articleCodes",
  );
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [editItem, setEditItem] = useState(null);

  const currentUrl =
    selectedSource === "articleCodes" ? articleCodesUrl : jiomartqccUrl;

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(currentUrl);
        if (!response.ok) throw new Error("Failed to fetch data");
        const json = await response.json();
        setData(json);
        setFilteredData(json);
        localStorage.setItem("articles", JSON.stringify(json));
      } catch {
        const saved = localStorage.getItem("articles");
        if (saved) {
          const json = JSON.parse(saved);
          setData(json);
          setFilteredData(json);
        }
      }
    }
    fetchData();
    localStorage.setItem("selectedSource", selectedSource);
  }, [selectedSource, currentUrl]);

  const saveToStorage = (newList) => {
    setData(newList);
    setFilteredData(newList);
    localStorage.setItem("articles", JSON.stringify(newList));
  };

  const handleAddData = (newItem) => {
    const nextId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
    saveToStorage([...data, { ...newItem, id: nextId }]);
  };

  const handleUpdate = (updatedItem) => {
    const newList = data.map((item) =>
      item.id === updatedItem.id ? updatedItem : item,
    );
    saveToStorage(newList);
    setEditItem(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this item?")) {
      saveToStorage(data.filter((item) => item.id !== id));
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    if (!term) return setFilteredData(data);
    setFilteredData(
      data.filter(
        (item) =>
          item.articleCode?.toLowerCase().includes(term) ||
          item.articleLabel?.toLowerCase().includes(term),
      ),
    );
  };

  const handleToggle = () =>
    setSelectedSource((prev) =>
      prev === "articleCodes" ? "jiomartqcc" : "articleCodes",
    );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "1rem" }}>
      <button
        onClick={handleToggle}
        style={{
          marginBottom: 16,
          padding: "8px 16px",
          background: "#4caf50",
          color: "#fff",
        }}
      >
        {selectedSource === "articleCodes"
          ? "Switch to Jiomartqcc JSON"
          : "Switch to ArticleCodes JSON"}
      </button>

      <AddDataForm
        onAddData={handleAddData}
        existingData={data}
        selectedSource={selectedSource}
      />

      <CopyButton data={data} />

      <input
        type="text"
        placeholder="Search by code or label..."
        onChange={handleSearch}
        style={{ margin: "1rem 0", padding: 8, width: "100%" }}
      />

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["ID", "Article Code", "Article Label"].map((header) => (
              <th key={header} style={{ border: "1px solid #ddd", padding: 8 }}>
                {header}
              </th>
            ))}
            {selectedSource === "articleCodes" && (
              <th style={{ border: "1px solid #ddd", padding: 8 }}>
                Most Brought Weight
              </th>
            )}
            {selectedSource === "jiomartqcc" && (
              <th style={{ border: "1px solid #ddd", padding: 8 }}>UPC Code</th>
            )}
            <th style={{ border: "1px solid #ddd", padding: 8 }}>
              Billed as Each
            </th>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) =>
            editItem?.id === item.id ? (
              <EditRow
                key={item.id}
                item={item}
                existingData={data}
                onSave={handleUpdate}
                onCancel={() => setEditItem(null)}
                selectedSource={selectedSource}
              />
            ) : (
              <tr key={item.id}>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>
                  {item.id}
                </td>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>
                  {item.articleCode}
                </td>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>
                  {item.articleLabel}
                </td>
                {selectedSource === "articleCodes" && (
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>
                    {getWeightLabel(item.mostBroughtWeight)}
                  </td>
                )}
                {selectedSource === "jiomartqcc" && (
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>
                    {item.upcCode || "-"}
                  </td>
                )}
                <td style={{ border: "1px solid #ddd", padding: 8 }}>
                  {item.isBilledAsEa ? "Yes" : "No"}
                </td>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>
                  <button
                    onClick={() => setEditItem(item)}
                    style={{ marginRight: 8 }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}
