import { useState } from 'react';
import { Link } from 'react-router';
import { X, Menu, ChevronDown, ChevronUp } from "lucide-react";
import { useAuthDataStore } from '@/store/useAuthStore';

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuthDataStore();

  return (
    <nav className="bg-gradient-to-r p-4">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-purple-600">
          Productivity Suite
        </Link>

        {/* Right: Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-black hover:text-blue-500">
            Home
          </Link>
          <Link
            to="/app/pomodoro-timer"
            className="text-black hover:text-blue-500"
          >
            Pomodoro
          </Link>
          <Link to="/app/todo-list" className="text-black hover:text-blue-500">
            To-Do List
          </Link>
          <Link to="/app/notes" className="text-black hover:text-blue-500">
            Notes
          </Link>
          <Link
            to="/app/budget-tracker"
            className="text-black hover:text-blue-500"
          >
            Budget
          </Link>
          
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                {isProfileOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium text-gray-900">{user.username}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <Link 
                    to="/settings" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsProfileOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/signin">
                <button className="border border-gray-300 px-4 py-1 rounded hover:border-purple-600 cursor-pointer">
                  Sign in
                </button>
              </Link>
              <Link to="/signup">
                <button className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700 cursor-pointer">
                  Sign up
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(true)}>
            <Menu className="text-black" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-50 bg-opacity-40 transition-opacity ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          className={`fixed top-0 right-0 h-full w-3/4 bg-white p-6 transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-end mb-6">
            <button onClick={() => setIsMenuOpen(false)}>
              <X className="text-black transition-transform duration-200 hover:scale-110 active:scale-95" />
            </button>
          </div>

          <div className="flex flex-col space-y-6">
            <Link to="/" className="text-lg text-black" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/app/pomodoro-timer" className="text-lg text-black" onClick={() => setIsMenuOpen(false)}>Pomodoro</Link>
            <Link to="/app/todo-list" className="text-lg text-black" onClick={() => setIsMenuOpen(false)}>To-Do List</Link>
            <Link to="/app/notes" className="text-lg text-black" onClick={() => setIsMenuOpen(false)}>Notes</Link>
            <Link to="/app/budget-tracker" className="text-lg text-black" onClick={() => setIsMenuOpen(false)}>Budget</Link>
            
            {user ? (
              <>
                <div className="border-t pt-4">
                  <p className="text-lg font-medium">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <Link to="/settings" className="text-lg text-black" onClick={() => setIsMenuOpen(false)}>Settings</Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left text-lg text-black"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/signin">
                  <button className="w-full border border-gray-300 text-black py-2 rounded cursor-pointer">
                    Sign in
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="w-full bg-purple-600 text-white py-2 rounded cursor-pointer">
                    Sign up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
