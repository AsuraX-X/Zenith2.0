import { motion } from "motion/react";
import { useAuthContext } from "../Context/AuthContext";

const Register = () => {
  const { setAuth } = useAuthContext();

  return (
    <div className="w-full gap-8 flex flex-col items-center">
      <h1 className="text-4xl font-semibold">Sign Up</h1>
      <form action="" className="w-full flex flex-col items-center gap-4">
        <input
          type="text"
          placeholder="Username"
          className="py-2 px-4 w-3/4 bg-[#181b1e] border-2 border-[#ff2100] rounded-full"
        />
        <input
          type="text"
          placeholder="Phone number"
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
