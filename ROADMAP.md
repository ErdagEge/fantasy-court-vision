# 🗺️ Project Roadmap: Fantasy Lab

This document outlines the development plan for **Fantasy Lab**, prioritizing features that enhance roster analysis and ease of use.

## ✅ Completed (v1.0)
- [x] **Project Scaffolding:** React (Vite) + Tailwind CSS v4.
- [x] **Fantasy Logic Engine:** Z-Score calculations, Turnover inversion, Punting logic.
- [x] **Rankings Dashboard:** Sortable list of players based on value.
- [x] **Punt Strategy Configuration:** Toggle categories to dynamically re-rank players.
- [x] **Visual Heatmaps:** Color-coded stats to identify strengths/weaknesses.

---

## 🚀 Phase 1: Roster Analyzer (Next Priority)
*Goal: Allow users to move beyond league-wide rankings and analyze specific teams.*

- [ ] **Dedicated "My Team" Page:** A separate view/route for managing a roster.
- [ ] **Manual Roster Management:**
    -   Search and "Add" players to a specific team list.
    -   Remove players from the roster.
- [ ] **Team Analysis:**
    -   Calculate aggregate team Z-scores.
    -   "Punt Fit" analysis: How does the team rank with current punt settings?
- [ ] **Player vs. Team Comparison:** Compare a target free agent against the user's current team averages.

---

## 💾 Phase 2: Persistence & Usability
*Goal: Improve the user experience by saving state.*

- [ ] **LocalStorage Persistence:**
    -   Save `puntedCategories` settings so they persist on refresh.
    -   Save "My Team" roster locally so data isn't lost.
- [ ] **Mobile Optimization:** Refine the table view for smaller screens (sticky columns, collapsible rows).

---

## 🔌 Phase 3: Data & Integrations
*Goal: Automate data ingestion and support external platforms.*

- [ ] **Live Data Integration:**
    -   Replace static `nba_stats.json` with a live API fetch or scraper service.
    -   Daily updates for stats and league averages.
- [ ] **Yahoo Fantasy Integration:**
    -   **OAuth Implementation:** Allow users to log in with Yahoo.
    -   **League Import:** Fetch active leagues and rosters automatically.
    -   **Sync:** Sync available free agents from the user's specific league.

---

## 🔮 Future Concepts
- [ ] **Trade Analyzer:** Select two players (give/get) and visualize the impact on team Z-scores.
- [ ] **Draft Companion:** A simplified "Draft Mode" to mark players as taken and recommend best available picks based on team build.
- [ ] **Custom Projections:** Allow users to upload or edit their own stat projections instead of using historical averages.
