
// Categories and their display labels
export const CATEGORIES = {
  fg_pct: 'FG%',
  ft_pct: 'FT%',
  tpm: '3PM',
  pts: 'PTS',
  reb: 'REB',
  ast: 'AST',
  stl: 'STL',
  blk: 'BLK',
  to: 'TO'
};

/**
 * Calculates the Z-Score for a given stat.
 * @param {number} value - The player's stat value.
 * @param {number} mean - The league average for that stat.
 * @param {number} std - The league standard deviation for that stat.
 * @param {boolean} isTurnover - Whether the stat is Turnovers (where lower is better).
 * @returns {number} The calculated Z-Score.
 */
export const calculateZScore = (value, mean, std, isTurnover = false) => {
  if (std === 0) return 0;
  const z = (value - mean) / std;
  return isTurnover ? -z : z;
};

/**
 * Processes player data to calculate Z-scores and rankings based on punted categories.
 * @param {Object} data - The raw data object containing 'league_averages' and 'players'.
 * @param {string[]} puntedCategories - Array of category keys (e.g., ['to', 'fg_pct']) to exclude.
 * @returns {Object[]} Sorted array of player objects with calculated z-scores and total value.
 */
export const processPlayerData = (data, puntedCategories = []) => {
  const { league_averages, players } = data;

  if (!league_averages || !players) return [];

  const processedPlayers = players.map(player => {
    const zScores = {};
    let totalValue = 0;

    Object.keys(CATEGORIES).forEach(cat => {
      const { mean, std } = league_averages[cat];
      const val = player[cat];
      const isTurnover = cat === 'to';

      const z = calculateZScore(val, mean, std, isTurnover);
      zScores[cat] = z;

      // Only add to total if NOT punted
      if (!puntedCategories.includes(cat)) {
        totalValue += z;
      }
    });

    return {
      ...player,
      zScores,
      totalValue
    };
  });

  // Sort by Total Value descending
  return processedPlayers.sort((a, b) => b.totalValue - a.totalValue);
};
