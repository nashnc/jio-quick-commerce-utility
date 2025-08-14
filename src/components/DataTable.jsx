import React, { useState } from "react";
import EditRow from "./EditRow";

export default function DataTable({ data, onUpdate, onDelete }) {
  const [editId, setEditId] = useState(null);

  const handleEditClick = (id) => setEditId(id);
  const handleCancel = () => setEditId(null);
  const handleSave = (updatedItem) => {
    onUpdate(updatedItem);
    setEditId(null);
  };

  const renderRow = (item) => {
    if (editId === item.id) {
      return (
        <EditRow
          key={item.id}
          item={item}
          onSave={handleSave}
          onCancel={handleCancel}
          existingData={data}
        />
      );
    }
    return (
      <tr key={item.id}>
        <td style={{ padding: "6px 8px", border: "1px solid #ddd" }}>
          {item.id}
        </td>
        <td style={{ padding: "6px 8px", border: "1px solid #ddd" }}>
          {item.articleCode}
        </td>
        <td style={{ padding: "6px 8px", border: "1px solid #ddd" }}>
          {item.articleLabel}
        </td>
        <td style={{ padding: "6px 8px", border: "1px solid #ddd" }}>
          {item.mostBroughtWeight}
        </td>
        <td
          style={{
            padding: "6px 8px",
            border: "1px solid #ddd",
            textAlign: "center",
          }}
        >
          <input type="checkbox" checked={item.isBilledAsEa} readOnly />
        </td>
        <td style={{ padding: "6px 8px", border: "1px solid #ddd" }}>
          <button
            onClick={() => handleEditClick(item.id)}
            style={{ marginRight: "8px" }}
          >
            Edit
          </button>
          <button onClick={() => onDelete(item.id)}>Delete</button>
        </td>
      </tr>
    );
  };

  if (data.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={6} style={{ textAlign: "center", padding: "1rem" }}>
            No data found.
          </td>
        </tr>
      </tbody>
    );
  }

  return <tbody>{data.map(renderRow)}</tbody>;
}
