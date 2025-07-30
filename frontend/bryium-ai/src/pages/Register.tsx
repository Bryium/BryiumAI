import { useState } from "react";
import { FaEnvelope, FaLock, FaUser, FaGoogle } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
    } else {
      toast.success("Registration successful!");
      // Add your registration logic here
    }
  };

  const handleGoogleRegister = () => {
    toast.info("Google signup clicked");
    // Add your Google signup logic here
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Register</h2>
        <p className="text-gray-600 mb-6">
          Fill in your details to create a new account
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleRegister}>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
            <span className="mr-3 text-gray-500 text-lg">👤</span>
            <input
              type="text"
              placeholder="Enter full name"
              required
              className="w-full border-none outline-none text-gray-700 placeholder-gray-400 bg-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
            <span className="mr-3 text-gray-500 text-lg">✉️</span>
            <input
              type="email"
              placeholder="Enter email address"
              required
              className="w-full border-none outline-none text-gray-700 placeholder-gray-400 bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
            <span className="mr-3 text-gray-500 text-lg">🔒</span>
            <input
              type="password"
              placeholder="Enter password"
              required
              className="w-full border-none outline-none text-gray-700 placeholder-gray-400 bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg text-base font-medium transition-colors"
          >
            Register
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative text-sm text-gray-500 bg-white px-4">OR</div>
        </div>

        <div className="flex flex-col items-center gap-4 mt-6">
          <h1 className="text-[#333] text-[1.1rem] font-medium m-0">
            Already have an account?
          </h1>
          <a
            href="/login"
            className="bg-[#ddd] text-[#333] py-3 rounded-[8px] text-base cursor-pointer w-full text-center transition duration-300 hover:bg-[#ccc]"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
