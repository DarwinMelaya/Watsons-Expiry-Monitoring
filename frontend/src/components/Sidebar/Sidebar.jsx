import { LayoutDashboard, BarChart3, Settings, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = ({ onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

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
    {
      icon: Settings,
      text: "Maintenance",
      path: "/maintenance",
      isActive: location.pathname === "/maintenance",
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (typeof onNavigate === "function") onNavigate();
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    if (typeof onNavigate === "function") onNavigate();
  };

  return (
    <div className="bg-[#019e97] h-screen w-64 flex flex-col">
      {/* Logo - Fixed at top */}
      <div className="p-4 sm:p-6 border-b border-[#019e97]/20 flex-shrink-0 relative">
        <div className="flex items-center justify-center">
          <img
            src="/logo.png"
            alt="Watsons Logo"
            className="h-12 sm:h-16 w-auto object-contain"
            style={{ maxWidth: "100%" }}
          />
        </div>
        {/* Close button for mobile */}
        {onNavigate && (
          <button
            onClick={onNavigate}
            className="absolute top-2 right-2 text-white hover:text-white/80 transition-colors md:hidden bg-white/10 hover:bg-white/20 rounded-lg p-1.5"
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

      {/* User Info and Logout */}
      <div className="border-t border-white/20 p-4 flex-shrink-0">
        {user && (
          <div className="mb-3">
            <p className="text-sm text-white/80">Welcome,</p>
            <p className="text-sm font-medium text-white">{user.username}</p>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>

        <p className="text-xs text-white/60 text-center mt-3">
          © {new Date().getFullYear()} Watsons
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
