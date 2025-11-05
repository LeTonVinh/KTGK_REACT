import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../DB/supabaseClient";
import "./Product.css";

const Product = () => {
  const { id } = useParams(); // lấy id từ URL /sanpham/:id
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("hats")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } else {
        setProduct(data);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <p>Đang tải dữ liệu...</p>;
  }

  return (
    <div className="product">
      <h1>{product.name}</h1>
      <img
        src={product.image}
        alt={product.name}
        className="product-image"
        style={{ width: "300px", borderRadius: "12px" }}
      />
      <p><strong>Giá:</strong> {product.price.toLocaleString()} VND</p>
      <p><strong>Thương hiệu:</strong> {product.brand}</p>
      <p><strong>Chất liệu:</strong> {product.material}</p>
      <p><strong>Kiểu dáng:</strong> {product.style}</p>
      <p><strong>Giới tính:</strong> {product.gender}</p>
      <p><strong>Kích cỡ:</strong> {product.size}</p>
      <p><strong>Ghi chú:</strong> {product.note}</p>
    </div>
  );
};

export default Product;


