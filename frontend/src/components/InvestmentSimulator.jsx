import React from 'react';

const InvestmentSimulator = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Column 1: The Input Form */}
      <div className="lg:col-span-1 bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <form>
          <h2 className="text-2xl font-bold mb-6 text-slate-800">Your Financial Snapshot</h2>
          <div className="mb-4">
            <label className="block text-slate-700 font-medium mb-2">Initial Investment ($)</label>
            <input type="number" name="initialInvestment" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <hr className="my-8"/>
          <h2 className="text-2xl font-bold mb-6 text-indigo-600">'What If' Scenario</h2>
          <div className="mb-4">
            <label className="block text-slate-700 font-medium mb-2">New Monthly Contribution ($)</label>
            <input type="number" name="whatIfMonthlyContribution" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors duration-300">
            Run Simulation
          </button>
        </form>
      </div>
      {/* Column 2: The Results and Chart */}
      <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Projection Results</h2>
        <div className="h-96">
          <p className="text-center text-slate-500 pt-16">
            Enter your details and run the simulation to see your projection.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvestmentSimulator;