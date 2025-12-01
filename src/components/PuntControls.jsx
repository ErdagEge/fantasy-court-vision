import React from 'react';
import clsx from 'clsx';
import { CATEGORIES } from '../utils/fantasyLogic';

export default function PuntControls({ puntedCategories, togglePunt }) {
  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-6 border border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-emerald-400">🛡️</span> Punt Strategy Configuration
        </h2>
        <button
          onClick={() => puntedCategories.length > 0 && puntedCategories.forEach(cat => togglePunt(cat))}
          className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
        >
          Reset All
        </button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
        {Object.keys(CATEGORIES).map((cat) => {
          const isPunted = puntedCategories.includes(cat);
          return (
            <button
              key={cat}
              onClick={() => togglePunt(cat)}
              className={clsx(
                "flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200",
                !isPunted
                  ? "bg-slate-700 border-emerald-500/50 hover:bg-slate-600"
                  : "bg-slate-900 border-slate-700 opacity-60 hover:opacity-80"
              )}
            >
              <span className={clsx("font-bold text-lg", !isPunted ? "text-white" : "text-slate-500")}>
                {CATEGORIES[cat]}
              </span>
              <span className={clsx(
                "text-xs px-2 py-0.5 rounded-full mt-1 font-semibold",
                !isPunted ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-500"
              )}>
                {!isPunted ? 'ACTIVE' : 'PUNTED'}
              </span>
            </button>
          );
        })}
      </div>
      <p className="text-slate-400 text-sm mt-4 flex items-center gap-2">
        <span className="text-slate-500">ℹ️</span>
        Uncheck categories to "Punt" them. This removes them from the Total Value calculation, re-ranking your players.
      </p>
    </div>
  );
}
