import React, { useEffect, useState } from "react";
import AddDataForm from "../components/AddDataForm";
import DataTable from "../components/DataTable";
import CopyButton from "../components/CopyButton";

export default function AddDataToJson() {
  const [data, setData] = useState([]);

  const gistRawUrl =
    "https://gist.githubusercontent.com/khayozreaper/b1eaa0ff484d3113864c7cff865d3bc3/raw/articleCodes.json";

  // Fetch data from gist on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(gistRawUrl);
        if (!response.ok) throw new Error("Failed to fetch gist data");
        const json = await response.json();
        setData(json);
        localStorage.setItem("articles", JSON.stringify(json));
      } catch (error) {
        console.error(error);
        // fallback: load from localStorage if available
        const saved = localStorage.getItem("articles");
        if (saved) setData(JSON.parse(saved));
      }
    }
    fetchData();
  }, []);

  // Update state + localStorage helper
  const saveToStorage = (newData) => {
    setData(newData);
    localStorage.setItem("articles", JSON.stringify(newData));
  };

  const handleAddData = (newItem) => {
    const nextId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
    const newData = [...data, { ...newItem, id: nextId }];
    saveToStorage(newData);
  };

  const handleUpdate = (updatedItem) => {
    const newData = data.map((item) =>
      item.id === updatedItem.id ? updatedItem : item,
    );
    saveToStorage(newData);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const newData = data.filter((item) => item.id !== id);
      saveToStorage(newData);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "1rem" }}>
      <AddDataForm onAddData={handleAddData} existingData={data} />

      {/* CopyButton always visible with latest data */}
      <CopyButton data={data} />

      <input
        type="text"
        placeholder="Search by code or label..."
        onChange={(e) => {
          const term = e.target.value.toLowerCase();
          setData((oldData) =>
            oldData.filter(
              (item) =>
                item.articleCode.toLowerCase().includes(term) ||
                item.articleLabel.toLowerCase().includes(term),
            ),
          );
        }}
        style={{ marginBottom: 16, padding: 8, width: "100%" }}
      />

      <table
        style={{ width: "100%", borderCollapse: "collapse", marginBottom: 32 }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>ID</th>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>
              Article Code
            </th>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>
              Article Label
            </th>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>
              Most Brought Weight
            </th>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>
              Billed as Each
            </th>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <DataTable
          data={data}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </table>
    </div>
  );
}
