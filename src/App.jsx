import { useState } from "react";
import "./App.css";
import BarCodeGenerate from "./barCodeGenerate";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <>
        <BarCodeGenerate />
      </>
    </>
  );
}

export default App;
