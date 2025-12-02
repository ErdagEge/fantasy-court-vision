import React, { useState, useMemo } from 'react';
import TeamSearch from '../components/TeamSearch';
import RosterTable from '../components/RosterTable';
import PuntControls from '../components/PuntControls';
import rawData from '../data/nba_stats.json';
import { processPlayerData } from '../utils/fantasyLogic';

export default function MyTeam({ puntedCategories, myTeam, setMyTeam, togglePunt }) { // Accept togglePunt prop
  const [previewPlayer, setPreviewPlayer] = useState(null);

  // 1. Process all players with current punt settings
  // We need this to get accurate Z-scores for the roster
  const allRankedPlayers = useMemo(() => {
    return processPlayerData(rawData, puntedCategories);
  }, [puntedCategories]);

  // 2. Derive roster players from IDs
  const rosterPlayers = useMemo(() => {
    return allRankedPlayers.filter(p => myTeam.includes(p.id));
  }, [allRankedPlayers, myTeam]);

  // 3. Handle Preview Player (needs to be the processed version)
  const processedPreviewPlayer = useMemo(() => {
    if (!previewPlayer) return null;
    return allRankedPlayers.find(p => p.id === previewPlayer.id);
  }, [previewPlayer, allRankedPlayers]);


  const handleAddPlayer = (player) => {
    setPreviewPlayer(player);
  };

  const confirmAdd = () => {
    if (previewPlayer) {
      setMyTeam(prev => [...prev, previewPlayer.id]);
      setPreviewPlayer(null);
    }
  };

  const cancelPreview = () => {
    setPreviewPlayer(null);
  };

  const removePlayer = (playerId) => {
    setMyTeam(prev => prev.filter(id => id !== playerId));
    // If we remove a player that was the preview (edge case), clear preview
    if (previewPlayer && previewPlayer.id === playerId) {
      setPreviewPlayer(null);
    }
  };

  return (
    <div>
       <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Team Analyzer</h2>
        <p className="text-slate-400">Build your roster to analyze aggregate strengths and weaknesses.</p>
      </div>

      <TeamSearch
        allPlayers={allRankedPlayers}
        onSelect={handleAddPlayer}
        myTeamIds={myTeam}
      />

      <div className="mb-6">
        <PuntControls puntedCategories={puntedCategories} togglePunt={togglePunt} />
      </div>

      <RosterTable
        players={rosterPlayers}
        puntedCategories={puntedCategories}
        onRemove={removePlayer}
        previewPlayer={processedPreviewPlayer}
        onConfirmAdd={confirmAdd}
        onCancelPreview={cancelPreview}
      />
    </div>
  );
}
