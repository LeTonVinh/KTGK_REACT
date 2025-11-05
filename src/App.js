
//@ts-ignore
import Layout from "./layout/Layout";
//@ts-ignore
import { BrowserRouter, Routes, Route } from "react-router-dom";
//@ts-ignore
import Product from "./pages/Product";
//@ts-ignore
import ProductDetail from "./pages/ProductDetail";
//@ts-ignore
import About from "./pages/About";
export default function App() {
  // return <Home />;
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index path="/" element={<Product />} />
          <Route path="/products" element={<Product />} />
          <Route path="/sanpham/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

