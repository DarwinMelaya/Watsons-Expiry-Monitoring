import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = ({ onNavigate }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Monitoring", path: "/monitoring" },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <div className="h-screen w-64 bg-white shadow-xl relative">
      {/* Header Section */}
      <div className="bg-[#019e97] px-6 py-6 text-center relative">
        {/* Close button for mobile */}
        {onNavigate && (
          <button
            onClick={onNavigate}
            className="absolute top-3 right-3 text-white hover:text-gray-200 transition-colors md:hidden"
            aria-label="Close menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
        <h2 className="text-2xl font-bold text-white">Watsons</h2>
        <p className="text-white/90 text-xs">Expiry Monitoring</p>
      </div>

      {/* Navigation Section */}
      <nav className="mt-4 px-4 space-y-2">
        {menuItems.map((item) => {
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                active
                  ? "bg-[#019e97] text-white shadow-lg transform scale-[1.02]"
                  : "text-gray-700 hover:bg-gray-100 hover:text-[#019e97]"
              }`}
            >
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-gray-50 text-center">
        <p className="text-xs text-gray-600">© 2024 Watsons</p>
      </div>
    </div>
  );
};

export default Sidebar;
