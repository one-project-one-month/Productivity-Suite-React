import { Link } from "react-router";

const tools = [
  {
    icon: (
      <svg
        className="w-8 h-8 text-indigo-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M12 8v4l3 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
      </svg>
    ),
    title: 'Pomodoro Timer',
    description:
      'Focus better with time blocks and scheduled breaks to maximize productivity.',
    color: 'indigo',
    slug: 'pomodoro-timer',
  },
  {
    icon: (
      <svg
        className="w-8 h-8 text-blue-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M9 12h6m-6 4h6M4 6h16M4 6l2 14h12l2-14" />
      </svg>
    ),
    title: 'To-Do List',
    description:
      'Organize tasks by priority and keep track of your daily progress.',
    color: 'blue',
    slug: 'todo-list',
  },
  {
    icon: (
      <svg
        className="w-8 h-8 text-green-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M4 6h16M4 10h16M4 14h10M4 18h10" />
      </svg>
    ),
    title: 'Notes',
    description:
      'Capture your ideas and important information in one accessible place.',
    color: 'green',
    slug: 'notes',
  },
  {
    icon: (
      <svg
        className="w-8 h-8 text-yellow-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2m0-6v6m0 4v2m6-6a6 6 0 11-12 0 6 6 0 0112 0z" />
      </svg>
    ),
    title: 'Budget Tracker',
    description:
      'Manage your finances with easy tracking of income and expenses.',
    color: 'yellow',
    slug: 'budget-tracker',
  },
];
const ToolsSection = () => {
  return (
    <section className="bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-12">
          All the tools you need in one place
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 p-6 text-left shadow-sm hover:shadow-2xl transition 
                        w-full max-w-xs sm:max-w-sm max-h-[500px] sm:max-h-[400px] overflow-auto mx-auto"
            >
              <div className="mb-4">{tool.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{tool.title}</h3>
              <p className="text-gray-600 mb-4">{tool.description}</p>
              <Link
                to={`/app/${tool.slug}`}
                className={`text-${tool.color}-500 font-medium hover:underline mt-auto`}
              >
                Learn more →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;
