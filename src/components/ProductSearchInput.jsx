// components/ProductSearchInput.jsx
import React, { useEffect, useState } from "react";

const gistRawBaseUrl =
  "https://gist.githubusercontent.com/khayozreaper/b1eaa0ff484d3113864c7cff865d3bc3/raw/articleCodes.json";

const ProductSearchInput = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [productList, setProductList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const url = `${gistRawBaseUrl}?cache_bust=${Date.now()}`;
        const res = await fetch(url);
        const data = await res.json();
        setProductList(data);
      } catch (err) {
        console.error("Failed to fetch product list", err);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFiltered([]);
      setShowDropdown(false);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filteredResults = productList
      .filter(
        (item) =>
          item.articleLabel?.toLowerCase().includes(term) ||
          item.mostBroughtWeight?.toLowerCase().includes(term),
      )
      .map((item) => ({
        ...item,
        displayLabel: `${item.articleLabel} - ${item.mostBroughtWeight}`,
      }));

    setFiltered(filteredResults);
    setShowDropdown(true);
  }, [searchTerm, productList]);

  const handleSelect = (item) => {
    setSearchTerm(item.displayLabel);
    setShowDropdown(false);
    onSelect(item.articleCode); // Pass articleCode back
  };

  return (
    <div className="relative mx-auto mt-4 w-full max-w-md">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search... wont work yet"
        className="w-full rounded border px-3 py-2 shadow"
      />
      {showDropdown && filtered.length > 0 && (
        <ul className="absolute z-10 max-h-60 w-full overflow-y-auto rounded border shadow-md">
          {filtered.map((item) => (
            <li key={item.articleCode} onClick={() => handleSelect(item)}>
              {item.displayLabel}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductSearchInput;
