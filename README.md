# Fantasy Court Vision

Fantasy Court Vision is a React + Vite application for fantasy basketball managers who want quick punt-category rankings and roster analysis. The app processes per-game player stats, converts them to z-scores, and dynamically recalculates values based on the categories you choose to punt. Local storage keeps your punt settings and roster in sync across visits.

## Features
- **Punt-aware rankings:** Toggle any fantasy category (FG%, FT%, 3PM, PTS, REB, AST, STL, BLK, TO) to remove it from the total value calculation. Rankings update instantly and punted columns are visually de-emphasized. Reset brings all categories back online. 
- **Player search & filtering:** Search the full rankings table by player or team, with sortable rank numbers and per-category heatmaps to spot strengths and weaknesses at a glance.
- **Roster builder with preview:** Add players to a roster from search, preview their impact before committing, and remove players with one click. A summary row shows average z-scores and total value for your current squad.
- **Persistence by default:** Punt selections and your roster are stored in `localStorage`, so revisiting the app restores your exact setup.
- **Modern UI stack:** Built with React 19, Vite, Tailwind CSS (v4), and Lucide icons for a responsive, themed experience.

## Data & calculation model
Player data lives in `src/data/nba_stats.json`, which includes `meta` details (season, last updated timestamp) plus `league_averages` and `players` sections. The calculation pipeline:

1. **Z-score generation:** `processPlayerData` iterates over each category, computing z-scores against league averages (turnovers are inverted so lower is better).
2. **Punt-aware totals:** Categories you punt are excluded from the summed `totalValue`, then players are sorted by that value to produce rankings.
3. **Shared logic:** The same processed list powers both the Rankings view and the roster analyzer to keep values consistent.

## App structure
- **Navigation shell:** `src/App.jsx` wires React Router routes for **Rankings** (`/`) and **My Team** (`/my-team`) while exposing season metadata and persisting punt/roster state.
- **Pages:**
  - `src/pages/Rankings.jsx` – punt controls, search input, and the ranked player table with meta footer.
  - `src/pages/MyTeam.jsx` – roster search, punt controls, and roster table with preview/confirm flow and team averages.
- **Components:**
  - `src/components/PuntControls.jsx` – category toggles with Reset.
  - `src/components/PlayerTable.jsx` – rankings table with per-stat heatmap coloring.
  - `src/components/TeamSearch.jsx` – search dropdown that filters out already-rostered players.
  - `src/components/RosterTable.jsx` – roster display, preview confirmation, and team-average summary row.
- **Utilities:** `src/utils/fantasyLogic.js` holds the category definitions and the processing helper described above.

## Getting started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
   Vite prints a local URL (defaults to `http://localhost:5173`).
3. Lint the project:
   ```bash
   npm run lint
   ```
4. Build for production:
   ```bash
   npm run build
   ```
5. Preview the production build locally:
   ```bash
   npm run preview
   ```

## Usage tips
- **Punt strategy:** Use the category tiles at the top of each page to toggle punts. Punted categories dim in the tables and stop contributing to total values.
- **Search flow:** Rankings search filters by player name or team. Team Search excludes players already on your roster and caps dropdown results to keep selection quick.
- **Roster preview:** Selecting a player adds them as a preview row—confirm to lock them in or cancel to discard. The team-average row updates automatically using the same punt settings.
- **Data freshness:** The footer on the Rankings page shows the dataset timestamp from `nba_stats.json` so you know how recent the numbers are.

## Project metadata
- **License:** MIT (see `LICENSE`).
- **Roadmap:** Planned work lives in `ROADMAP.md`.

Enjoy building smarter fantasy lineups with Fantasy Court Vision!
