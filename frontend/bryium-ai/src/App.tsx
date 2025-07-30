import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WelcomeScreen from "./pages/WelcomeScreen";
import HomeScreen from "./pages/Home";

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  return showWelcome ? (
    <WelcomeScreen onFinish={() => setShowWelcome(false)} />
  ) : (
    <HomeScreen />
  );
}

export default App;
