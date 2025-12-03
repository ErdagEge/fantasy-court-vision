import React, { useMemo } from 'react';
import clsx from 'clsx';
import { CATEGORIES } from '../utils/fantasyLogic';
import { Trash2, UserPlus } from 'lucide-react';

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

export default function RosterTable({ players, puntedCategories, onRemove, highlightId }) {

  // Calculate Averages for the Summary Row
  const teamAverages = useMemo(() => {
    if (players.length === 0) return null;

    const sums = {};
    Object.keys(CATEGORIES).forEach(cat => sums[cat] = 0);
    let totalValueSum = 0;

    players.forEach(p => {
      Object.keys(CATEGORIES).forEach(cat => {
        sums[cat] += p.zScores[cat];
      });
      totalValueSum += p.totalValue;
    });

    const count = players.length;
    const averages = {};
    Object.keys(CATEGORIES).forEach(cat => {
      averages[cat] = sums[cat] / count;
    });

    return {
      zScores: averages,
      totalValue: totalValueSum / count
    };
  }, [players]);

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs text-slate-400 uppercase bg-slate-900/50 sticky top-0">
            <tr>
              <th scope="col" className="px-4 py-3 font-bold w-12">#</th>
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
              <th scope="col" className="px-4 py-3 font-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.length > 0 ? (
              <>
                {players.map((player, index) => {
                   const isHighlighted = highlightId && player.id === highlightId;

                   return (
                    <tr
                      key={player.id}
                      className={clsx(
                        "border-b border-slate-700/50 transition-colors",
                        isHighlighted ? "bg-emerald-900/20 border-emerald-500/50" : "hover:bg-slate-700/50"
                      )}
                    >
                      <td className="px-4 py-3 font-mono text-slate-500">
                        {isHighlighted ? <span className="text-emerald-400 text-xs font-bold uppercase">New</span> : index + 1}
                      </td>
                      <td className="px-4 py-3 font-medium text-white">
                        <div className="flex flex-col">
                          <span className={clsx(isHighlighted && "text-emerald-400 font-bold")}>{player.name}</span>
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
                              {fmt(z, 2)}
                            </div>
                          </td>
                        );
                      })}
                      <td className="px-4 py-3 text-center font-bold text-lg bg-slate-900/30 text-emerald-400">
                       {player.totalValue > 0 ? '+' : ''}{fmt(player.totalValue, 2)}
                      </td>
                      <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => onRemove(player.id)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-900/20 transition-colors"
                            title="Remove from Team"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                      </td>
                    </tr>
                  );
                })}

                {/* Summary Row */}
                <tr className="bg-slate-900/80 font-bold border-t-2 border-emerald-500/30">
                  <td colSpan={2} className="px-4 py-4 text-right text-emerald-400 uppercase text-xs tracking-wider">
                    Team Average Z-Score
                  </td>
                  {Object.keys(CATEGORIES).map(cat => {
                    const z = teamAverages.zScores[cat];
                    const isPunted = puntedCategories.includes(cat);
                    const colorClass = getHeatmapColor(z);
                    return (
                       <td key={cat} className={clsx("px-1 py-3 text-center", isPunted && "opacity-30 grayscale")}>
                          <div className={clsx("rounded px-1.5 py-1 mx-auto w-14 font-bold border border-white/10", colorClass)}>
                            {fmt(z, 2)}
                          </div>
                       </td>
                    );
                  })}
                  <td className="px-4 py-3 text-center font-bold text-lg text-emerald-400">
                    {teamAverages.totalValue > 0 ? '+' : ''}{fmt(teamAverages.totalValue, 2)}
                  </td>
                  <td></td>
                </tr>
              </>
            ) : (
              <tr>
                <td colSpan={13} className="text-center py-12 text-slate-500">
                  <div className="flex flex-col items-center gap-2">
                    <UserPlus className="w-8 h-8 opacity-50" />
                    <p>Your roster is empty.</p>
                    <p className="text-xs">Search for players above to build your team.</p>
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
