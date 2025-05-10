const Hero = () => {
  return (
    <section className="min-h-110 bg-gradient-to-r from-indigo-600 to-sky-400 flex items-center justify-center text-white px-4">
      <div className="text-center max-w-3xl w-full">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
          Focus Better.<br />Achieve More.
        </h1>
        <p className="text-lg sm:text-xl mb-8">
          Your all-in-one productivity suite that helps you manage time, tasks, notes, and finances effectively.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-white text-indigo-600 px-6 py-3 rounded-md font-medium hover:bg-indigo-100">
            Get Started Free
          </button>
          <button className="bg-white text-indigo-600 px-6 py-3 rounded-md font-medium hover:bg-indigo-100">
            Log In
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
