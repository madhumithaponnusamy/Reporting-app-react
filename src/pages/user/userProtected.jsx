import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function UserProtectedRoute({ children }) {
  const token = localStorage.getItem("user_token");


  if (!token) return <Navigate to="/" />;

  try {
    const decoded = jwtDecode(token);

    if (decoded.role !== "user") return <Navigate to="/" />;

    return children;
  } catch {
    return <Navigate to="/" />;
  }
}
