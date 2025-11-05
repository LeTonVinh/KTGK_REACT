import React from "react";
import "./About.css";

const About = () => {
  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="hero-text">
          <h1>HAT BEAUTIFUL</h1>
          <p className="lead">
            Nơi tôn vinh từng đường kim mũi chỉ — bộ sưu tập nón hợp mốt, đa phong cách và dễ
            phối đồ. Chúng tôi tin một chiếc nón đẹp có thể thay đổi cảm xúc ngày mới.
          </p>
          <p className="cta">
            Khám phá bộ sưu tập — từ bucket, beret đến snapback — cho mọi phong cách.
          </p>
        </div>
        <div className="hero-image">
          <img src="https://datmay.net/wp-content/uploads/2023/08/non-dong-phuc-mau-so-5.jpg" alt="Addidas hat" />
        </div>
      </section>

      <section className="about-content">
        <div className="about-text">
          <h2>Về chúng tôi</h2>
          <p>
            HAT BEAUTIFUL được sinh ra từ niềm đam mê với thời trang headwear. Chúng tôi tuyển
            chọn những thiết kế có chất liệu tốt, form chuẩn và tính ứng dụng cao — để bạn luôn tự
            tin tỏa sáng trong mọi khoảnh khắc. Không chỉ bán nón, chúng tôi chia sẻ cảm hứng và
            cách phối đồ, giúp mỗi chiếc nón trở thành tuyên ngôn cá tính.
          </p>

          <h3>Sứ mệnh</h3>
          <p>
            Mang đến nón chất lượng, thiết kế tinh tế với giá hợp lý, đồng thời xây dựng cộng đồng
            yêu nón năng động, sáng tạo và tôn trọng phong cách cá nhân.
          </p>

          <h3>Giá trị cốt lõi</h3>
          <ul>
            <li>Chất lượng: chọn lọc vật liệu và gia công tỉ mỉ.</li>
            <li>Phong cách: cập nhật xu hướng quốc tế, nhưng vẫn dễ mặc.</li>
            <li>Trách nhiệm: minh bạch nguồn gốc và phục vụ tận tâm.</li>
          </ul>
        </div>

        <aside className="about-gallery">
          <div className="gallery-grid">
            <figure className="gallery-item">
              <img src="https://datmay.net/wp-content/uploads/2023/08/non-dong-phuc-mau-so-5.jpg" alt="Adidas beige hat" />
              <figcaption>Classic Beige — Phong cách tối giản</figcaption>
            </figure>

            <figure className="gallery-item">
              <img src="https://datmay.net/wp-content/uploads/2023/08/non-dong-phuc-mau-so-5.jpg" alt="Force black hat" />
              <figcaption>Force Black — Năng động, mạnh mẽ</figcaption>
            </figure>

            <figure className="gallery-item">
              <img src="https://datmay.net/wp-content/uploads/2023/08/non-dong-phuc-mau-so-5.jpg" alt="Beret vintage brown" />
              <figcaption>Vintage Beret — Nhẹ nhàng cổ điển</figcaption>
            </figure>
          </div>
        </aside>
      </section>

      <section className="about-footer-cta">
        <div className="cta-block">
          <h3>Thử ngay phong cách mới</h3>
          <p>Chọn một chiếc nón, thử phối và để lại dấu ấn của riêng bạn.</p>
          <a className="btn" href="/products">Xem sản phẩm</a>
        </div>
      </section>
    </main>
  );
};

export default About;
