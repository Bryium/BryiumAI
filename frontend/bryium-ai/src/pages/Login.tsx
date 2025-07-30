import { useState } from "react";
import { FaEnvelope, FaLock, FaGoogle } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password");
    } else {
      toast.success("Login successful!");
      // Add your login logic here
    }
  };

  const handleGoogleLogin = () => {
    toast.info("Google login clicked");
    // Add your Google login logic here
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Login</h2>
        <p className="text-gray-600 mb-6">
          Enter your correct details to access your account
        </p>

        <form className="flex flex-col gap-4" id="loginForm">
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
            <span className="mr-3 text-gray-500">✉️</span>
            <input
              type="email"
              id="email"
              placeholder="Enter email address"
              required
              className="w-full border-none outline-none text-gray-700 placeholder-gray-400 bg-white"
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
            <span className="mr-3 text-gray-500">🔒</span>
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              required
              className="w-full border-none outline-none text-gray-700 placeholder-gray-400 bg-white"
            />
          </div>

          <button
            type="submit"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg text-base font-medium transition-colors"
          >
            Login
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative text-sm text-gray-500 bg-white px-4">OR</div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            id="google-signin-btn"
            className="w-full flex items-center justify-center border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 py-2 rounded-lg transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 533.5 544.3"
              className="w-5 h-5 mr-3"
            >
              <path
                fill="#4285F4"
                d="M533.5 278.4c0-18.6-1.5-37.2-4.7-55.2H272v104.7h147.1c-6.3 34.3-25.6 63.4-54.6 82.8v68h88.4c51.7-47.7 80.6-118.1 80.6-200.3z"
              />
              <path
                fill="#34A853"
                d="M272 544.3c73.6 0 135.5-24.3 180.6-66.1l-88.4-68c-24.6 16.3-56 25.5-92.2 25.5-70.9 0-131-47.9-152.6-112.1H27.3v70.8C72.6 486.2 165.8 544.3 272 544.3z"
              />
              <path
                fill="#FBBC05"
                d="M119.4 323.6c-10.2-30.3-10.2-62.9 0-93.2v-70.8H27.3c-37.2 73.5-37.2 161.5 0 235z"
              />
              <path
                fill="#EA4335"
                d="M272 107.7c39.9-.6 78.2 13.9 107.6 40.7l80.3-80.3C408.7 24.4 341.5-1.4 272 0 165.8 0 72.6 58 27.3 152.1l92.1 70.8c21.5-64.2 81.7-112.1 152.6-115.2z"
              />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
