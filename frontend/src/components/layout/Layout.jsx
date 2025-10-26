import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";

const Layout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const closeMobile = () => setIsMobileOpen(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white md:hidden">
        <button
          aria-label="Open menu"
          className="text-[#019e97] focus:outline-none"
          onClick={() => setIsMobileOpen(true)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 6H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M3 12H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M3 18H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <h1 className="text-[#019e97] font-semibold">Watsons</h1>
        <div className="w-6" />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:block fixed left-0 top-0 h-screen z-50">
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50 md:hidden"
            onClick={closeMobile}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-64 md:hidden">
            <Sidebar onNavigate={closeMobile} />
          </div>
        </>
      )}

      <main className="flex-1 min-h-screen md:ml-64 pt-14 md:pt-0 px-4 md:px-0 w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
