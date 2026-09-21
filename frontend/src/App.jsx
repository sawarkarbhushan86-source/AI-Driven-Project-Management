import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Tasks from './pages/Tasks';
import DailyUpdates from './pages/DailyUpdates';
import Analytics from './pages/Analytics';
import AiAssistant from './pages/AiAssistant';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState(1);

  // If unauthenticated, show Landing or Login/Register
  if (!isAuthenticated) {
    if (currentPage === 'login') {
      return (
        <Login
          onRegister={() => setCurrentPage('register')}
          onLoggedIn={() => setCurrentPage('dashboard')}
        />
      );
    }
    if (currentPage === 'register') {
      return (
        <Register
          onLogin={() => setCurrentPage('login')}
          onRegistered={() => setCurrentPage('login')}
        />
      );
    }
    return (
      <LandingPage
        onGetStarted={() => setCurrentPage('login')}
        onLogin={() => setCurrentPage('login')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col">
      <Navbar onNavigate={setCurrentPage} currentPage={currentPage} />

      <div className="flex flex-1">
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

        <main className="flex-1 overflow-y-auto min-h-[calc(100vh-65px)]">
          {currentPage === 'dashboard' && (
            <Dashboard
              onNavigate={setCurrentPage}
              onSelectProject={(id) => {
                setSelectedProjectId(id);
                setCurrentPage('project-detail');
              }}
            />
          )}

          {currentPage === 'projects' && (
            <Projects
              onNavigate={setCurrentPage}
              onSelectProject={(id) => {
                setSelectedProjectId(id);
                setCurrentPage('project-detail');
              }}
            />
          )}

          {currentPage === 'project-detail' && (
            <ProjectDetail
              projectId={selectedProjectId}
              onBack={() => setCurrentPage('projects')}
              onNavigate={setCurrentPage}
            />
          )}

          {currentPage === 'tasks' && <Tasks />}

          {currentPage === 'updates' && <DailyUpdates />}

          {currentPage === 'analytics' && <Analytics />}

          {currentPage === 'ai-assistant' && <AiAssistant onNavigate={setCurrentPage} />}

          {currentPage === 'reports' && <Reports />}

          {currentPage === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
