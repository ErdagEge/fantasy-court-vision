import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import PuntControls from '../components/PuntControls';
import PlayerTable from '../components/PlayerTable';
import rawData from '../data/nba_stats.json';
import { processPlayerData } from '../utils/fantasyLogic';

export default function Rankings({ puntedCategories, togglePunt }) {
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

  return (
    <>
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
    </>
  );
}
