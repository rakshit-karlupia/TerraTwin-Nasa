import React, { useState, useEffect, useRef } from 'react';
import { Globe, Compass, Rocket, GitCompare, Database, Info, Layers, Award, Menu, X, ChevronDown, Radio } from 'lucide-react';

export default function Header({ currentView, setView, activePlanet, setActivePlanet }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [missionDropdownOpen, setMissionDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'universe', label: '3D Universe' },
    { id: 'explorer', label: 'Planetary Explorer' },
    {
      id: 'missions',
      label: 'Mission Planning',
      hasDropdown: true,
      subItems: [
        { id: 'lunar-missions', label: 'Lunar Artemis III Sites' },
        { id: 'mars-missions', label: 'Mars Exploration Zones' },
        { id: 'mission-compare', label: 'Landing Site Comparison' }
      ]
    },
    { id: 'analogs', label: 'Analog Discovery' },
    { id: 'compare-lab', label: 'Comparison Lab' },
    { id: 'earth-map', label: 'Global Earth Map' },
    { id: 'rankings', label: 'Rankings' },
    { id: 'data-explorer', label: 'Data Explorer' },
    { id: 'about', label: 'About' }
  ];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMissionDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-space-950/90 backdrop-blur-xl border-b border-cyan-500/25 shadow-lg shadow-cyan-950/20 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => setView('home')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="relative w-9 h-9 rounded-full bg-space-900 border border-cyan-400 flex items-center justify-center shadow-glow-cyan transition-transform group-hover:scale-105">
            <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 inline-block shadow-[0_0_8px_#00f2fe]" />
            <div className="absolute inset-0 rounded-full border border-dashed border-cyan-400 animate-spin-very-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-display font-extrabold tracking-wider text-lg text-white group-hover:text-cyan-300 transition">
                TERRATWIN
              </span>
            </div>
            <div className="text-[9px] font-mono tracking-widest text-slate-400 -mt-0.5 uppercase">
              Planetary Intelligence Platform
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center space-x-1 text-xs font-mono">
          {navItems.map((item) => {
            if (item.hasDropdown) {
              const isMissionsActive =
                currentView.includes('mission') ||
                currentView === 'lunar-missions' ||
                currentView === 'mars-missions';

              return (
                <div key={item.id} ref={dropdownRef} className="relative group">
                  <button
                    onClick={() => setMissionDropdownOpen((prev) => !prev)}
                    className={`px-3 py-2 rounded-lg transition-all flex items-center space-x-1.5 ${
                      isMissionsActive
                        ? 'text-cyan-300 bg-space-900/90 border border-cyan-500/40 shadow-sm shadow-cyan-500/20 font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-space-900/70'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                        missionDropdownOpen ? 'rotate-180 text-cyan-400' : 'group-hover:text-white'
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    className={`absolute top-full left-0 w-60 py-2 mt-1.5 glass-panel-glow rounded-xl border border-cyan-500/30 shadow-2xl z-50 backdrop-blur-2xl transition-all duration-200 ${
                      missionDropdownOpen ? 'block opacity-100 translate-y-0' : 'hidden group-hover:block opacity-100'
                    }`}
                  >
                    <div className="px-3 py-1 text-[10px] uppercase font-mono tracking-wider text-cyan-400 border-b border-slate-800/80 mb-1">
                      Candidate Landing Intelligence
                    </div>
                    {item.subItems.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setView(sub.id);
                          setMissionDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs transition flex items-center space-x-2 ${
                          currentView === sub.id
                            ? 'text-cyan-300 bg-cyan-950/70 font-bold border-l-2 border-cyan-400'
                            : 'text-slate-300 hover:text-white hover:bg-space-900/80'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80" />
                        <span>{sub.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`px-3 py-2 rounded-lg transition-all ${
                  currentView === item.id
                    ? 'text-cyan-300 bg-space-900/90 border border-cyan-500/40 shadow-sm shadow-cyan-500/20 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-space-900/70'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-space-900 transition"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6 text-cyan-400" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-space-950/95 backdrop-blur-2xl border-b border-cyan-500/30 px-5 pt-3 pb-6 space-y-3">
          {/* Mobile Planet Selector */}
          <div className="pb-3 border-b border-slate-800">
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider mb-2">Target Body</div>
            <div className="grid grid-cols-3 gap-2">
              {['earth', 'moon', 'mars'].map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setActivePlanet(p);
                    setView('explorer');
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-mono capitalize transition ${
                    activePlanet === p
                      ? p === 'mars'
                        ? 'bg-red-600 text-white font-bold'
                        : p === 'moon'
                        ? 'bg-slate-300 text-black font-bold'
                        : 'bg-cyan-500 text-black font-bold'
                      : 'bg-space-900 text-slate-300 border border-slate-800'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            {navItems.map((item) => (
              <div key={item.id}>
                {item.hasDropdown ? (
                  <div className="space-y-1 pt-1">
                    <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider py-1">
                      {item.label}
                    </div>
                    {item.subItems.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setView(sub.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`block w-full text-left pl-3 py-2 text-xs font-mono rounded-lg transition ${
                          currentView === sub.id
                            ? 'text-cyan-300 bg-cyan-950/60 font-bold border-l-2 border-cyan-400'
                            : 'text-slate-300 hover:text-white hover:bg-space-900'
                        }`}
                      >
                        • {sub.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setView(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left py-2 px-2 text-xs font-mono rounded-lg transition ${
                      currentView === item.id
                        ? 'text-cyan-300 bg-cyan-950/60 font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-space-900'
                    }`}
                  >
                    {item.label}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
