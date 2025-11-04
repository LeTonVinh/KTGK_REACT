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
            </ul>
        </header>
    );
};
export default Header;