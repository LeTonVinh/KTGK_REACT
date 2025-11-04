import { Link } from 'react-router-dom';
import './Footer.css';
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>HatBeautiful</h3>
          <p>
            Cung cấp sản phẩm chất lượng cao, giao hàng nhanh chóng và chăm sóc
            khách hàng tận tâm.
          </p>
        </div>

        <div className="footer-section">
          <h4>Liên kết</h4>
          <ul>
            <li><Link to="/">Trang chủ</Link></li>
            <li><Link to="/products">Sản phẩm</Link></li>
            <li><Link to="/about">Giới thiệu</Link></li>
            <li><Link to="/contact">Liên hệ</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Hỗ trợ</h4>
          <ul>
            <li><Link to="/warranty-policy">Chính sách bảo hành</Link></li>
            <li><Link to="/return-policy">Đổi trả & Hoàn tiền</Link></li>
            <li><Link to="/shipping">Vận chuyển</Link></li>
            <li><Link to="/faq">Câu hỏi thường gặp</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Liên hệ</h4>
          <p>Email: letonvinh25112004@gmail.com</p>
          <p>Hotline: 0354 790 080</p>
          <p>Địa chỉ: TP Hồ Chí Minh, Việt Nam</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 HatBeautiful. All rights reserved.</p>
      </div>
    </footer>
  );
}
export default Footer;