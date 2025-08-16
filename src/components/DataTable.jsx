// DataTable.jsx
// Minor update to conditionally show fields based on selectedSource

export default function DataTable({
  data,
  onUpdate,
  onDelete,
  selectedSource,
}) {
  return (
    <tbody>
      {data.map((item) => (
        <tr key={item.id}>
          <td style={{ border: "1px solid #ddd", padding: 8 }}>{item.id}</td>
          <td style={{ border: "1px solid #ddd", padding: 8 }}>
            {item.articleCode}
          </td>
          <td style={{ border: "1px solid #ddd", padding: 8 }}>
            {item.articleLabel}
          </td>
          {selectedSource === "articleCodes" && (
            <td style={{ border: "1px solid #ddd", padding: 8 }}>
              {item.mostBroughtWeight || "-"}
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
              onClick={() => onUpdate(item)}
              style={{ marginRight: 8, cursor: "pointer" }}
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(item.id)}
              style={{ cursor: "pointer" }}
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  );
}
