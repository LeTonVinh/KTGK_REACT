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
  const [related, setRelated] = useState([]); // <-- danh sách sản phẩm liên quan
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const parseImages = (imgField) => {
    if (!imgField) return [];
    if (Array.isArray(imgField)) return imgField;
    if (typeof imgField === "string" && imgField.includes(",")) {
      return imgField.split(",").map((s) => s.trim()).filter(Boolean);
    }
    return [imgField];
  };

  useEffect(() => {
    let cancelled = false;

    const getPublicUrlIfNeeded = async (img) => {
      if (!img) return null;
      if (img.startsWith("http://") || img.startsWith("https://")) return img;
      if (img.startsWith("/")) return img;
      const bucketName = "product-images";
      try {
        const { data: publicData, error: publicErr } = supabase.storage
          .from(bucketName)
          .getPublicUrl(img);
        if (publicErr) {
          console.warn("Storage getPublicUrl error:", publicErr);
          return img;
        }
        return publicData.publicUrl;
      } catch (e) {
        console.warn("Exception getPublicUrl:", e);
        return img;
      }
    };

    const fetchRelated = async (productData, idValue, isIntegerId) => {
      if (!productData) return;
      const brand = productData.brand;
      try {
        // 1) Thử lấy theo brand (khác id), giới hạn 4
        let query = supabase
          .from("hats")
          .select("*")
          .neq("id", idValue)
          .limit(4);

        if (brand) query = query.eq("brand", brand);

        const { data: relatedData, error: relatedErr } = await query;
        if (relatedErr) {
          console.warn("Lỗi lấy related theo brand:", relatedErr);
        }

        let finalRelated = relatedData || [];

        // 2) Nếu chưa đủ 4 item, lấy thêm sản phẩm khác (khác id) để đủ
        if (finalRelated.length < 4) {
          const need = 4 - finalRelated.length;
          // Lấy sản phẩm bất kỳ khác id, exclude những đã lấy
          const excludeIds = finalRelated.map((r) => r.id).concat([idValue]);
          // PostgREST: filter ids not in array => using not.in
          const { data: extra, error: extraErr } = await supabase
            .from("hats")
            .select("*")
            .not("id", "in", `(${excludeIds.join(",")})`)
            .limit(need);

          if (extraErr) {
            console.warn("Lỗi lấy extra related:", extraErr);
          } else {
            finalRelated = finalRelated.concat(extra || []);
          }
        }

        if (!cancelled) setRelated(finalRelated);
      } catch (e) {
        console.warn("Exception fetchRelated:", e);
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

      // Chỉnh isIntegerId = true nếu id kiểu integer trong DB
      const isIntegerId = true;
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

        // xử lý ảnh
        const imgs = parseImages(data?.image);
        const resolved = await Promise.all(imgs.map((i) => getPublicUrlIfNeeded(i)));
        if (!cancelled) {
          setThumbnails(resolved.filter(Boolean));
          setMainImage(resolved[0] || null);
        }

        // Lấy related products
        await fetchRelated(data, idValue, isIntegerId);
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

  
const addToCart = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    alert("Vui lòng đăng nhập để thêm vào giỏ.");
    return;
  }

  // Kiểm tra nếu sản phẩm đã tồn tại trong giỏ
  const { data: existing, error: checkErr } = await supabase
    .from("carts")
    .select("id, quantity")
    .eq("user_id", user.id)
    .eq("product_id", product.id)
    .single();

  if (checkErr && checkErr.code !== "PGRST116") { // 116 = not found
    console.error(checkErr);
    alert("Lỗi khi thêm vào giỏ.");
    return;
  }

  if (existing) {
    // Cập nhật quantity
    const { error: updateErr } = await supabase
      .from("carts")
      .update({ quantity: existing.quantity + 1 })
      .eq("id", existing.id);

    if (updateErr) {
      console.error(updateErr);
      alert("Lỗi khi cập nhật giỏ hàng.");
    } else {
      alert(`${product.name} đã được tăng số lượng trong giỏ.`);
    }
  } else {
    // Thêm mới
    const { error: insertErr } = await supabase
      .from("carts")
      .insert([{ user_id: user.id, product_id: product.id, quantity: 1 }]);

    if (insertErr) {
      console.error(insertErr);
      alert("Lỗi khi thêm vào giỏ.");
    } else {
      alert(`${product.name} đã được thêm vào giỏ.`);
    }
  }
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

        <div className="pd-related">
          <h3>Sản phẩm liên quan</h3>
          <div className="pd-related-grid">
            {related && related.length > 0 ? (
              related.map((r) => (
                <div
                  key={r.id}
                  className="pd-related-card"
                  onClick={() => navigate(`/sanpham/${r.id}`)}
                  role="button"
                >
                  <div style={{ height: 120, overflow: "hidden", borderRadius: 8, marginBottom: 8 }}>
                    <img
                      src={Array.isArray(r.image) ? r.image[0] : r.image}
                      alt={r.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ fontWeight: 700 }}>{r.name}</div>
                  <div style={{ color: "#e63946", marginTop: 6 }}>{(r.price || 0).toLocaleString()} VND</div>
                </div>
              ))
            ) : (
              <div>Không có sản phẩm liên quan.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
