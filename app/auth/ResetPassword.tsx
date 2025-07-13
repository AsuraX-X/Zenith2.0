import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuthContext } from "../Context/AuthContext";
import { usePopUpContext } from "../Context/PopUpContext";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthContext();
  const { addPopUp } = usePopUpContext();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Password reset successful. Redirecting to login...");
        setTimeout(() => {
          navigate("/");
          setAuth("login");
          addPopUp();
        }, 2000);
      } else {
        setMessage(data.error || "Password reset failed.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full gap-8 flex flex-col items-center h-screen justify-center">
      <h1 className="text-3xl font-semibold">Reset Password</h1>
      <form
        onSubmit={handleReset}
        className="flex flex-col items-center gap-4 w-full max-w-md"
      >
        <input
          type="email"
          placeholder="Enter your email"
          className="py-2 px-4 border rounded w-3/4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          className="py-2 px-4 border rounded w-3/4"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          className="py-2 px-4 border rounded w-3/4"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-red-600 text-white py-2 px-6 rounded"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
        {message && <p className="text-gray-700 text-center">{message}</p>}
      </form>
    </div>
  );
}
