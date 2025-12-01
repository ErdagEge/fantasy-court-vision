import React, { useState, useMemo } from 'react';
import { Search, BarChart3 } from 'lucide-react';
import PuntControls from './components/PuntControls';
import PlayerTable from './components/PlayerTable';
import rawData from './data/nba_stats.json';
import { processPlayerData } from './utils/fantasyLogic';

function App() {
  const [puntedCategories, setPuntedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Process data based on punted categories (memoized for performance)
  const rankedPlayers = useMemo(() => {
    return processPlayerData(rawData, puntedCategories);
  }, [puntedCategories]);

  // 2. Filter by search query
  const filteredPlayers = useMemo(() => {
    if (!searchQuery) return rankedPlayers;
    const lowerQuery = searchQuery.toLowerCase();
    return rankedPlayers.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.team.toLowerCase().includes(lowerQuery)
    );
  }, [rankedPlayers, searchQuery]);

  const togglePunt = (category) => {
    setPuntedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-emerald-500/30">

      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-emerald-500 to-teal-400 p-2 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                  Fantasy Lab
                </h1>
                <p className="text-xs text-slate-500 hidden sm:block">Strategic Roster Analyzer & Punt Tool</p>
              </div>
            </div>
            <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 flex flex-col items-end">
               <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Season</span>
               <span className="text-emerald-400 font-bold">{rawData.meta.season}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Punt Controls */}
        <PuntControls puntedCategories={puntedCategories} togglePunt={togglePunt} />

        {/* Search Bar */}
        <div className="relative mb-6 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-lg"
            placeholder="Search NBA players or teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Results Table */}
        <PlayerTable players={filteredPlayers} puntedCategories={puntedCategories} />

        <footer className="mt-12 text-center text-slate-600 text-sm pb-8">
           Data Last Updated: {rawData.meta.last_updated}
        </footer>
      </main>
    </div>
  );
}

export default App;
