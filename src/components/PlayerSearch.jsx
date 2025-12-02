import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Check } from 'lucide-react';
import clsx from 'clsx';

export default function PlayerSearch({ allPlayers, onAddPlayer, rosterIds }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const filtered = query.length < 2 ? [] : allPlayers.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 10); // Limit to 10 results

  return (
    <div className="relative w-full max-w-xl mx-auto mb-8" ref={wrapperRef}>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-lg"
          placeholder="Search to add players to your team..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {isOpen && filtered.length > 0 && (
        <ul className="absolute z-40 w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar">
          {filtered.map(player => {
            const isAdded = rosterIds.includes(player.id);
            return (
              <li key={player.id}>
                <button
                  onClick={() => {
                    if (!isAdded) {
                      onAddPlayer(player);
                      setQuery('');
                      setIsOpen(false);
                    }
                  }}
                  disabled={isAdded}
                  className={clsx(
                    "w-full text-left px-4 py-3 flex items-center justify-between group transition-colors",
                    isAdded ? "opacity-50 cursor-default" : "hover:bg-slate-700"
                  )}
                >
                  <div>
                    <div className="font-medium text-white">{player.name}</div>
                    <div className="text-xs text-slate-500">{player.team} • {player.gp} GP</div>
                  </div>
                  {isAdded ? (
                    <span className="text-emerald-500 text-xs flex items-center gap-1 font-semibold">
                      <Check className="h-4 w-4" /> Added
                    </span>
                  ) : (
                    <Plus className="h-4 w-4 text-slate-500 group-hover:text-emerald-400" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
