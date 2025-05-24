import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-700 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Left Section */}
          <div className="w-full md:w-1/3 space-y-4">
            <h2 className="text-2xl font-bold text-indigo-600">
              Productivity Suite
            </h2>
            <p className="text-lg">
              Your all-in-one productivity suite to help you achieve more in
              less time.
            </p>
          </div>

          {/* Right Section */}
          <div className="w-full md:w-1/3 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/app/pomodoro-timer" className="hover:text-indigo-600 transition">
                    Pomodoro Timer
                  </Link>
                </li>
                <li>
                  <Link to="/app/todo-list" className="hover:text-indigo-600 transition">
                    To-Do List
                  </Link>
                </li>
                <li>
                  <Link to="/app/notes" className="hover:text-indigo-600 transition">
                    Notes
                  </Link>
                </li>
                <li>
                  <Link to="/app/budget-tracker" className="hover:text-indigo-600 transition">
                    Budget Tracker
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Account</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/signin" className="hover:text-indigo-600 transition">
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="hover:text-indigo-600 transition">
                    Sign up
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-10 border-t pt-6 text-center text-sm text-gray-500">
          <p>© 2025 Productivity Suite. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
