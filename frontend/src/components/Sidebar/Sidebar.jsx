import { LayoutDashboard, BarChart3 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      icon: LayoutDashboard,
      text: "Dashboard",
      path: "/dashboard",
      isActive: location.pathname === "/dashboard",
    },
    {
      icon: BarChart3,
      text: "Monitoring",
      path: "/monitoring",
      isActive: location.pathname === "/monitoring",
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (typeof onNavigate === "function") onNavigate();
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to login page
    navigate("/login");
    if (typeof onNavigate === "function") onNavigate();
  };

  return (
    <div className="bg-[#019e97] h-screen w-64 flex flex-col">
      {/* Logo - Fixed at top */}
      <div className="p-6 border-b border-[#019e97]/20 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white">
            <span className="text-sm font-bold text-[#019e97]">W</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold">
              <span className="text-white">WATSONS</span>
            </h1>
            <p className="text-xs text-white/80">Expiry Monitoring</p>
          </div>
        </div>
        {/* Close button for mobile */}
        {onNavigate && (
          <button
            onClick={onNavigate}
            className="absolute top-3 right-3 text-white hover:text-white/80 transition-colors md:hidden"
            aria-label="Close menu"
          >
            <svg
              width="20"
              height="20"
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
      </div>

      {/* Navigation Items - Scrollable */}
      <nav
        className="flex-1 overflow-y-auto p-6 space-y-4"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#019e97/30 #019e97",
        }}
      >
        <style>{`
          nav::-webkit-scrollbar {
            width: 6px;
          }
          nav::-webkit-scrollbar-track {
            background: #019e97;
            border-radius: 3px;
          }
          nav::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 3px;
            transition: background 0.2s ease;
          }
          nav::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.5);
          }
          nav::-webkit-scrollbar-corner {
            background: #019e97;
          }
        `}</style>

        {navigationItems.map((item, index) => (
          <div
            key={index}
            onClick={() => handleNavigation(item.path)}
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors relative ${
              item.isActive
                ? "text-white bg-white/20"
                : "text-white/80 hover:bg-white/10"
            }`}
          >
            <div className="flex items-center space-x-3">
              <item.icon
                size={20}
                className={item.isActive ? "text-white" : "text-white/80"}
              />
              <span
                className={
                  item.isActive ? "text-white font-medium" : "text-white/80"
                }
              >
                {item.text}
              </span>
            </div>

            {/* Active indicator bar */}
            {item.isActive && (
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-l-full"></div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer Section */}
      <div className="border-t border-white/20 p-4 flex-shrink-0">
        <p className="text-xs text-white/60 text-center">
          © {new Date().getFullYear()} Watsons
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
