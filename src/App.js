
//@ts-ignore
import Layout from "./layout/Layout";
//@ts-ignore
import { BrowserRouter, Routes, Route } from "react-router-dom";
//@ts-ignore
import Product from "./pages/Product";
export default function App() {
  // return <Home />;
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index path="/" element={<Product />} />
  
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


