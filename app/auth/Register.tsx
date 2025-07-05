import { motion } from "motion/react";
import { useAuthContext } from "../Context/AuthContext";
import { useUser } from "../Context/UserContext";
import { useState } from "react";
import { useNavigate } from "react-router";
import { signup } from "../services/api";
import { usePopUpContext } from "../Context/PopUpContext";

const Register = () => {
  const { setAuth } = useAuthContext();
  const { removePopUp } = usePopUpContext();
  const { setUser } = useUser(); // ✅ Use context
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  // const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await signup(name, email, password, phone); // your API should handle this

    if (res.success) {
      const user = res.user;
      // The setUser function now handles localStorage automatically
      setUser(user);

      // Redirect based on role
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/menu");
      }

      setAuth("");
      removePopUp();
    } else {
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="w-full gap-8 flex flex-col items-center">
      <h1 className="text-4xl font-semibold">Sign Up</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // Ghanaian phone number validation: starts with 0, followed by 9 digits, or +233 then 9 digits
          const ghanaPhoneRegex = /^(0\d{9}|(\+233\d{9}))$/;
          if (!ghanaPhoneRegex.test(phone)) {
            alert("Please enter a valid Ghanaian phone number.");
            return;
          }
          // Email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            return;
          }
          handleSignup(e);
        }}
        className="w-full flex flex-col items-center gap-4"
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Username"
          className="py-2 px-4 w-3/4 bg-[#181b1e] border-2 border-[#ff2100] rounded-full"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="py-2 px-4 w-3/4 bg-[#181b1e] border-2 border-[#ff2100] rounded-full"
        />
        {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
          <span className="text-red-500 text-sm w-full px-20">
            *Please enter a valid email.
          </span>
        )}
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number"
          className="py-2 px-4 w-3/4 bg-[#181b1e] border-2 border-[#ff2100] rounded-full"
        />
        {phone && !/^(0\d{9}|(\+233\d{9}))$/.test(phone) && (
          <span className="text-red-500 text-sm w-full px-20">
            *Please enter a valid phone number.
          </span>
        )}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="py-2 px-4 w-3/4 bg-[#181b1e] border-2 border-[#ff2100] rounded-full"
        />
        <button type="submit" className="bg-[#ff2100] px-4 py-2 rounded-full">
          Continue
        </button>
      </form>
      <p className="text-gray-400">
        Already have an account?{" "}
        <motion.span
          whileHover={{ color: "#ff2100", cursor: "pointer" }}
          transition={{ duration: 0.1 }}
          onClick={() => setAuth("login")}
        >
          Login
        </motion.span>
      </p>
    </div>
  );
};

export default Register;
