import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./signup.css"

export default function Otp() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const userId = location.state?.userId;

  const verifyOtp = async () => {
    const res = await fetch("http://localhost:5000/api/otp/verifyOtp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, otp })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    localStorage.setItem("user_token", data.token);
    localStorage.setItem("user_role", data.role);

    navigate("/user/dashboard");
  };

  return (
    <div className="otp">
      <h2>Enter OTP</h2>
      <input
        placeholder="6-digit OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={verifyOtp}>Verify</button>
    </div>
  );
}
