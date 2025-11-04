import React from 'react';
import './Footer.css';
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>ShopName</h3>
          <p>
            Cung cấp sản phẩm chất lượng cao, giao hàng nhanh chóng và chăm sóc
            khách hàng tận tâm.
          </p>
        </div>

        <div className="footer-section">
          <h4>Liên kết</h4>
          <ul>
            <li><a href="#">Trang chủ</a></li>
            <li><a href="#">Sản phẩm</a></li>
            <li><a href="#">Giới thiệu</a></li>
            <li><a href="#">Liên hệ</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Hỗ trợ</h4>
          <ul>
            <li><a href="#">Chính sách bảo hành</a></li>
            <li><a href="#">Đổi trả & Hoàn tiền</a></li>
            <li><a href="#">Vận chuyển</a></li>
            <li><a href="#">Câu hỏi thường gặp</a></li>
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
        <p>© 2025 ShopName. All rights reserved.</p>
      </div>
    </footer>
  );
}
export default Footer;