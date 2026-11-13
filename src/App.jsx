import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Universe from './pages/Universe';
import Explorer from './pages/Explorer';
import LunarLandingSites from './pages/LunarLandingSites';
import MarsExploration from './pages/MarsExploration';
import CandidateComparison from './pages/CandidateComparison';
import AnalogDiscovery from './pages/AnalogDiscovery';
import ComparisonLab from './pages/ComparisonLab';
import GlobalEarthMap from './pages/GlobalEarthMap';
import Rankings from './pages/Rankings';
import DataExplorer from './pages/DataExplorer';
import About from './pages/About';
import { MARS_REGIONS } from './data/marsRegions';

export default function App() {
  const [currentView, setView] = useState('home');
  const [activePlanet, setActivePlanet] = useState('earth');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [targetReference, setTargetReference] = useState(MARS_REGIONS[0]); // Default Jezero Crater

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Mission Control Header */}
      <Header
        currentView={currentView}
        setView={setView}
        activePlanet={activePlanet}
        setActivePlanet={setActivePlanet}
      />

      {/* Main Viewport Router */}
      <main className="flex-1 w-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="w-full h-full"
          >
            {currentView === 'home' && (
              <Home
                setView={setView}
                setActivePlanet={setActivePlanet}
              />
            )}

        {currentView === 'universe' && (
          <Universe
            setActivePlanet={setActivePlanet}
            setView={setView}
          />
        )}

        {currentView === 'explorer' && (
          <Explorer
            activePlanet={activePlanet}
            setActivePlanet={setActivePlanet}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            setView={setView}
            setTargetReference={setTargetReference}
          />
        )}

        {currentView === 'lunar-missions' && (
          <LunarLandingSites
            setView={setView}
            setSelectedLocation={setSelectedLocation}
            setTargetReference={setTargetReference}
          />
        )}

        {currentView === 'mars-missions' && (
          <MarsExploration
            setView={setView}
            setSelectedLocation={setSelectedLocation}
            setTargetReference={setTargetReference}
          />
        )}

        {currentView === 'mission-compare' && (
          <CandidateComparison
            setView={setView}
            setTargetReference={setTargetReference}
            setSelectedLocation={setSelectedLocation}
            setActivePlanet={setActivePlanet}
          />
        )}

        {currentView === 'analogs' && (
          <AnalogDiscovery
            targetReference={targetReference}
            setTargetReference={setTargetReference}
            setView={setView}
            setSelectedLocation={setSelectedLocation}
          />
        )}

        {currentView === 'compare-lab' && (
          <ComparisonLab
            targetReference={targetReference}
            selectedLocation={selectedLocation}
          />
        )}

        {currentView === 'earth-map' && (
          <GlobalEarthMap
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            targetReference={targetReference}
            setTargetReference={setTargetReference}
            setView={setView}
          />
        )}

        {currentView === 'rankings' && (
          <Rankings
            setView={setView}
            setSelectedLocation={setSelectedLocation}
            setTargetReference={setTargetReference}
          />
        )}

        {currentView === 'data-explorer' && (
          <DataExplorer />
        )}

        {currentView === 'about' && (
          <About />
        )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer & Integrity Disclaimers */}
      <Footer setView={setView} />
    </div>
  );
}
