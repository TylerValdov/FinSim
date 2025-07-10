import InvestmentSimulator from './components/InvestmentSimulator';

function App() {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900">
          Financial 'What If' Simulator
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
          Visualize the future impact of your financial decisions today.
        </p>
      </header>
      <main className="max-w-7xl mx-auto">
        <InvestmentSimulator />
      </main>
    </div>
  );
}

export default App;