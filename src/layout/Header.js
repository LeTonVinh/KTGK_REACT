import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../DB/supabaseClient";
import './Header.css';

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // lắng nghe sự kiện đăng nhập/đăng xuất
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/"); // chuyển về trang chủ sau logout
  };

  return (
    <header className="header">
      <div className="header-logo">
        <img src="/logoshop.png" alt="HatBeautiful Logo" className="logo-image" />
      </div>
      <ul className="header-list">
        <li><Link to="/">Trang chủ</Link></li>
        <li><Link to="/products">Sản phẩm</Link></li>
        <li><Link to="/about">Giới thiệu</Link></li>
        <li><Link to="/contact">Liên hệ</Link></li>
        <li><Link to="/cart">Giỏ hàng</Link></li>
        <li><Link to="/orders">Đơn hàng</Link></li>
      </ul>

      <div className="header-auth-buttons">
        {user ? (
          <button onClick={handleLogout} className="header-logout-button">
            Đăng xuất
          </button>
        ) : (
          <>
            <Link to="/login" className="header-login-button">Đăng nhập</Link>
            <Link to="/register" className="header-register-button">Đăng ký</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
