import React from "react";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-800 to-neutral-900 text-white flex items-center justify-center">
      <div className="text-center max-w-2xl px-6">
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          VAPT Report Generator
        </h1>

        <p className="text-lg md:text-xl text-slate-300 mb-8">
          Generate professional Vulnerability Assessment & Penetration Testing
          reports in minutes — fast, accurate, and ready for clients.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition font-medium">
            Get Started
          </button>

          <button className="px-6 py-3 rounded-lg border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition font-medium">
            Learn More
          </button>
        </div>

      </div>
    </div>
  );
};

export default App;