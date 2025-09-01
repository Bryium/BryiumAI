import { useEffect, useState } from "react";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatMenuOpen, setChatMenuOpen] = useState(false);

  useEffect(() => {
    const hasShownToast = localStorage.getItem("welcomeToastShown");

    if (!hasShownToast) {
      Toastify({
        text: "Welcome ",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: "#007bff",
      }).showToast();

      localStorage.setItem("welcomeToastShown", "true");
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-[#121212] text-[#e0e0e0] flex items-center justify-center">
      {/* Hamburger Menu - Only visible on mobile */}
      <div
        className="absolute top-4 right-4 md:hidden w-9 h-9 flex flex-col justify-center items-center bg-gradient-to-tr from-[#000f33] to-[#002e99] p-2 rounded cursor-pointer z-50"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <div className="w-6 h-[2px] bg-blue-300 mb-1"></div>
        <div className="w-6 h-[2px] bg-blue-300 mb-1"></div>
        <div className="w-6 h-[2px] bg-blue-300"></div>
      </div>

      {/* Mobile Menu (currently empty after removing auth buttons) */}
      {menuOpen && (
        <div className="absolute top-14 right-4 w-[40vw] bg-[#1f1f1f] p-4 rounded-lg z-50 shadow-md">
          <p className="text-gray-400 text-sm text-center">Menu</p>
        </div>
      )}

      {/* Main Chat Container */}
      <div className="relative w-full max-w-6xl h-[80vh] bg-[#1f1f1f] rounded-2xl shadow-2xl flex flex-col animate-fadeIn">
        {/* Header */}
        <div className="bg-[#2b2b2b] p-6 rounded-t-2xl text-center text-2xl font-bold text-white sticky top-0 z-10 shadow-md">
          Bryium?
        </div>

        {/* Static Greeting */}
        <div className="bg-[#333333] text-[#e0e0e0] p-4 rounded-lg text-center m-4 shadow-lg">
          Hey, I'm Bryium. How may I help you today?
        </div>

        {/* Chat Box */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-[#181818] to-[#232323] scrollbar-thin scrollbar-thumb-blue-500 rounded-b-xl">
          {/* Chat messages go here */}
        </div>

        {/* Input Area */}
        <div className="flex items-center gap-3 border-t border-[#333] bg-[#2b2b2b] p-4 relative">
          {/* Small + Icon (toggles upload menu) */}
          <div className="relative">
            <button
              onClick={() => setChatMenuOpen(!chatMenuOpen)}
              className="text-white p-4 text-2xl shadow-md m-0 rounded-none"
            >
              <FontAwesomeIcon icon={faPlus} beat />
            </button>

            {/* Upload Menu (Camera / Gallery) */}
            {chatMenuOpen && (
              <div className="absolute bottom-12 left-0 bg-[#232323] p-2 rounded-md shadow-lg z-50 space-y-2">
                <button className="block w-full text-left text-white bg-[#000f33] px-4 py-2 rounded-md">
                  📷 Camera
                </button>
                <button className="block w-full text-left text-white bg-[#000f33] px-4 py-2 rounded-md">
                  🖼️ Gallery
                </button>
              </div>
            )}
          </div>

          {/* Text Input */}
          <input
            type="text"
            placeholder="Ask Bryium anything..."
            className="flex-1 bg-[#424242] text-white p-3 rounded-lg outline-none shadow-inner"
          />

          {/* Send Button */}
          <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg shadow-md">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
