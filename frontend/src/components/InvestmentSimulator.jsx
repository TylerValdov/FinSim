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
      <div className="lg:col-span-1 bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-6 text-slate-800">Your Financial Snapshot</h2>
          <div className="mb-4">
            <label htmlFor="initialInvestment" className="block text-slate-700 font-medium mb-2">Initial Investment ($)</label>
            <input type="number" id="initialInvestment" name="initialInvestment" value={form.initialInvestment} onChange={handleInputChange} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required />
          </div>
          <div className="mb-4">
            <label htmlFor="monthlyContribution" className="block text-slate-700 font-medium mb-2">Monthly Contribution ($)</label>
            <input type="number" id="monthlyContribution" name="monthlyContribution" value={form.monthlyContribution} onChange={handleInputChange} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required />
          </div>
          <div className="mb-4">
            <label htmlFor="investmentPeriod" className="block text-slate-700 font-medium mb-2">Investment Period (Years)</label>
            <input type="number" id="investmentPeriod" name="investmentPeriod" value={form.investmentPeriod} onChange={handleInputChange} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required />
          </div>
          <div className="mb-4">
            <label htmlFor="annualReturn" className="block text-slate-700 font-medium mb-2">Expected Annual Return (%)</label>
            <input type="number" id="annualReturn" name="annualReturn" value={form.annualReturn} onChange={handleInputChange} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" step="0.1" required />
          </div>
          <hr className="my-8"/>
          <h2 className="text-2xl font-bold mb-6 text-indigo-600">'What If' Scenario</h2>
          <div className="mb-4">
            <label htmlFor="whatIfMonthlyContribution" className="block text-slate-700 font-medium mb-2">New Monthly Contribution ($)</label>
            <input type="number" id="whatIfMonthlyContribution" name="whatIfMonthlyContribution" value={form.whatIfMonthlyContribution} onChange={handleInputChange} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required />
          </div>
          <div className="mb-4">
            <label htmlFor="whatIfAnnualReturn" className="block text-slate-700 font-medium mb-2">New Annual Return (%)</label>
            <input type="number" id="whatIfAnnualReturn" name="whatIfAnnualReturn" value={form.whatIfAnnualReturn} onChange={handleInputChange} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" step="0.1" required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors duration-300 disabled:bg-indigo-400 disabled:cursor-not-allowed">
            {loading ? 'Calculating...' : 'Run Simulation'}
          </button>
        </form>
      </div>
      <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Projection Results</h2>
        {/* --- REVISED RENDERING LOGIC --- */}
        <div className="w-full min-h-96">
          {loading && <p className="text-center text-slate-500 pt-16">Loading your projection...</p>}
          {error && <p className="text-center text-red-500 pt-16">{error}</p>}
          {!loading && !error && results && (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(tick) => `$${Math.round(tick / 1000)}k`} />
                <Tooltip formatter={(value) => `$${value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} />
                <Legend />
                <Line type="monotone" dataKey="Baseline" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="What If" stroke="#82ca9d" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
          {!loading && !error && !results && (
            <p className="text-center text-slate-500 pt-16">
              Enter your details and run the simulation to see your projection.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestmentSimulator;