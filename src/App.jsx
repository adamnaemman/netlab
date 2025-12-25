import { useRef } from 'react';
import { LabProvider, useLab } from './context/LabContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomeScreen from './components/HomeScreen';
import AuthScreen from './components/AuthScreen';
import GameHeader from './components/GameHeader';
import VirtualTerminal from './components/VirtualTerminal';
import NetworkTopology from './components/NetworkTopology';
import HelperSidebar from './components/HelperSidebar';
import LevelCompleteModal from './components/LevelCompleteModal';

// Lab View - The main CLI + Topology interface
const LabView = () => {
  const { state, currentLevel, currentStep, goHome } = useLab();

  // Refs for scrolling
  const scenarioRef = useRef(null);
  const topologyRef = useRef(null);
  const cliRef = useRef(null);
  const hintsRef = useRef(null);

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#0d1117' }}>
      {/* Game Header */}
      <GameHeader />

      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        {/* Left side: Topology + Terminal */}
        <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
          {/* Network Topology */}
          <div className="flex-shrink-0">
            <NetworkTopology />
          </div>

          {/* Virtual Terminal */}
          <div className="flex-1 min-h-0">
            <VirtualTerminal />
          </div>
        </div>

        {/* Right side: Helper Sidebar */}
        <HelperSidebar />
      </div>

      {/* Mobile Layout - Single Scrollable Page */}
      <div className="lg:hidden flex-1 overflow-y-auto scroll-smooth">
        {/* Section 1: Scenario */}
        <section ref={scenarioRef} className="p-4" id="scenario">
          <div
            className="rounded-2xl p-4 mb-4"
            style={{ backgroundColor: '#161b22', border: '3px solid #9333ea' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">📋</span>
              <h2 className="text-lg font-black" style={{ color: '#9333ea' }}>SCENARIO</h2>
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: '#c9d1d9' }}>
              {currentLevel?.name}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: '#8b949e' }}>
              {currentLevel?.scenario}
            </p>
          </div>

          {/* Progress Steps */}
          <div
            className="rounded-2xl p-4"
            style={{ backgroundColor: '#161b22', border: '2px solid #30363d' }}
          >
            <h3 className="font-bold mb-3" style={{ color: '#c9d1d9' }}>📊 Your Progress</h3>
            <div className="space-y-2">
              {currentLevel?.steps.map((step, idx) => {
                const isCompleted = idx < state.currentStepIndex;
                const isCurrent = idx === state.currentStepIndex;
                return (
                  <div
                    key={step.id}
                    className="flex items-center gap-3 p-2 rounded-lg"
                    style={{
                      backgroundColor: isCurrent ? '#1a2c32' : 'transparent',
                      border: isCurrent ? '2px solid #58cc02' : '2px solid transparent'
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{
                        backgroundColor: isCompleted ? '#58cc02' : isCurrent ? '#1cb0f6' : '#30363d',
                        color: 'white'
                      }}
                    >
                      {isCompleted ? '✓' : idx + 1}
                    </div>
                    <span
                      className="text-sm flex-1"
                      style={{ color: isCompleted ? '#58cc02' : isCurrent ? '#c9d1d9' : '#6e7681' }}
                    >
                      {step.description}
                    </span>
                    <span className="text-xs font-bold" style={{ color: '#ffc800' }}>+{step.xp}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 2: Topology */}
        <section ref={topologyRef} className="p-4" id="topology">
          <div
            className="rounded-2xl p-4"
            style={{ backgroundColor: '#161b22', border: '3px solid #1cb0f6' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🗺️</span>
              <h2 className="text-lg font-black" style={{ color: '#1cb0f6' }}>TOPOLOGY</h2>
            </div>
            <div className="flex justify-center">
              <NetworkTopology />
            </div>
          </div>
        </section>

        {/* Section 3: CLI Terminal */}
        <section ref={cliRef} className="p-4" id="cli">
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: '3px solid #58cc02' }}
          >
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{ backgroundColor: '#161b22' }}
            >
              <span className="text-2xl">⌨️</span>
              <h2 className="text-lg font-black" style={{ color: '#58cc02' }}>CLI TERMINAL</h2>
            </div>

            {/* Current Task */}
            <div
              className="px-4 py-3 flex items-center justify-between"
              style={{ backgroundColor: '#1a2733', borderTop: '1px solid #30363d' }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold" style={{ color: '#8b949e' }}>
                  Step {state.currentStepIndex + 1} of {currentLevel?.steps.length}
                </p>
                <p className="text-sm font-bold" style={{ color: '#c9d1d9' }}>
                  {currentStep?.description}
                </p>
              </div>
              <span
                className="px-2 py-1 rounded-lg text-xs font-bold ml-2 flex-shrink-0"
                style={{ backgroundColor: '#ffc800', color: '#0d1117' }}
              >
                +{currentStep?.xp || 0} XP
              </span>
            </div>

            {/* Hint */}
            {currentStep && (
              <div
                className="px-4 py-2"
                style={{ backgroundColor: '#0d1117', borderTop: '1px solid #30363d' }}
              >
                <p className="text-sm" style={{ color: '#8b949e' }}>
                  💡 <span style={{ color: '#58cc02' }}>{currentStep.hint}</span>
                </p>
              </div>
            )}

            {/* Terminal */}
            <div style={{ height: '300px' }}>
              <VirtualTerminal />
            </div>
          </div>
        </section>

        {/* Section 4: Hints & Help */}
        <section ref={hintsRef} className="p-4 pb-24" id="hints">
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: '3px solid #ffc800' }}
          >
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{ backgroundColor: '#161b22' }}
            >
              <span className="text-2xl">💡</span>
              <h2 className="text-lg font-black" style={{ color: '#ffc800' }}>HINTS & HELP</h2>
            </div>
            <HelperSidebar />
          </div>
        </section>
      </div>

      {/* Floating Navigation Buttons */}
      <div className="lg:hidden fixed right-3 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2">
        <FloatingNavButton icon="📋" color="#9333ea" onClick={() => scrollTo(scenarioRef)} />
        <FloatingNavButton icon="🗺️" color="#1cb0f6" onClick={() => scrollTo(topologyRef)} />
        <FloatingNavButton icon="⌨️" color="#58cc02" onClick={() => scrollTo(cliRef)} />
        <FloatingNavButton icon="💡" color="#ffc800" onClick={() => scrollTo(hintsRef)} />
      </div>

      {/* Level Complete Modal */}
      {state.currentView === 'celebration' && <LevelCompleteModal />}
    </div>
  );
};

// Floating Navigation Button
const FloatingNavButton = ({ icon, color, onClick }) => (
  <button
    onClick={onClick}
    className="w-11 h-11 rounded-full flex items-center justify-center text-lg shadow-lg transition-transform active:scale-90"
    style={{
      backgroundColor: color,
      color: 'white',
      boxShadow: `0 4px 0 ${color}88, 0 4px 12px rgba(0,0,0,0.3)`
    }}
  >
    {icon}
  </button>
);

// Main app with view routing
const AppContent = () => {
  const { state } = useLab();

  // Show lab view when a level is started
  if (state.currentView === 'lab' || state.currentView === 'celebration') {
    return <LabView />;
  }

  // Default: show home screen with level selection
  return <HomeScreen />;
};

// Auth-aware wrapper
const AuthWrapper = () => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#0d1117' }}
      >
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">🌐</div>
          <p className="font-bold" style={{ color: '#58cc02' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  // Show main app if authenticated
  return (
    <LabProvider>
      <AppContent />
    </LabProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
}

export default App;
