import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./userLogin.css";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

    useEffect(() => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_role");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role: "user",
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Login failed");
        return;
      }

  
      localStorage.setItem("otp_email", email);

  
    navigate("/otp");

    } catch (err) {
      console.error("Login error full:", err);
      alert(err.message || "Server error");
    }
  };

  return (
    <div className="login">
      <h2>User Login</h2>
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

        <p>Don't have an account? <a href="/signup">Sign up</a></p>
      </form>
    </div>
  );
}
