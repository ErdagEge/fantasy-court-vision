import React from 'react';
import PlayerSearch from './PlayerSearch';
import RosterTable from './RosterTable';

export default function MyTeamView({ roster, allPlayers, puntedCategories, onAddPlayer, onRemovePlayer }) {
  const rosterIds = roster.map(p => p.id);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">My Team Laboratory</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Build your roster to analyze its strengths and weaknesses.
          Use the search below to add players and see how your team stacks up against the league averages.
        </p>
      </div>

      <PlayerSearch
        allPlayers={allPlayers}
        onAddPlayer={onAddPlayer}
        rosterIds={rosterIds}
      />

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Current Roster <span className="text-slate-500 text-sm font-normal">({roster.length} Players)</span></h3>
        {roster.length > 0 && (
             <div className="text-xs text-slate-500">
                *Values are Z-Scores relative to league average
             </div>
        )}
      </div>

      <RosterTable
        roster={roster}
        puntedCategories={puntedCategories}
        onRemovePlayer={onRemovePlayer}
      />
    </div>
  );
}
