// src/pages/AdminDashboard.js
import React, { useState, useEffect } from "react";
import { supabase } from "../DB/supabaseClient";
import "./Admin.css";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    brand: "",
    material: "",
    style: "",
    gender: "",
    size: "",
    note: "",
  });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("hats").select("*").order("id");
    if (error) console.error(error);
    else setProducts(data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) {
      const { error } = await supabase.from("hats").delete().eq("id", id);
      if (!error) fetchProducts();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return;

    if (editing) {
      await supabase.from("hats").update(form).eq("id", editing);
    } else {
      await supabase.from("hats").insert([form]);
    }

    setForm({
      name: "",
      price: "",
      image: "",
      brand: "",
      material: "",
      style: "",
      gender: "",
      size: "",
      note: "",
    });
    setEditing(null);
    fetchProducts();
  };

  const handleEdit = (item) => {
    setEditing(item.id);
    setForm({
      name: item.name || "",
      price: item.price || "",
      image: item.image || "",
      brand: item.brand || "",
      material: item.material || "",
      style: item.style || "",
      gender: item.gender || "",
      size: item.size || "",
      note: item.note || "",
    });
  };

  return (
    <div className="admin-container">
      <h2>Quản lý sản phẩm</h2>

      <form className="admin-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên sản phẩm"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Giá"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Link ảnh (có thể nhiều, cách nhau bằng ,)"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />
        <input
          type="text"
          placeholder="Thương hiệu"
          value={form.brand}
          onChange={(e) => setForm({ ...form, brand: e.target.value })}
        />
        <input
          type="text"
          placeholder="Chất liệu"
          value={form.material}
          onChange={(e) => setForm({ ...form, material: e.target.value })}
        />
        <input
          type="text"
          placeholder="Kiểu dáng"
          value={form.style}
          onChange={(e) => setForm({ ...form, style: e.target.value })}
        />
        <input
          type="text"
          placeholder="Giới tính"
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
        />
        <input
          type="text"
          placeholder="Kích cỡ"
          value={form.size}
          onChange={(e) => setForm({ ...form, size: e.target.value })}
        />
        <textarea
          placeholder="Ghi chú / mô tả"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
        />
        <button type="submit">{editing ? "Cập nhật" : "Thêm mới"}</button>
      </form>

      {loading ? (
        <p>Đang tải sản phẩm...</p>
      ) : (
        <div className="admin-grid">
          {products.map((item) => (
            <div className="admin-card" key={item.id}>
              {item.image && (
                <img
                  src={Array.isArray(item.image) ? item.image[0] : item.image}
                  alt={item.name}
                  style={{ width: "100%", height: 120, objectFit: "cover" }}
                />
              )}
              <h4>{item.name}</h4>
              <p>Giá: {item.price.toLocaleString()} VND</p>
              <p>Thương hiệu: {item.brand || "—"}</p>
              <p>Chất liệu: {item.material || "—"}</p>
              <p>Kiểu dáng: {item.style || "—"}</p>
              <p>Giới tính: {item.gender || "—"}</p>
              <p>Kích cỡ: {item.size || "—"}</p>
              <p>Mô tả: {item.note || "—"}</p>
              <div className="actions">
                <button onClick={() => handleEdit(item)}>Sửa</button>
                <button onClick={() => handleDelete(item.id)}>Xóa</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
