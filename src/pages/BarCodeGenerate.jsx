import React, { useState, useEffect } from "react";
import BarcodeDisplay from "../components/BarcodeDisplay";
import ArticleCodeInput from "../components/ArticleCodeInput";

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

const gistRawBaseUrl =
  "https://gist.githubusercontent.com/khayozreaper/b1eaa0ff484d3113864c7cff865d3bc3/raw/articleCodes.json";

const BarCodeGenerate = () => {
  const [articleCodes, setArticleCodes] = useState([]);
  const [articleCode, setArticleCode] = useState("");
  const [weight, setWeight] = useState(weightOptions[0].value);
  const [useDefaultPrefix, setUseDefaultPrefix] = useState(true);
  const [articleLabel, setArticleLabel] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const DEFAULT_CODE = `2110000590003515010150`;

  useEffect(() => {
    async function fetchArticleCodes() {
      setLoading(true);
      try {
        // Cache bust param to ensure fresh fetch every page load
        const url = `${gistRawBaseUrl}?cache_bust=${Date.now()}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch article codes");
        const json = await response.json();
        setArticleCodes(json);
        setError(null);
      } catch (err) {
        setError(err.message);
        setArticleCodes([]);
      } finally {
        setLoading(false);
      }
    }

    fetchArticleCodes();
  }, []); // Runs only once on mount (page load)

  useEffect(() => {
    if (!articleCode) {
      setArticleLabel("");
      setUseDefaultPrefix(true);
      return;
    }

    const matchedArticle = articleCodes.find(
      (art) => art.articleCode === articleCode,
    );

    if (matchedArticle) {
      setArticleLabel(matchedArticle.articleLabel || "");

      if (matchedArticle.isBilledAsEa) {
        setUseDefaultPrefix(false);
      } else {
        setUseDefaultPrefix(true);
      }

      if (
        matchedArticle.mostBroughtWeight &&
        matchedArticle.mostBroughtWeight.trim() !== ""
      ) {
        const matchedWeightOption = weightOptions.find(
          (opt) => opt.label === matchedArticle.mostBroughtWeight,
        );
        if (matchedWeightOption) {
          setWeight(matchedWeightOption.value);
        }
      }
    } else {
      setArticleLabel("");
      setUseDefaultPrefix(true);
    }
  }, [articleCode, articleCodes]);

  const finalCode =
    articleCode.trim().length === 0
      ? DEFAULT_CODE
      : useDefaultPrefix
        ? `2110000${articleCode}${weight}`
        : articleCode;

  return (
    <div className="container px-4 pt-[10%]">
      <header className="flex items-center justify-center pb-4">
        <h1>Barcode Generator</h1>
      </header>

      {loading && <p>Loading article codes...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <div className="mb-6 flex items-center justify-center gap-2">
        <input
          type="checkbox"
          id="prefixToggle"
          checked={useDefaultPrefix}
          readOnly
        />
        <label htmlFor="prefixToggle">
          Use 2110000 + weight for code generation
        </label>
      </div>

      <section>
        <div
          className={`mb-4 flex flex-col items-center ${
            useDefaultPrefix ? "justify-between" : "justify-center"
          } gap-3 sm:flex-row`}
        >
          {useDefaultPrefix && <p>2110000</p>}

          <ArticleCodeInput value={articleCode} onChange={setArticleCode} />

          {useDefaultPrefix && (
            <select
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="rounded-md border border-[rgba(0,0,0,0.5)] p-1 text-green-950"
            >
              {weightOptions.map((option) => (
                <option
                  key={option.value}
                  className="text-green-900"
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </section>

      <BarcodeDisplay
        finalCode={finalCode}
        DEFAULT_CODE={DEFAULT_CODE}
        articleLabel={articleLabel}
      />
    </div>
  );
};

export default BarCodeGenerate;
