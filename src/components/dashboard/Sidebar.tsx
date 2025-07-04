import React from 'react';
import { UserRole } from '../../types';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: any) => void;
  userRole: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, userRole }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊', roles: ['organizer', 'participant', 'judge'] },
    { id: 'events', label: 'Events', icon: '🎯', roles: ['organizer', 'participant', 'judge'] },
    { id: 'teams', label: 'Teams', icon: '👥', roles: ['participant', 'organizer'] },
    { id: 'projects', label: 'Projects', icon: '💻', roles: ['participant', 'organizer', 'judge'] },
    { id: 'judging', label: 'Judging', icon: '⚖️', roles: ['judge', 'organizer'] },
    { id: 'profile', label: 'Profile', icon: '👤', roles: ['organizer', 'participant', 'judge'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`sidebar-item ${currentView === item.id ? 'active' : ''}`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
