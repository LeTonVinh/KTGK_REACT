import React, { useState, useEffect } from "react";
import { supabase } from "../DB/supabaseClient";
import "./Product.css";
import { Link } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("hats") // ✅ lấy toàn bộ dữ liệu bảng "hats"
        .select("*");

      if (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      } else {
        setProducts(data);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <p>Đang tải danh sách sản phẩm...</p>;
  }

  return (
    <div className="product-list">
      <h1 className="title">Các Sản Phẩm Nổi Bật</h1>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <Link to={`/sanpham/${product.id}`}>
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
              />
            </Link>
            <h3>{product.name}</h3>
            <p className="price">{product.price.toLocaleString()} VND</p>
            <p className="brand">{product.brand}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
