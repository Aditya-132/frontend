import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import JobApplicationDetail from "./JobApplicationDetail";

const EmailVerification = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(`http://localhost:4000/api/v1/sendOtp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        setOtpSent(true);
        toast.success("OTP sent to your email");
      } else {
        toast.error("Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/v1/verifyOtp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('token', data.token); // Store token
        toast.success("OTP verified");
        setIsVerified(true);
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Invalid OTP");
    }
  };

  if (isVerified) {
    return <JobApplicationDetail email={email} />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r">
      <div className="p-6 bg-white shadow-lg rounded-lg w-full max-w-md">
        {!otpSent ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Enter Your Email to View Details</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors"
            />
            <button
              onClick={sendOtp}
              disabled={loading || otpSent} // Disable button when loading or OTP is sent
              className={`w-full bg-blue-500 text-white px-4 py-2 rounded transition-colors duration-300 ${loading || otpSent ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'}`}
            >
              {loading ? "Please wait..." : "Send OTP"} {/* Show loading message */}
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4 mt-6 text-gray-800 text-center">Enter OTP</h2>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mb-4 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
            <button
              onClick={verifyOtp}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300"
            >
              Verify OTP
            </button>
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default EmailVerification;
