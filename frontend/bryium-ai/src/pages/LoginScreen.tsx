import { useState } from "react";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      Toastify({
        text: "Please fill in all fields",
        backgroundColor: "linear-gradient(to right, #FF5F6D, #FFC371)",
        duration: 3000,
        gravity: "top",
        position: "right",
      }).showToast();
      return;
    }

    Toastify({
      text: "Login successful!",
      backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
      duration: 2000,
      gravity: "top",
      position: "right",
    }).showToast();

    setTimeout(() => {
      window.location.href = "/home";
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Login</h2>
        <p className="text-gray-600 mb-6">
          Enter your correct details to access your account
        </p>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="border p-3 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-3 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
