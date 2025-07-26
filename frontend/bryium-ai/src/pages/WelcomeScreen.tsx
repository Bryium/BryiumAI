import { useEffect } from "react";

interface WelcomeScreenProps {
  onFinish: () => void;
}

export default function WelcomeScreen({ onFinish }: WelcomeScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => onFinish(), 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-100 px-4 sm:px-6 text-center">
      {/* Loading Spinner */}
      <div className="flex items-center justify-center mb-6">
        <div className="w-10 h-10 sm:w-12 boarder-4 boarder-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
      {/* Title*/}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-blue-700 mb-2 animate-pulse tracking-wide">
        Welcome to Bryium-Ai
      </h1>

      {/* Subtitle */}
      <p className="text-gray-700 mb-1 text-base sm:text-lg">
        Your smartest AI assistant
      </p>
      {/* Loading message */}
      <p className="text-sm sm:text-base text-gray-500">
        Initializing magic...
      </p>
    </div>
  );
}
