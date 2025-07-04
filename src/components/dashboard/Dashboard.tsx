import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../layout/Header';
import Sidebar from './Sidebar';
import EventsOverview from './EventsOverview';
import CreateEventModal from './CreateEventModal';
import TeamManagement from './TeamManagement';
import ProjectSubmissions from './ProjectSubmissions';
import JudgingPanel from './JudgingPanel';

type DashboardView = 'overview' | 'events' | 'teams' | 'projects' | 'judging' | 'profile';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);

  const openAuth = () => {}; // Not needed in dashboard

  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return <EventsOverview onCreateEvent={() => setIsCreateEventModalOpen(true)} />;
      case 'events':
        return <EventsOverview onCreateEvent={() => setIsCreateEventModalOpen(true)} />;
      case 'teams':
        return <TeamManagement />;
      case 'projects':
        return <ProjectSubmissions />;
      case 'judging':
        return <JudgingPanel />;
      case 'profile':
        return <div className="dashboard-content">Profile settings coming soon...</div>;
      default:
        return <EventsOverview onCreateEvent={() => setIsCreateEventModalOpen(true)} />;
    }
  };

  return (
    <div className="dashboard">
      <Header onOpenAuth={openAuth} />
      
      <div className="dashboard-layout">
        <Sidebar 
          currentView={currentView} 
          onViewChange={setCurrentView}
          userRole={user?.role || 'participant'}
        />
        
        <main className="dashboard-main">
          <div className="dashboard-header">
            <h1 className="dashboard-title">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="dashboard-subtitle">
              {user?.role === 'organizer' && 'Manage your hackathon events and track progress.'}
              {user?.role === 'participant' && 'Discover hackathons and join exciting projects.'}
              {user?.role === 'judge' && 'Review submissions and provide valuable feedback.'}
            </p>
          </div>
          
          {renderContent()}
        </main>
      </div>

      <CreateEventModal 
        isOpen={isCreateEventModalOpen}
        onClose={() => setIsCreateEventModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
