import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Home, User, Briefcase, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  // Simulating auth state - replace this with your actual auth logic (e.g., context, redux)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Styling for active links
  const getLinkClass = ({ isActive }) =>
    isActive
      ? "text-blue-500 font-semibold px-3 py-2 transition-colors duration-200"
      : "text-gray-600 hover:text-blue-500 px-3 py-2 transition-colors duration-200";

  return (
    <nav className="bg-white shadow-md w-full sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* LEFT: Main Nav Button / Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-blue-600 transition">
              <Home className="w-6 h-6" />
              <span>MyApp</span>
            </Link>
          </div>

          {/* CENTER: Navigation Buttons (Desktop) */}
          <div className="hidden md:flex space-x-8 items-center">
            <NavLink to="/jobs" className={getLinkClass}>
              Jobs
            </NavLink>
            <NavLink to="/dashboard" className={getLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/about" className={getLinkClass}>
              About
            </NavLink>
          </div>

          {/* RIGHT: Login/Logout Buttons (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">Welcome, User</span>
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <Link to="/login">
                  <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition duration-200">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU (Dropdown) */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
            <NavLink 
              to="/jobs" 
              className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-2"><Briefcase className="w-4 h-4"/> Jobs</div>
            </NavLink>
            
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-2"><LayoutDashboard className="w-4 h-4"/> Dashboard</div>
            </NavLink>

            {/* Mobile Auth Section */}
            <div className="border-t border-gray-200 mt-4 pt-4 pb-2">
              {isLoggedIn ? (
                <div className="space-y-2 px-3">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <User className="w-5 h-5" />
                    <span>Welcome, User</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsLoggedIn(false);
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-red-600 font-medium hover:bg-red-50 rounded-md"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2 px-3">
                  <Link 
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;