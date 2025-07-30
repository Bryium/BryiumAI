import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import WelcomeScreen from "./pages/WelcomeScreen";
import HomeScreen from "./pages/Home";
import LoginForm from "./pages/Login";
import RegisterForm from "./pages/Register";

function RoutesWithWelcome() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Skip welcome screen for login or register
    if (location.pathname === "/login" || location.pathname === "/register") {
      setShowWelcome(false);
    }
  }, [location.pathname]);

  if (showWelcome) {
    return <WelcomeScreen onFinish={() => setShowWelcome(false)} />;
  }

  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <RoutesWithWelcome />
      <ToastContainer />
    </Router>
  );
}

export default App;
