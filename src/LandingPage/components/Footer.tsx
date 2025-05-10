const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-700 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="md:w-1/4 lg:w-1/3 space-y-4">
            <h2 className="text-2xl font-bold text-indigo-600">FlowFocus</h2>
            <p className="text-lg">
              Your all-in-one productivity suite to help you achieve more in
              less time.
            </p>
          </div>

          <div className="md:w-3/4 lg:w-2/3 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-indigo-600 transition">
                    Pomodoro Timer
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-600 transition">
                    To-Do List
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-600 transition">
                    Notes
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-600 transition">
                    Budget Tracker
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Account</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-indigo-600 transition">
                    Log In
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-600 transition">
                    Sign Up
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Help</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-indigo-600 transition">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-600 transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-600 transition">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-sm text-gray-500">
          <p>© 2025 FlowFocus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
