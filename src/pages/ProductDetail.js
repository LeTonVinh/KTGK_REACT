import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../DB/supabaseClient";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [thumbnails, setThumbnails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper: convert product.image (could be single or CSV) to array
  const parseImages = (imgField) => {
    if (!imgField) return [];
    if (Array.isArray(imgField)) return imgField;
    // if it's a comma-separated string
    if (typeof imgField === "string" && imgField.includes(",")) {
      return imgField.split(",").map((s) => s.trim()).filter(Boolean);
    }
    return [imgField];
  };

  useEffect(() => {
    let cancelled = false;

    const getPublicUrlIfNeeded = async (img) => {
      if (!img) return null;
      // full url
      if (img.startsWith("http://") || img.startsWith("https://")) return img;
      // public path (from React public folder)
      if (img.startsWith("/")) return img;
      // otherwise assume it's a storage object key in bucket 'product-images'
      const bucketName = "product-images";
      try {
        const { data: publicData, error: publicErr } = supabase.storage
          .from(bucketName)
          .getPublicUrl(img);
        if (publicErr) {
          console.warn("Storage getPublicUrl error:", publicErr);
          return img; // fallback to provided string
        }
        return publicData.publicUrl;
      } catch (e) {
        console.warn("Exception getPublicUrl:", e);
        return img;
      }
    };

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      if (!id) {
        setError("ID sản phẩm không hợp lệ.");
        setLoading(false);
        return;
      }

      // Detect id type: if your id is integer, convert; if uuid, keep string
      const isIntegerId = true; // set false if your table uses uuid
      const idValue = isIntegerId ? Number(id) : id;
      if (isIntegerId && Number.isNaN(idValue)) {
        setError("ID phải là số hợp lệ.");
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from("hats")
          .select("*")
          .eq("id", idValue)
          .single();

        if (fetchError) {
          setError(fetchError.message || "Lỗi khi lấy dữ liệu.");
          setProduct(null);
          setLoading(false);
          return;
        }

        if (cancelled) return;
        setProduct(data);

        // handle images
        const imgs = parseImages(data?.image);
        const resolved = await Promise.all(imgs.map((i) => getPublicUrlIfNeeded(i)));
        if (!cancelled) {
          setThumbnails(resolved.filter(Boolean));
          setMainImage(resolved[0] || null);
        }
      } catch (e) {
        console.error("fetchProduct exception:", e);
        if (!cancelled) setError("Lỗi khi lấy dữ liệu.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const addToCart = () => {
    // placeholder action: you can integrate with cart state/store
    alert(`${product?.name} đã được thêm vào giỏ (demo).`);
  };

  if (loading) return <div className="pd-loading">Đang tải...</div>;
  if (error) return <div className="pd-error">{error}</div>;
  if (!product) return <div className="pd-empty">Không tìm thấy sản phẩm.</div>;

  const priceText = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(product.price || 0);

  return (
    <div className="pd-page">
      <div className="pd-container">
        <button className="pd-back-btn" onClick={() => navigate(-1)}>
          ← Quay lại
        </button>

        <div className="pd-grid">
          <div className="pd-media">
            <div className="pd-main-image-wrap">
              {mainImage ? (
                <img className="pd-main-image" src={mainImage} alt={product.name} />
              ) : (
                <div className="pd-no-image">No image</div>
              )}
            </div>

            {thumbnails && thumbnails.length > 1 && (
              <div className="pd-thumbs">
                {thumbnails.map((t, idx) => (
                  <button
                    key={idx}
                    className={`pd-thumb-btn ${t === mainImage ? "active" : ""}`}
                    onClick={() => setMainImage(t)}
                    aria-label={`Thumbnail ${idx + 1}`}
                  >
                    <img src={t} alt={`${product.name} thumb ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pd-info">
            <h1 className="pd-title">{product.name}</h1>
            <div className="pd-price">{priceText}</div>

            <div className="pd-meta">
              <div><strong>Thương hiệu:</strong> {product.brand || "N/A"}</div>
              <div><strong>Chất liệu:</strong> {product.material || "N/A"}</div>
              <div><strong>Kiểu dáng:</strong> {product.style || "N/A"}</div>
              <div><strong>Giới tính:</strong> {product.gender || "Unisex"}</div>
              <div><strong>Kích cỡ:</strong> {product.size || "Free"}</div>
            </div>

            <p className="pd-note">{product.note}</p>

            <div className="pd-actions">
              <button className="pd-add-btn" onClick={addToCart}>Thêm vào giỏ</button>
              <button className="pd-contact-btn" onClick={() => alert("Liên hệ demo")}>Liên hệ</button>
            </div>

            {/* Example: extra details box */}
            <div className="pd-specs">
              <h3>Thông số</h3>
              <ul>
                <li>Chất liệu: {product.material || "—"}</li>
                <li>Phong cách: {product.style || "—"}</li>
                <li>Thương hiệu: {product.brand || "—"}</li>
                <li>Mô tả: {product.note || "Không có mô tả"}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* placeholder related products */}
        <div className="pd-related">
          <h3>Sản phẩm liên quan</h3>
          <div className="pd-related-grid">
            {/* You can fetch related items later; placeholders for now */}
            <div className="pd-related-card">Sản phẩm A</div>
            <div className="pd-related-card">Sản phẩm B</div>
            <div className="pd-related-card">Sản phẩm C</div>
            <div className="pd-related-card">Sản phẩm D</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
