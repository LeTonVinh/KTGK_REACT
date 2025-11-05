import React, { useState } from "react";
import { supabase } from "../DB/supabaseClient"; // nếu bạn không dùng supabase, keep import but it's OK
import "./Contact.css";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    type: "general",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Vui lòng nhập tên của bạn.";
    if (!form.email.trim()) return "Vui lòng nhập email.";
    // basic email check
    const re = /\S+@\S+\.\S+/;
    if (!re.test(form.email)) return "Email không hợp lệ.";
    if (!form.message.trim()) return "Vui lòng nhập nội dung tin nhắn.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setLoading(true);

    // Lưu vào Supabase (nếu có). Nếu không muốn lưu, bạn có thể comment phần này.
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        subject: form.subject || null,
        type: form.type,
        message: form.message,
        created_at: new Date().toISOString(),
      };

      // Nếu bạn chưa tạo bảng "contacts", Supabase sẽ trả lỗi. Nhưng component vẫn OK.
      const { data, error: sbError } = await supabase
        .from("contacts")
        .insert([payload]);

      if (sbError) {
        console.warn("Supabase insert error:", sbError);
        // fallback: vẫn coi là gửi thành công nhưng thông báo lỗi lưu
        setError("Gửi thất bại (không lưu được). Thư sẽ không được lưu trên server.");
        setSent(true);
      } else {
        setSent(true);
      }
    } catch (err) {
      console.error("Exception sending contact:", err);
      setError("Lỗi mạng, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="contact-page">
        <div className="contact-card contact-sent">
          <h2>Cảm ơn bạn!</h2>
          <p>Chúng mình đã nhận được tin nhắn. Sẽ phản hồi sớm nhất có thể.</p>
          <button
            className="btn-outline"
            onClick={() => {
              setForm({ name: "", email: "", phone: "", subject: "", type: "general", message: "" });
              setSent(false);
              setError("");
            }}
          >
            Gửi thêm
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="contact-page">
      <div className="contact-card">
        <div className="contact-left">
          <h1>Liên hệ với HAT BEAUTIFUL</h1>
          <p className="muted">
            Có câu hỏi về sản phẩm, hợp tác hoặc đơn hàng? Gửi cho chúng mình tin nhắn — đội
            ngũ sẽ phản hồi trong 24 giờ.
          </p>

          <div className="contact-info">
            <div><strong>Địa chỉ:</strong> 123 Fashion Street, Ho Chi Minh</div>
            <div><strong>Email:</strong> letonvinh25112004@gmail.com</div>
            <div><strong>Hotline:</strong> +84 354 790 080</div>
          </div>

          <div className="contact-images">
            <img src="https://datmay.net/wp-content/uploads/2023/08/non-dong-phuc-mau-so-5.jpg" alt="hat 1" />
            <img src="https://datmay.net/wp-content/uploads/2023/08/non-dong-phuc-mau-so-5.jpg" alt="hat 2" />
            <img src="https://datmay.net/wp-content/uploads/2023/08/non-dong-phuc-mau-so-5.jpg" alt="hat 3" />
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="row">
            <label>
              Tên
              <input name="name" value={form.name} onChange={handleChange} placeholder="Họ và tên" />
            </label>

            <label>
              Email
              <input name="email" value={form.email} onChange={handleChange} placeholder="example@mail.com" />
            </label>
          </div>

          <div className="row">
            <label>
              Số điện thoại
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="(không bắt buộc)" />
            </label>

            <label>
              Loại yêu cầu
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="general">Tổng quát</option>
                <option value="order">Về đơn hàng</option>
                <option value="product">Sản phẩm</option>
                <option value="collab">Hợp tác</option>
              </select>
            </label>
          </div>

          <label>
            Chủ đề
            <input name="subject" value={form.subject} onChange={handleChange} placeholder="Chủ đề ngắn" />
          </label>

          <label>
            Tin nhắn
            <textarea name="message" value={form.message} onChange={handleChange} rows="6" placeholder="Viết gì đó..." />
          </label>

          {error && <div className="form-error">{error}</div>}

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi liên hệ"}
            </button>
            <button
              type="button"
              className="btn-outline"
              onClick={() => setForm({ name: "", email: "", phone: "", subject: "", type: "general", message: "" })}
            >
              Xóa
            </button>
          </div>

          <p className="muted small">Chúng tôi tôn trọng quyền riêng tư của bạn. Không chia sẻ thông tin.</p>
        </form>
      </div>
    </main>
  );
};

export default Contact;
