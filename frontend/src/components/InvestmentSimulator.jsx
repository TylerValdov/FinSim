import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const InvestmentSimulator = () => {
  const [form, setForm] = useState({
    initialInvestment: 10000,
    monthlyContribution: 500,
    investmentPeriod: 20,
    annualReturn: 7,
    whatIfMonthlyContribution: 750,
    whatIfAnnualReturn: 8,
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: Number(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/investment_projection', form);
      if (response.data && response.data.baseline && response.data.whatIf) {
        setResults(response.data);
      } else {
        throw new Error("Invalid data format received from server.");
      }
    } catch (err) {
      setError('Failed to fetch data from the server. Is it running?');
      console.error("API Call failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = useMemo(() => {
    if (!results) return [];
    return Array.from({ length: form.investmentPeriod + 1 }, (_, i) => ({
        year: `Year ${i}`,
        'Baseline': results.baseline[i],
        'What If': results.whatIf[i],
      }));
  }, [results, form.investmentPeriod]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 bg-gray-800/50 border border-gray-700 p-6 sm:p-8 rounded-xl backdrop-blur-sm">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-6 text-white">Your Financial Snapshot</h2>
          <div className="mb-4">
            <label htmlFor="initialInvestment" className="block text-gray-400 font-medium mb-2 text-sm">Initial Investment ($)</label>
            <input type="number" id="initialInvestment" name="initialInvestment" value={form.initialInvestment} onChange={handleInputChange} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required />
          </div>
          <div className="mb-4">
            <label htmlFor="monthlyContribution" className="block text-gray-400 font-medium mb-2 text-sm">Monthly Contribution ($)</label>
            <input type="number" id="monthlyContribution" name="monthlyContribution" value={form.monthlyContribution} onChange={handleInputChange} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required />
          </div>
          <div className="mb-4">
            <label htmlFor="investmentPeriod" className="block text-gray-400 font-medium mb-2 text-sm">Investment Period (Years)</label>
            <input type="number" id="investmentPeriod" name="investmentPeriod" value={form.investmentPeriod} onChange={handleInputChange} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required />
          </div>
          <div className="mb-4">
            <label htmlFor="annualReturn" className="block text-gray-400 font-medium mb-2 text-sm">Expected Annual Return (%)</label>
            <input type="number" id="annualReturn" name="annualReturn" value={form.annualReturn} onChange={handleInputChange} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" step="0.1" required />
          </div>
          <hr className="my-8 border-gray-700"/>
          <h2 className="text-2xl font-bold mb-6 text-indigo-400">'What If' Scenario</h2>
          <div className="mb-4">
            <label htmlFor="whatIfMonthlyContribution" className="block text-gray-400 font-medium mb-2 text-sm">New Monthly Contribution ($)</label>
            <input type="number" id="whatIfMonthlyContribution" name="whatIfMonthlyContribution" value={form.whatIfMonthlyContribution} onChange={handleInputChange} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required />
          </div>
          <div className="mb-4">
            <label htmlFor="whatIfAnnualReturn" className="block text-gray-400 font-medium mb-2 text-sm">New Annual Return (%)</label>
            <input type="number" id="whatIfAnnualReturn" name="whatIfAnnualReturn" value={form.whatIfAnnualReturn} onChange={handleInputChange} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" step="0.1" required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3 mt-4 rounded-lg font-bold hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-all duration-300 disabled:bg-indigo-400/50 disabled:cursor-not-allowed">
            {loading ? 'Calculating...' : 'Run Simulation'}
          </button>
        </form>
      </div>
      <div className="lg:col-span-2 bg-gray-800/50 border border-gray-700 p-6 sm:p-8 rounded-xl backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-6 text-white">Projection Results</h2>
        <div className="w-full min-h-96">
          {loading && <p className="text-center text-gray-400 pt-16">Loading your projection...</p>}
          {error && <p className="text-center text-red-400 pt-16">{error}</p>}
          {!loading && !error && results && (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="year" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" tickFormatter={(tick) => `$${Math.round(tick / 1000)}k`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(31, 41, 55, 0.8)', // bg-gray-800 with opacity
                    borderColor: '#4b5563', // border-gray-600
                    color: '#d1d5db' // text-gray-300
                  }} 
                  formatter={(value) => `$${value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} 
                  labelStyle={{ color: '#f9fafb' }} // text-gray-50
                />
                <Legend wrapperStyle={{ color: '#d1d5db' }} />
                <Line type="monotone" dataKey="Baseline" stroke="#818cf8" strokeWidth={2} activeDot={{ r: 8, strokeWidth: 2, fill: '#4f46e5' }} dot={{ r: 4, fill: '#818cf8' }} />
                <Line type="monotone" dataKey="What If" stroke="#6ee7b7" strokeWidth={2} activeDot={{ r: 8, strokeWidth: 2, fill: '#10b981' }} dot={{ r: 4, fill: '#6ee7b7' }} />
              </LineChart>
            </ResponsiveContainer>
          )}
          {!loading && !error && !results && (
            <p className="text-center text-gray-500 pt-16">
              Enter your details and run the simulation to see your projection.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestmentSimulator;