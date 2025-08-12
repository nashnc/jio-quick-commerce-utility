import React, { useEffect, useState } from "react";
import AddDataForm from "../components/AddDataForm";
import DataTable from "../components/DataTable";
import CopyButton from "../components/CopyButton";
import articleCodes from "../json/articleCodes.json";

export default function AddDataToJson() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Clear storage on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("articles");
      // or sessionStorage.removeItem("articles") if using sessionStorage
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Load fresh data on page load after clearing storage
  useEffect(() => {
    localStorage.removeItem("articles"); // clear on load
    setData(articleCodes);
    localStorage.setItem("articles", JSON.stringify(articleCodes));
  }, []);

  const saveToStorage = (newData) => {
    setData(newData);
    localStorage.setItem("articles", JSON.stringify(newData));
  };

  const handleAddData = (newItem) => {
    const nextId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
    const itemToAdd = { ...newItem, id: nextId };
    saveToStorage([...data, itemToAdd]);
  };

  const handleUpdate = (updatedItem) => {
    const updatedData = data.map((item) =>
      item.id === updatedItem.id ? updatedItem : item,
    );
    saveToStorage(updatedData);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?",
    );
    if (confirmDelete) {
      const filtered = data.filter((item) => item.id !== id);
      saveToStorage(filtered);
    }
  };

  const filteredData = data.filter(
    (item) =>
      item.articleCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.articleLabel.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "1rem" }}>
      <AddDataForm onAddData={handleAddData} existingData={data} />
      <CopyButton data={data} />

      <input
        type="text"
        placeholder="Search by code or label..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          marginBottom: "1rem",
          padding: "8px",
          width: "100%",
          boxSizing: "border-box",
        }}
      />

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "2rem",
        }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>ID</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Article Code
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Article Label
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Most Brought Weight
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Billed as Each
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Actions
            </th>
          </tr>
        </thead>
        <DataTable
          data={filteredData}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </table>
    </div>
  );
}
