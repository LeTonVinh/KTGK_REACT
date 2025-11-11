import { useEffect, useState } from "react";
import { supabase } from "../DB/supabaseClient";
import "./Order.css";
export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("orders")
      .select("id, total, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) setOrders(data);
  }

  return (
    <div className="cart-container">
      <h2>Đơn hàng của bạn</h2>
      {orders.length === 0 ? (
        <p>Chưa có đơn hàng nào.</p>
      ) : (
        orders.map(o => (
          <div key={o.id} className="cart-item">
            <div>
              <p>Mã đơn: {o.id}</p>
              <p>Trạng thái: {o.status}</p>
              <p>Tổng: {o.total}₫</p>
              <p>Ngày: {new Date(o.created_at).toLocaleString()}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
