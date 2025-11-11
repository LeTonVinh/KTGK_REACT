// Cart.jsx
import { useEffect, useState } from "react";
import { supabase } from "../DB/supabaseClient";
import "./Cart.css";

export default function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("carts")
      .select("id, quantity, hats(name, price, image)")
      .eq("user_id", user.id);

    if (error) console.error(error);
    else setItems(data);
    setLoading(false);
  }

 async function checkout() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return alert("Vui lòng đăng nhập.");

  // Lấy cart
  const { data: cartItems, error: cartErr } = await supabase
    .from("carts")
    .select("product_id, quantity, hats(name, price)")
    .eq("user_id", user.id);

  if (cartErr || !cartItems?.length) {
    console.error(cartErr);
    return alert("Giỏ hàng trống hoặc lỗi khi lấy giỏ.");
  }

  // Tính tổng tiền
  const total = cartItems.reduce((sum, it) => sum + it.quantity * it.hats.price, 0);

  // Tạo order
  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .insert([{ user_id: user.id, total, status: "pending" }])
    .select()
    .single();

  if (orderErr) {
    console.error(orderErr);
    return alert("Lỗi tạo đơn: " + orderErr.message);
  }

  // Tạo order_items
  const orderItemsData = cartItems.map(it => ({
    order_id: order.id,
    product_id: it.product_id,
    quantity: it.quantity,
    unit_price: it.hats.price,
  }));

  const { error: itemsErr } = await supabase
    .from("order_items")
    .insert(orderItemsData);

  if (itemsErr) {
    console.error(itemsErr);
    return alert("Lỗi tạo order items: " + itemsErr.message);
  }

  // Xóa cart
  const { error: delErr } = await supabase
    .from("carts")
    .delete()
    .eq("user_id", user.id);

  if (delErr) console.error(delErr);

  alert("Đặt hàng thành công!");
  setItems([]);
}


  if (loading) return <p>Đang tải...</p>;

  const total = items.reduce(
    (sum, it) => sum + it.quantity * it.hats.price,
    0
  );

  return (
    <div className="cart-container">
      <h2>Giỏ hàng</h2>
      {items.length === 0 ? (
        <p>Giỏ hàng trống.</p>
      ) : (
        <div>
          {items.map((it) => (
            <div key={it.id} className="cart-item">
              <img src={it.hats.image} alt={it.hats.name} />
              <div>
                <p>{it.hats.name}</p>
                <p>{it.quantity} x {it.hats.price}₫</p>
              </div>
            </div>
          ))}
          <hr />
          <h3>Tổng: {total}₫</h3>
          <button onClick={checkout}>Thanh toán</button>
        </div>
      )}
    </div>
  );
}
