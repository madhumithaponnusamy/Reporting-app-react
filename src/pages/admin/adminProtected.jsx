import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function AdminProtectedRoute({ children }) {
  const admin_token = localStorage.getItem("admin_token");


  if (!admin_token) return <Navigate to="/unauthorized" />;

  try {
    const decoded = jwtDecode(admin_token);
    // role check
    if (decoded.role !== "admin") {
      return <Navigate to="/unauthorized" />; 
    }
    return children;
  } catch (err) {
    return <Navigate to="/admin" />;
  }
}
