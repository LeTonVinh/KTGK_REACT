
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
//@ts-ignore
import Contact from "./pages/Contact";
//@ts-ignore
import AdminRoute from "./Auth/AdminRoute";
//@ts-ignore
import AdminDashboard from "./Auth/AdminDashboard";
//@ts-ignore
import Login from "./Auth/Login";
// import Home from "./pages/Home";
export default function App() {
  // return <Home />;
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
        <Route path="/login" element={<Login />} />
          <Route index path="/" element={<Product />} />
          <Route path="/products" element={<Product />} />
          <Route path="/sanpham/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
        />
      </Routes>
    </BrowserRouter>
  );
}

