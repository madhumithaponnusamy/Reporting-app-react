import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";

export default function OTPPage() {
  const [email, setEmail] = useState("");      // User email
  const [otp, setOtp] = useState("");          // OTP entered by user
  const [otpSent, setOtpSent] = useState(false); // Flag to show OTP input
  const navigate = useNavigate();

  // ✅ Send OTP function
  const sendOtp = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "login" })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("OTP has been sent successfully 📩");
      setOtpSent(true); // Show OTP input

    } catch (err) {
      console.error("Send OTP error:", err);
      alert("Something went wrong, please try again");
    }
  };

  // ✅ Verify OTP function
  const verifyOtp = async () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          purpose: "login"
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("OTP verified successfully ✅");

      localStorage.setItem("user_token", data.token);
      localStorage.setItem("user_role", data.role);

      navigate("/user/dashboard");

    } catch (err) {
      console.error("Verify OTP error:", err);
      alert("Something went wrong, please try again");
    }
  };

  return (
    <div className="otp-page">
      <h2>Login with OTP</h2>

      {/* Email input */}
      {!otpSent && (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={sendOtp}>Send OTP</button>
        </>
      )}

      {/* OTP input */}
      {otpSent && (
        <>
          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOtp}>Verify OTP</button>
        </>
      )}
    </div>
  );
}
