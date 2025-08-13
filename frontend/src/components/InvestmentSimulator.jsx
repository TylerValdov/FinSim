import React, { useState, useMemo } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { theme } from '../theme';

const InputField = ({ label, name, value, onChange, type = "text", step, min, max, placeholder }) => (
  <div className="w-full max-w-md">
    <label htmlFor={name} className="block text-sm font-semibold text-gray-400 mb-1">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      step={step}
      min={min}
      max={max}
      placeholder={placeholder}
      className="
        w-full
        rounded-lg
        bg-[#171c25]
        border
        border-[#2c2f3a]
        text-[#e0e7ff]
        placeholder-[#64748b]
        px-4 py-3
        focus:outline-none
        focus:ring-2 focus:ring-indigo-500
        focus:border-indigo-500
        transition
        duration-300
        shadow-sm
        hover:shadow-md
      "
      inputMode={type === "number" ? "numeric" : undefined}
    />
  </div>
);




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
  const [showSidebar, setShowSidebar] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/investment_projection', form);
      if (response.data?.baseline && response.data?.whatIf) {
        setResults(response.data);
      } else {
        throw new Error("Invalid data format");
      }
    } catch {
      setError('Failed to fetch data from the server. Is it running?');
    } finally {
      setLoading(false);
    }
  };

  const chartData = useMemo(() => {
    if (!results) return [];
    return Array.from({ length: form.investmentPeriod + 1 }, (_, i) => ({
      year: `Year ${i}`,
      Baseline: results.baseline[i],
      'What If': results.whatIf[i],
    }));
  }, [results, form.investmentPeriod]);

  const finalBaseline = results?.baseline?.slice(-1)[0] ?? null;
  const finalWhatIf = results?.whatIf?.slice(-1)[0] ?? null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar */}
      {showSidebar && (
        <aside
          className={`${theme.spacing.panelPadding} ${theme.rounded} bg-gray-900 lg:col-span-1 space-y-6`}
          style={{ border: `1px solid ${theme.colors.border}` }}
        >
<form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
  <h2 className="text-3xl font-extrabold text-[#e0e7ff] mb-6">Your Financial Snapshot</h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    <InputField
      label="Initial Investment ($)"
      name="initialInvestment"
      type="number"
      value={form.initialInvestment}
      onChange={handleInputChange}
      min={0}
    />
    <InputField
      label="Monthly Contribution ($)"
      name="monthlyContribution"
      type="number"
      value={form.monthlyContribution}
      onChange={handleInputChange}
      min={0}
    />
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    <InputField
      label="Investment Period (Years)"
      name="investmentPeriod"
      type="number"
      value={form.investmentPeriod}
      onChange={handleInputChange}
      min={1}
      max={100}
    />
    <InputField
      label="Expected Annual Return (%)"
      name="annualReturn"
      type="number"
      value={form.annualReturn}
      onChange={handleInputChange}
      step="0.1"
      min={0}
      max={100}
    />
  </div>

  <hr className="border-[#2c2f3a]" />

  <h2 className="text-3xl font-extrabold text-[#14b8a6] mb-6">'What If' Scenario</h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    <InputField
      label="New Monthly Contribution ($)"
      name="whatIfMonthlyContribution"
      type="number"
      value={form.whatIfMonthlyContribution}
      onChange={handleInputChange}
      min={0}
    />
    <InputField
      label="New Annual Return (%)"
      name="whatIfAnnualReturn"
      type="number"
      value={form.whatIfAnnualReturn}
      onChange={handleInputChange}
      step="0.1"
      min={0}
      max={100}
    />
  </div>

  <button
    type="submit"
    disabled={loading}
    className="
      mt-8
      w-full
      max-w-md
      py-3
      rounded-full
      bg-gradient-to-r from-indigo-600 to-cyan-500
      text-white
      font-bold
      hover:from-indigo-500 hover:to-cyan-400
      focus:outline-none
      focus:ring-4 focus:ring-cyan-400/50
      transition
      duration-300
      disabled:opacity-50
      disabled:cursor-not-allowed
    "
  >
    {loading ? 'Calculating...' : 'Run Simulation'}
  </button>
</form>


        </aside>
      )}

      {/* Main Content */}
      <section className="lg:col-span-3 flex flex-col space-y-6">
        {/* Summary Cards */}
        {results && (
          <div className="grid grid-cols-2 gap-4">
            <div
              className={`${theme.spacing.panelPadding} ${theme.rounded} bg-gray-900`}
              style={{ border: `1px solid ${theme.colors.border}` }}
            >
              <h3 className="text-sm" style={{ color: theme.colors.subtext }}>Baseline Final Value</h3>
              <p className="text-2xl font-bold text-cyan-400">
                {finalBaseline ? `$${finalBaseline.toLocaleString()}` : '-'}
              </p>
            </div>
            <div
              className={`${theme.spacing.panelPadding} ${theme.rounded} bg-gray-900`}
              style={{ border: `1px solid ${theme.colors.border}` }}
            >
              <h3 className="text-sm" style={{ color: theme.colors.subtext }}>"What If" Final Value</h3>
              <p className="text-2xl font-bold text-green-400">
                {finalWhatIf ? `$${finalWhatIf.toLocaleString()}` : '-'}
              </p>
            </div>
          </div>
        )}

        {/* Chart Panel */}
        <div
          className={`${theme.spacing.panelPadding} ${theme.rounded} bg-gray-900 flex-1`}
          style={{ border: `1px solid ${theme.colors.border}` }}
        >
          <h2 className="text-lg font-semibold text-cyan-400 mb-4">Projection Results</h2>
          <div className="w-full min-h-[400px]">
            {loading && <p className="text-center text-gray-400 pt-16 animate-pulse">Loading projection...</p>}
            {error && <p className="text-center text-red-400 pt-16">{error}</p>}
            {!loading && !error && results && (
              <ResponsiveContainer width="100%" height={360}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis dataKey="year" stroke={theme.colors.subtext} />
                  <YAxis stroke={theme.colors.subtext} tickFormatter={(tick) => `$${Math.round(tick / 1000)}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.colors.panel,
                      borderColor: theme.colors.border,
                      color: theme.colors.text
                    }}
                    formatter={(value) => `$${value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend wrapperStyle={{ color: theme.colors.text }} />
                  <Line type="monotone" dataKey="Baseline" stroke={theme.colors.accent2} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="What If" stroke={theme.colors.accent1} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
            {!loading && !error && !results && (
              <p className="text-center text-gray-500 pt-16">Enter your details and run the simulation.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default InvestmentSimulator;
