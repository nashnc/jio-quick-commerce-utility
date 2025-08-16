import React, { useEffect, useState } from "react";

const ProductSearchInput = ({ onSelect, gistRawBaseUrl, placeHolder }) => {
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

    const filteredResults = productList
      .filter((item) =>
        item.articleCode?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .map((item) => ({
        ...item,
        displayLabel: `${item.articleCode} → ${item.upcCode}`,
      }));

    setFiltered(filteredResults);
    setShowDropdown(true);
  }, [searchTerm, productList]);

  const handleSelect = (item) => {
    setSearchTerm(item.displayLabel);
    setShowDropdown(false);
    onSelect(item.upcCode); // Pass UPC instead of article code
  };

  const handleDoubleClick = () => {
    setSearchTerm("");
    setFiltered([]);
    setShowDropdown(false);
  };

  return (
    <div className="relative mx-auto mt-4 w-full max-w-md">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onDoubleClick={handleDoubleClick}
        placeholder={placeHolder}
        className="w-full rounded border px-3 py-2 shadow"
      />
      {showDropdown && filtered.length > 0 && (
        <ul className="absolute z-10 max-h-60 w-full overflow-y-auto rounded border shadow-md">
          {filtered.map((item) => (
            <li
              key={item.articleCode}
              onClick={() => handleSelect(item)}
              className="cursor-pointer px-3 py-1"
            >
              {item.displayLabel}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductSearchInput;
