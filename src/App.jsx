import React, { useState, useEffect } from 'react';
import { BarChart3, Users, List } from 'lucide-react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import rawData from './data/nba_stats.json';
import Rankings from './pages/Rankings';
import MyTeam from './pages/MyTeam';

function Layout({ children }) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Rankings', icon: List },
    { path: '/my-team', label: 'My Team', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-emerald-500/30">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                <div className="bg-gradient-to-tr from-emerald-500 to-teal-400 p-2 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                    Fantasy Lab
                  </h1>
                  <p className="text-xs text-slate-500 hidden sm:block">Strategic Roster Analyzer & Punt Tool</p>
                </div>
              </Link>

              <div className="hidden md:flex ml-8 space-x-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={clsx(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                        isActive
                          ? "bg-slate-800 text-emerald-400"
                          : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 flex flex-col items-end">
               <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Season</span>
               <span className="text-emerald-400 font-bold">{rawData.meta.season}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

function App() {
  // Load initial state from LocalStorage
  const [puntedCategories, setPuntedCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('puntedCategories');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load puntedCategories", e);
      return [];
    }
  });

  const [myTeam, setMyTeam] = useState(() => {
    try {
      const saved = localStorage.getItem('myTeam');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load myTeam", e);
      return [];
    }
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('puntedCategories', JSON.stringify(puntedCategories));
  }, [puntedCategories]);

  useEffect(() => {
    localStorage.setItem('myTeam', JSON.stringify(myTeam));
  }, [myTeam]);

  const togglePunt = (category) => {
    setPuntedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={<Rankings puntedCategories={puntedCategories} togglePunt={togglePunt} />}
          />
          <Route
            path="/my-team"
            element={<MyTeam puntedCategories={puntedCategories} myTeam={myTeam} setMyTeam={setMyTeam} togglePunt={togglePunt} />}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
