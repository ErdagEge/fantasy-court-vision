import React, { useState, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';

export default function TeamSearch({ allPlayers, onSelect, myTeamIds }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!query) return [];
    const lower = query.toLowerCase();
    // Filter out players already in the team
    return allPlayers
      .filter(p => !myTeamIds.includes(p.id))
      .filter(p => p.name.toLowerCase().includes(lower) || p.team.toLowerCase().includes(lower))
      .slice(0, 8); // Limit results
  }, [query, allPlayers, myTeamIds]);

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-8 z-20">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-lg"
          placeholder="Add player to roster..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)} // Delay to allow click
        />
      </div>

      {/* Dropdown Results */}
      {isOpen && query && filtered.length > 0 && (
        <div className="absolute w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <ul>
            {filtered.map(player => (
              <li key={player.id}>
                <button
                  onClick={() => {
                    onSelect(player);
                    setQuery('');
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-700 transition-colors text-left group"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-200 group-hover:text-emerald-400 transition-colors">{player.name}</span>
                    <span className="text-xs text-slate-500">{player.team} • {player.gp} GP</span>
                  </div>
                  <Plus className="h-5 w-5 text-slate-500 group-hover:text-emerald-400" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isOpen && query && filtered.length === 0 && (
        <div className="absolute w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-4 text-center text-slate-500">
          No available players found.
        </div>
      )}
    </div>
  );
}
