import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./IntroLoading.css";

const IntroLoading = ({ onComplete, navigateTo }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      } else if (navigateTo) {
        navigate(navigateTo);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, onComplete, navigateTo]);

  return (
    <div className="intro-loading">
      <div className="intro-loading-content">
        <img src="/logo.png" alt="Watsons Logo" className="intro-logo" />
      </div>
    </div>
  );
};

export default IntroLoading;
