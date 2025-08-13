import InvestmentSimulator from './components/InvestmentSimulator';

function App() {
  return (
    <div className="min-h-screen bg-[#121620] text-[#e0e7ff] font-sans px-6 py-10">
      <header className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
          Financial 'What If' Simulator
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Visualize the future impact of your financial decisions with a professional-grade tool.
        </p>
      </header>

      <main className="max-w-4xl mx-auto bg-[#171c25] p-10 rounded-xl shadow-lg backdrop-blur-md">
        <InvestmentSimulator />
      </main>
    </div>
  );
}

export default App;
