import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockTeams } from '../../data/mockData';

const TeamManagement: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-content">
      <div className="content-header">
        <div>
          <h2 className="content-title">Team Management</h2>
          <p className="content-subtitle">
            {user?.role === 'participant' ? 'Manage your teams and join new ones' : 'View and manage event teams'}
          </p>
        </div>
        {user?.role === 'participant' && (
          <button className="btn btn-primary">Create Team</button>
        )}
      </div>

      <div className="teams-grid">
        {mockTeams.map((team) => (
          <div key={team.id} className="team-card">
            <div className="team-header">
              <h3 className="team-name">{team.name}</h3>
              <span className="team-size">{team.members.length} members</span>
            </div>
            
            <p className="team-description">{team.description}</p>
            
            <div className="team-members">
              <h4 className="members-title">Team Members</h4>
              <div className="members-list">
                {team.members.map((member) => (
                  <div key={member.id} className="member-item">
                    <div className="member-avatar">
                      {member.user.firstName[0]}{member.user.lastName[0]}
                    </div>
                    <div className="member-info">
                      <span className="member-name">
                        {member.user.firstName} {member.user.lastName}
                      </span>
                      <span className="member-role">{member.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="team-actions">
              {user?.role === 'participant' && (
                <>
                  <button className="btn btn-outline btn-sm">Edit Team</button>
                  <button className="btn btn-secondary btn-sm">View Project</button>
                </>
              )}
              {user?.role === 'organizer' && (
                <button className="btn btn-secondary btn-sm">View Details</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamManagement;
