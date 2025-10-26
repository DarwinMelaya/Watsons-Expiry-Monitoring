import { useState } from "react";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    // TODO: Implement login logic here
    console.log("Login attempt:", formData);
    toast.success("Login successful!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#019e97]">
      <div className="w-full max-w-md px-6 py-8">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-[#019e97] px-8 py-6 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
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
              className="w-full bg-[#019e97] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#017a75] transition-colors shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-transform duration-200"
            >
              Sign In
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
