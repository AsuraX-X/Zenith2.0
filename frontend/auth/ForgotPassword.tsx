import { motion } from "motion/react";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { usePopUpStore } from "../stores/popUpStore";
import { useAuthStore } from "../stores/authStore";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { addPopUp } = usePopUpStore();

  // Step 1: Send reset code to email
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setCodeSent(true);
        setMessage("Code sent! Check your email.");
      } else {
        setMessage(data.message || "Failed to send code.");
      }
    } catch (err) {
      console.error(err);

      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify the code entered by user
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:3000/verify-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("Code verified. Redirecting...");
        setTimeout(() => {
          navigate("/auth/reset-password");
        }, 1500);
      } else {
        setMessage(data.error || "Invalid or expired code.");
      }
    } catch (err) {
      console.error(err);

      setMessage("Verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full gap-8 flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-semibold">Forgot Password</h1>

      {!codeSent ? (
        <form
          onSubmit={handleSendCode}
          className="flex flex-col items-center gap-4 w-full"
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="py-2 px-4 border rounded w-120"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 text-white py-2 px-6 rounded"
          >
            {loading ? "Sending..." : "Send Reset Code"}
          </button>
        </form>
      ) : (
        <form
          onSubmit={handleVerifyCode}
          className="flex flex-col items-center gap-4 w-full"
        >
          <input
            type="text"
            placeholder="Enter the 6-digit code sent to your email"
            className="py-2 px-4 border rounded w-3/4"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white py-2 px-6 rounded"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </form>
      )}

      {message && <p className="text-gray-300 text-center">{message}</p>}

      <motion.p
        whileHover={{ color: "#ff2100", cursor: "pointer" }}
        transition={{ duration: 0.1 }}
        onClick={() => {
          navigate("/");
          setAuth("login");
          addPopUp();
        }}
        className="text-gray-400 mt-4"
      >
        Back to Login
      </motion.p>
    </div>
  );
}
