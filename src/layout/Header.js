import { Link } from "react-router-dom";
import './Header.css';
const Header = () => {
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
            <button className="header-admin-button">
                <Link to="/login">Đăng nhập  </Link>
                <Link to="/register">Đăng kí</Link>
            </button>
        </header>
    );
};
export default Header;