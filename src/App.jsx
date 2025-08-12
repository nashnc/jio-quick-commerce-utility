import "./App.css";
import BarCodeGenerate from "./pages/BarCodeGenerate";
import AddDataToJson from "./pages/AddDataToJson";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {
  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <BarCodeGenerate />,
      },
      {
        path: "/add",
        element: <AddDataToJson />,
      },
    ],
    {
      basename: "/jio-quick-commerce-utility",
    },
  );

  return <RouterProvider router={router} />;
}

export default App;
