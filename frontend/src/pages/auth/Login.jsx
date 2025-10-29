import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { API_BASE_URL } from "../../config/api";

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Reset state when component mounts (e.g., after logout or failed login)
  useEffect(() => {
    // Clear any previous loading state
    setLoading(false);

    // Reset abort controller
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = null;

    // Clear form on mount to ensure fresh state
    setFormData({
      username: "",
      password: "",
    });
  }, []);

  // Cleanup: cancel request if component unmounts
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      setLoading(false);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent multiple simultaneous submissions
    if (loading) {
      return;
    }

    if (!formData.username || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    // Cancel previous request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/login`,
        {
          username: formData.username.trim(),
          password: formData.password,
        },
        {
          timeout: 10000, // 10 seconds timeout
          signal: abortControllerRef.current.signal,
        }
      );

      // Store user data and token immediately
      const userData = {
        _id: response.data._id,
        username: response.data.username,
        token: response.data.token,
      };

      login(userData);

      // Clear form
      setFormData({
        username: "",
        password: "",
      });

      // Ensure React state update completes before navigation
      await Promise.resolve();

      navigate("/dashboard", { replace: true });
      toast.success("Login successful!");

      // Reset abort controller
      abortControllerRef.current = null;
    } catch (error) {
      // Don't show error if request was cancelled
      if (
        error.name === "CanceledError" ||
        error.name === "AbortError" ||
        error.code === "ERR_CANCELED"
      ) {
        return;
      }

      if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
        toast.error("Request timed out. Please try again.");
      } else {
        toast.error(error.response?.data?.message || "Login failed");
      }

      // Clear password field on error for security
      setFormData((prev) => ({
        ...prev,
        password: "",
      }));
    } finally {
      // Always reset loading state
      setLoading(false);

      // Clean up abort controller if not already cleared
      if (
        abortControllerRef.current &&
        !abortControllerRef.current.signal.aborted
      ) {
        abortControllerRef.current = null;
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#019e97]">
      <div className="w-full max-w-md px-6 py-8">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-[#019e97] px-8 py-6 text-center">
            <img
              src="/logo.png"
              alt="Watsons Logo"
              className="mx-auto mb-3 h-16 sm:h-20 w-auto object-contain"
            />

            <p className="text-white/90 text-sm">Sign in to your account</p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#019e97] focus:border-transparent transition-all outline-none"
                placeholder="Enter your username"
                autoComplete="username"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#019e97] focus:border-transparent transition-all outline-none"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#019e97] focus:ring-[#019e97] border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-600"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-[#019e97] hover:text-[#017a75] transition-colors"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#019e97] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#017a75] transition-colors shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Footer Section */}
          <div className="px-8 py-6 bg-gray-50 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="#"
                className="font-medium text-[#019e97] hover:text-[#017a75] transition-colors"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
