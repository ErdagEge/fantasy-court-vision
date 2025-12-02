import React from 'react';
import clsx from 'clsx';
import { Trash2 } from 'lucide-react';
import { CATEGORIES } from '../utils/fantasyLogic';

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

export default function RosterTable({ roster, puntedCategories, onRemovePlayer }) {

  // Calculate Team Averages
  const teamAverages = {};
  let teamTotalValue = 0;

  if (roster.length > 0) {
    Object.keys(CATEGORIES).forEach(cat => {
      // Sum z-scores for this category
      const sumZ = roster.reduce((acc, p) => acc + p.zScores[cat], 0);
      const avgZ = sumZ / roster.length;
      teamAverages[cat] = avgZ;

      if (!puntedCategories.includes(cat)) {
        teamTotalValue += avgZ;
      }
    });
  }

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs text-slate-400 uppercase bg-slate-900/50">
            <tr>
              <th scope="col" className="px-4 py-3 font-bold w-12">Action</th>
              <th scope="col" className="px-4 py-3 font-bold min-w-[150px]">Player</th>
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
            {roster.length > 0 ? (
              <>
                {roster.map((player) => (
                  <tr key={player.id} className="border-b border-slate-700/50 hover:bg-slate-700/50 transition-colors">
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => onRemovePlayer(player.id)}
                        className="text-slate-500 hover:text-rose-500 transition-colors p-1"
                        title="Remove from team"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                    <td className="px-4 py-3 font-medium text-white">
                      <div className="flex flex-col">
                        <span>{player.name}</span>
                        <span className="text-xs text-slate-500">{player.team}</span>
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
                ))}

                {/* Team Averages Row */}
                <tr className="bg-slate-900/80 border-t-2 border-slate-700 font-bold text-white">
                    <td colSpan={2} className="px-4 py-4 text-right uppercase text-xs tracking-wider text-slate-400">
                        Team Z-Score Avg
                    </td>
                    {Object.keys(CATEGORIES).map(cat => {
                        const z = teamAverages[cat];
                        const isPunted = puntedCategories.includes(cat);
                        const colorClass = getHeatmapColor(z);
                        return (
                            <td key={cat} className={clsx("px-1 py-4 text-center", isPunted && "opacity-30 grayscale")}>
                                <div className={clsx("rounded px-1.5 py-1 mx-auto w-14", colorClass)}>
                                    {z > 0 ? '+' : ''}{fmt(z, 2)}
                                </div>
                            </td>
                        )
                    })}
                     <td className="px-4 py-4 text-center text-xl bg-emerald-900/20 text-emerald-400">
                        {teamTotalValue > 0 ? '+' : ''}{fmt(teamTotalValue, 2)}
                    </td>
                </tr>
              </>
            ) : (
              <tr>
                <td colSpan={12} className="text-center py-16">
                  <div className="flex flex-col items-center justify-center text-slate-500">
                    <p className="text-lg font-medium mb-2">Your laboratory is empty</p>
                    <p className="text-sm">Search for players above to add them to your team.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
