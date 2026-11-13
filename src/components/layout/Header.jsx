import React, { useState } from 'react';
import { Globe, Compass, Rocket, GitCompare, Database, Info, Layers, Award, Menu, X, ChevronDown } from 'lucide-react';

export default function Header({ currentView, setView, activePlanet, setActivePlanet }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [missionDropdownOpen, setMissionDropdownOpen] = useState(false);

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

  return (
    <header className="sticky top-0 z-50 w-full bg-space-950/85 backdrop-blur-md border-b border-cyan-500/20 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => setView('home')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="relative w-9 h-9 rounded-full bg-space-900 border border-cyan-400 flex items-center justify-center shadow-glow-cyan transition-transform group-hover:scale-105">
            <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 inline-block" />
            <div className="absolute inset-0 rounded-full border border-dashed border-cyan-400 animate-spin-very-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-display font-extrabold tracking-wider text-lg text-white group-hover:text-cyan-300 transition">
                TERRATWIN
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold">
                NASA MVP
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
              return (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => setMissionDropdownOpen(!missionDropdownOpen)}
                    className={`px-3 py-2 rounded-md transition flex items-center space-x-1 ${
                      currentView.includes('mission') || currentView === 'lunar-missions' || currentView === 'mars-missions'
                        ? 'text-cyan-300 bg-space-800/80 border border-cyan-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-space-900'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform" />
                  </button>

                  <div className="absolute top-full left-0 w-52 py-2 mt-1 glass-panel-glow rounded-lg hidden group-hover:block border border-cyan-500/30 shadow-2xl">
                    {item.subItems.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setView(sub.id);
                          setMissionDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs transition ${
                          currentView === sub.id ? 'text-cyan-300 bg-cyan-950/60 font-bold' : 'text-slate-300 hover:text-white hover:bg-space-800'
                        }`}
                      >
                        {sub.label}
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
                className={`px-3 py-2 rounded-md transition ${
                  currentView === item.id
                    ? 'text-cyan-300 bg-space-800/80 border border-cyan-500/30 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-space-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Planet Quick Switcher & Telemetry Status */}
        <div className="hidden sm:flex items-center space-x-3">
          <div className="flex items-center bg-space-900 rounded-lg p-1 border border-slate-800">
            {['earth', 'moon', 'mars'].map((p) => (
              <button
                key={p}
                onClick={() => {
                  setActivePlanet(p);
                  if (currentView === 'home') setView('explorer');
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-mono capitalize transition ${
                  activePlanet === p
                    ? p === 'mars' ? 'bg-mars-glow text-white font-bold' : p === 'moon' ? 'bg-slate-300 text-black font-bold' : 'bg-cyan-500 text-black font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-mono text-emerald-400 hidden lg:inline">ONLINE</span>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden p-2 text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-space-950 border-b border-cyan-500/30 px-4 pt-2 pb-6 space-y-2">
          {navItems.map((item) => (
            <div key={item.id}>
              {item.hasDropdown ? (
                <div className="space-y-1">
                  <div className="text-xs font-mono text-cyan-400 font-bold pt-2">{item.label}</div>
                  {item.subItems.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setView(sub.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`block w-full text-left pl-3 py-1.5 text-xs font-mono ${
                        currentView === sub.id ? 'text-cyan-300 font-bold' : 'text-slate-300'
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
                  className={`block w-full text-left py-2 text-xs font-mono ${
                    currentView === item.id ? 'text-cyan-300 font-bold' : 'text-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
