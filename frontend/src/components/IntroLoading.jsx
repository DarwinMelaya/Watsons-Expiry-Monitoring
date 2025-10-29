import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./IntroLoading.css";

const IntroLoading = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Navigate to login after 3 seconds
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="intro-loading">
      <div className="intro-loading-content">
        <img src="/logo.png" alt="Watsons Logo" className="intro-logo" />
      </div>
    </div>
  );
};

export default IntroLoading;
