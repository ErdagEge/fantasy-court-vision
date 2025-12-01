import React from 'react';
import clsx from 'clsx';
import { CATEGORIES } from '../utils/fantasyLogic';
import { X } from 'lucide-react';

const getHeatmapColor = (zScore) => {
  if (zScore > 2.0) return 'bg-emerald-500 text-white'; // Elite
  if (zScore > 1.0) return 'bg-emerald-400/80 text-white'; // Great
  if (zScore > 0.5) return 'bg-emerald-500/40 text-emerald-100'; // Good
  if (zScore > 0.0) return 'bg-emerald-900/40 text-emerald-200'; // Above Average
  if (zScore > -0.5) return 'bg-rose-900/30 text-rose-200'; // Below Average
  if (zScore > -1.5) return 'bg-rose-500/40 text-rose-100'; // Bad
  return 'bg-rose-500 text-white'; // Terrible
};

// Helper to format number
const fmt = (num, decimals = 1) => Number(num).toFixed(decimals);

export default function PlayerTable({ players, puntedCategories }) {
  return (
    <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs text-slate-400 uppercase bg-slate-900/50 sticky top-0">
            <tr>
              <th scope="col" className="px-4 py-3 font-bold">Rank</th>
              <th scope="col" className="px-4 py-3 font-bold">Player</th>
              {Object.keys(CATEGORIES).map(cat => (
                <th
                  key={cat}
                  scope="col"
                  className={clsx(
                    "px-2 py-3 text-center min-w-[60px]",
                    puntedCategories.includes(cat) && "opacity-40 decoration-line-through"
                  )}
                >
                  {CATEGORIES[cat]}
                </th>
              ))}
              <th scope="col" className="px-4 py-3 font-bold text-center text-white bg-slate-900">Total</th>
            </tr>
          </thead>
          <tbody>
            {players.length > 0 ? (
              players.map((player, index) => (
                <tr key={player.id} className="border-b border-slate-700/50 hover:bg-slate-700/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-slate-500">#{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-white">
                    <div className="flex flex-col">
                      <span>{player.name}</span>
                      <span className="text-xs text-slate-500">{player.team} • {player.gp} GP</span>
                    </div>
                  </td>
                  {Object.keys(CATEGORIES).map(cat => {
                    const z = player.zScores[cat];
                    const isPunted = puntedCategories.includes(cat);
                    const colorClass = getHeatmapColor(z);

                    return (
                      <td key={cat} className={clsx("px-1 py-3 text-center", isPunted && "opacity-30 grayscale")}>
                        <div className={clsx("rounded px-1.5 py-1 mx-auto w-14 font-medium", colorClass)}>
                          {cat === 'fg_pct' || cat === 'ft_pct' ? fmt(player[cat], 3) : fmt(player[cat], 1)}
                        </div>
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-center font-bold text-lg bg-slate-900/30 text-emerald-400">
                   {player.totalValue > 0 ? '+' : ''}{fmt(player.totalValue, 2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={12} className="text-center py-10 text-slate-500">No players found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
