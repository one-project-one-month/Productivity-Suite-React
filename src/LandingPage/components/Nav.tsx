import { useState } from 'react';
import { Link } from 'react-router';
import { X, Menu } from "lucide-react";

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r p-4">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-purple-600">Productivity Suite</Link>

        {/* Right: Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-black hover:text-blue-500">
            Home
          </Link>
          <Link to="/app/pomodoro-timer" className="text-black hover:text-blue-500">
            Pomodoro
          </Link>
          <Link to="/app/todo-list" className="text-black hover:text-blue-500">
            To-Do List
          </Link>
          <Link to="/app/notes" className="text-black hover:text-blue-500">
            Notes
          </Link>
          <Link to="/app/budget-tracker" className="text-black hover:text-blue-500">
            Budget
          </Link>
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
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          className={`fixed top-0 right-0 h-full w-3/4 bg-white p-6 transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-z-0" : "translate-z-full"
          }`}
          onClick={(e) => e.stopPropagation()} // prevent click from closing when tapping inside
        >
          <div className="flex justify-end mb-6">
            <button onClick={() => setIsMenuOpen(false)}>
              <X className="text-black transition-transform duration-200 hover:scale-110 active:scale-95" />
            </button>
          </div>

          <div className="flex flex-col space-y-6">
            <Link to="/" className="text-lg text-black">Home</Link>
            <Link to="/pomodoro" className="text-lg text-black">Pomodoro</Link>
            <Link to="/to-do-list" className="text-lg text-black">To-Do List</Link>
            <Link to="/notes" className="text-lg text-black">Notes</Link>
            <Link to="/budget" className="text-lg text-black">Budget</Link>
            <Link to="/login">
              <button className="w-full border border-gray-300 text-black py-2 rounded cursor-pointer">
                Log in
              </button>
            </Link>
            <Link to="/signup">
              <button className="w-full bg-purple-600 text-white py-2 rounded cursor-pointer">
                Sign up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
