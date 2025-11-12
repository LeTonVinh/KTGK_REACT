import React, { useState } from "react";
import { supabase } from "../DB/supabaseClient";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // dùng lại style

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const {  error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Đăng ký thành công! Kiểm tra email để xác minh tài khoản.");
      // Optionally điều hướng đến login
      setTimeout(() => navigate("/login"), 2000);
    }
  };

  return (
    <div className="login-container">
      <h2>Đăng ký tài khoản</h2>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Đăng ký</button>
      </form>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
    </div>
  );
};

export default Signup;
