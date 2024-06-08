import React, { useState } from "react";
import { toast } from "react-toastify";
import Modal from "react-modal";
import JobApplicationDetail from "./JobApplicationDetail";
import "./EmailVerification.css"; // Import the CSS file

// const baseURL = process.env.BASE_URL || "http://localhost:4000";

Modal.setAppElement('#root'); // Bind modal to your app element

const EmailVerification = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");

  const sendOtp = async () => {
    try {
      const response = await fetch(`https://backend-1-qebm.onrender.com/api/v1/sendOtp`, {
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
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await fetch(`https://backend-1-qebm.onrender.com/api/v1/verifyOtp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (data.success) {
        setOtpVerified(true);
        setIsModalOpen(false);
        setVerifiedEmail(email);
        toast.success("OTP verified");
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Invalid OTP");
    }
  };

  return (
    <div className="email-verification-container">
      {!otpVerified ? (
        <>
          <h2>Enter Your Email to View Job Application Details</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={() => { sendOtp(); setIsModalOpen(true); }}>
            Send OTP
          </button>
          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            contentLabel="Verify OTP"
            className="Modal"
          >
            <h2>Enter OTP</h2>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={verifyOtp}>Verify OTP</button>
          </Modal>
        </>
      ) : (
        <JobApplicationDetail email={verifiedEmail} />
      )}
    </div>
  );
};

export default EmailVerification;
