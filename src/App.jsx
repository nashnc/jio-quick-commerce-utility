import "./App.css";
import BarCodeGenerate from "./pages/BarCodeGenerate";
import AddDataToJson from "./pages/AddDataToJson";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <BarCodeGenerate />,
    },
    {
      path: "/add",
      element: <AddDataToJson />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
