import { motion } from "motion/react";
import { useAuthContext } from "../Context/AuthContext";
import { useUser } from "../Context/UserContext";
import { useState } from "react";
import { useNavigate } from "react-router";
import { signup } from "../services/api";

const Register = () => {
  const { setAuth } = useAuthContext();
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
    } else {
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="w-full gap-8 flex flex-col items-center">
      <h1 className="text-4xl font-semibold">Sign Up</h1>
      <form
        onSubmit={handleSignup}
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
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number"
          className="py-2 px-4 w-3/4 bg-[#181b1e] border-2 border-[#ff2100] rounded-full"
        />
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
