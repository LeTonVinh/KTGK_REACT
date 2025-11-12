import React from 'react';
import './Banner.css';

const images = [
  '/adisdashat.png',
  '/forcehat.png',
  '/munoibanner.png',
  '/non.png',
  '/adisdashat.png',
  '/forcehat.png',
  '/munoibanner.png',
  '/non.png',
];

const Banner = () => {
  return (
    <div className="banner">
      <div className="banner-content">
        <h1>HAT BEAUTIFUL</h1>
      </div>
      <div className="banner-images">
        <div className="scrolling-track">
          {images.map((src, idx) => (
            <img key={idx} src={src} alt={`Banner ${idx + 1}`} className="banner-img" />
          ))}
          {images.map((src, idx) => (
            // lặp lần 2 để tạo hiệu ứng liên tục
            <img key={images.length + idx} src={src} alt={`Banner ${idx + 1}`} className="banner-img" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
