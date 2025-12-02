import React, { useState, useMemo, useEffect } from 'react';
import { BarChart3, Users, List, FlaskConical } from 'lucide-react';
import clsx from 'clsx';
import PuntControls from './components/PuntControls';
import PlayerTable from './components/PlayerTable';
import MyTeamView from './components/MyTeamView';
import rawData from './data/nba_stats.json';
import { processPlayerData } from './utils/fantasyLogic';

function App() {
  // --- Persistence Logic ---
  const [puntedCategories, setPuntedCategories] = useState(() => {
    const saved = localStorage.getItem('fantasyLab_punt');
    return saved ? JSON.parse(saved) : [];
  });

  const [myTeamIds, setMyTeamIds] = useState(() => {
    const saved = localStorage.getItem('fantasyLab_team');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState('rankings'); // 'rankings' | 'myTeam'
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('fantasyLab_punt', JSON.stringify(puntedCategories));
  }, [puntedCategories]);

  useEffect(() => {
    localStorage.setItem('fantasyLab_team', JSON.stringify(myTeamIds));
  }, [myTeamIds]);

  // --- Logic ---

  // 1. Process all players with current punt settings
  const rankedPlayers = useMemo(() => {
    return processPlayerData(rawData, puntedCategories);
  }, [puntedCategories]);

  // 2. Derive My Team Roster from IDs
  const myTeamRoster = useMemo(() => {
    // Map IDs back to the fully processed player objects (so we get updated Z-scores)
    return myTeamIds
      .map(id => rankedPlayers.find(p => p.id === id))
      .filter(Boolean); // Filter out any not found
  }, [rankedPlayers, myTeamIds]);

  // 3. Filter for Rankings View
  const filteredRankings = useMemo(() => {
    if (!searchQuery) return rankedPlayers;
    const lowerQuery = searchQuery.toLowerCase();
    return rankedPlayers.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.team.toLowerCase().includes(lowerQuery)
    );
  }, [rankedPlayers, searchQuery]);

  // --- Handlers ---
  const togglePunt = (category) => {
    setPuntedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const addToTeam = (player) => {
    if (!myTeamIds.includes(player.id)) {
      setMyTeamIds(prev => [...prev, player.id]);
    }
  };

  const removeFromTeam = (playerId) => {
    setMyTeamIds(prev => prev.filter(id => id !== playerId));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-emerald-500/30">

      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-emerald-500 to-teal-400 p-2 rounded-lg shadow-lg shadow-emerald-500/20">
                <FlaskConical className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                  Fantasy Lab
                </h1>
                <p className="text-xs text-slate-500 hidden sm:block">Strategic Roster Analyzer & Punt Tool</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700/50">
              <button
                onClick={() => setActiveTab('rankings')}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  activeTab === 'rankings'
                    ? "bg-slate-700 text-white shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}
              >
                <List className="h-4 w-4" />
                Rankings
              </button>
              <button
                onClick={() => setActiveTab('myTeam')}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  activeTab === 'myTeam'
                    ? "bg-slate-700 text-white shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}
              >
                <Users className="h-4 w-4" />
                My Team
                {myTeamIds.length > 0 && (
                  <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {myTeamIds.length}
                  </span>
                )}
              </button>
            </div>

            <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 flex flex-col items-end hidden md:flex">
               <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Season</span>
               <span className="text-emerald-400 font-bold">{rawData.meta.season}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Punt Controls - Always Visible? Yes, affects both views */}
        <PuntControls puntedCategories={puntedCategories} togglePunt={togglePunt} />

        {activeTab === 'rankings' ? (
          <>
            {/* Search Bar */}
            <div className="relative mb-6 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <BarChart3 className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
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
            <PlayerTable players={filteredRankings} puntedCategories={puntedCategories} />
          </>
        ) : (
          /* My Team View */
          <MyTeamView
            roster={myTeamRoster}
            allPlayers={rankedPlayers}
            puntedCategories={puntedCategories}
            onAddPlayer={addToTeam}
            onRemovePlayer={removeFromTeam}
          />
        )}

        <footer className="mt-12 text-center text-slate-600 text-sm pb-8">
           Data Last Updated: {rawData.meta.last_updated}
        </footer>
      </main>
    </div>
  );
}

export default App;
