import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../user/userLogin.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

 useEffect(() => {
  localStorage.removeItem("user_token");
  localStorage.removeItem("user_role");
}, []);

  
  useEffect(() => {
    const admin_token = localStorage.getItem("admin_token");
    const admin_role = localStorage.getItem("admin_role");

    if (admin_token && admin_role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    }

    if (admin_token && admin_role === "user") {
      navigate("/unauthorized", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password,
          role: "admin"
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // ✅ SAVE TOKEN
      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_role", data.role);

      // ✅ GO TO ADMIN DASHBOARD
      navigate("/admin/dashboard", { replace: true });

    } catch (err) {
      console.error("Login error:", err);
      setError("Server error");
    }
  };

  return (
    <div className="login">
      <h2>Admin Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleLogin}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>

        <p>Don't have an account? <a href="/admin/signup">Sign up</a></p>
      </form>
    </div>
  );
}
