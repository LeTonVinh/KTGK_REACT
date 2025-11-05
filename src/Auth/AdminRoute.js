import React, { useEffect, useState } from "react";
import { supabase } from "../DB/supabaseClient";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Lỗi kiểm tra admin:", error);
        setIsAdmin(false);
      } else {
        setIsAdmin(profile?.is_admin === true);
      }
      setLoading(false);
    };

    checkAdmin();
  }, []);

  if (loading) return <p>Đang kiểm tra quyền truy cập...</p>;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}
