// src/pages/Login.js
import React, { useState } from "react";
import { supabase } from "../DB/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    try {
      const { data, error: signError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signError) {
        setError(signError.message);
        setLoading(false);
        return;
      }

      // defensive: đảm bảo user tồn tại
      const user = data?.user ?? null;
      if (!user) {
        setError("Đăng nhập không thành công. Vui lòng thử lại.");
        setLoading(false);
        return;
      }

      // Lấy profile từ bảng profiles
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (profileError) {
        // Nếu không tìm được profile, bạn có thể tạo mặc định hoặc báo cho user
        setError("Không tìm thấy hồ sơ người dùng. Liên hệ admin.");
        // optional: console log để debug
        console.error("profileError:", profileError);
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      // Nếu là admin -> vào admin, nếu không -> vào trang shop (hoặc home)
      if (profile?.is_admin) {
        navigate("/admin");
      } else {
        // user bình thường: chuyển vào trang shop (đổi /shop thành route thực tế của bạn)
        navigate("/products");
      }
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Đăng nhập</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        {error && <p className="error">{error}</p>}
        {info && <p className="info">{info}</p>}

        <div className="login-footer">
          <p>
            Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
          </p>
          <p>
            Muốn vào admin? Dùng tài khoản admin. Nếu bạn là admin nhưng không vào
            được, kiểm tra cột <code>is_admin</code> trong bảng <code>profiles</code>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
