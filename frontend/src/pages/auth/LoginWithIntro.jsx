import { useState, useEffect } from "react";
import IntroLoading from "../../components/IntroLoading";
import Login from "./Login";

const LoginWithIntro = () => {
  const [showLogin, setShowLogin] = useState(false);

  // Reset showLogin state when component mounts (when navigating back to /login)
  useEffect(() => {
    setShowLogin(false);
  }, []);

  return showLogin ? (
    <Login />
  ) : (
    <IntroLoading onComplete={() => setShowLogin(true)} />
  );
};

export default LoginWithIntro;
