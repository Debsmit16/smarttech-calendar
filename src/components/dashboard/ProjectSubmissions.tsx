import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockProjects } from '../../data/mockData';

const ProjectSubmissions: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-content">
      <div className="content-header">
        <div>
          <h2 className="content-title">Project Submissions</h2>
          <p className="content-subtitle">
            {user?.role === 'participant' ? 'Submit and manage your hackathon projects' : 'View all project submissions'}
          </p>
        </div>
        {user?.role === 'participant' && (
          <button className="btn btn-primary">Submit Project</button>
        )}
      </div>

      <div className="projects-grid">
        {mockProjects.map((project) => (
          <div key={project.id} className="project-card">
            <div className="project-header">
              <h3 className="project-title">{project.title}</h3>
              <div className="project-status">
                <span className="status-badge status-completed">Submitted</span>
              </div>
            </div>
            
            <p className="project-description">{project.description}</p>
            
            <div className="project-tech">
              <h4 className="tech-title">Technologies Used</h4>
              <div className="tech-tags">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="tech-tag">{tech}</span>
                ))}
              </div>
            </div>

            <div className="project-links">
              {project.repositoryUrl && (
                <a href={project.repositoryUrl} className="project-link" target="_blank" rel="noopener noreferrer">
                  🔗 Repository
                </a>
              )}
              {project.demoUrl && (
                <a href={project.demoUrl} className="project-link" target="_blank" rel="noopener noreferrer">
                  🚀 Live Demo
                </a>
              )}
            </div>

            <div className="project-team">
              <span className="team-label">Team: {project.team.name}</span>
            </div>

            <div className="project-actions">
              {user?.role === 'participant' && (
                <>
                  <button className="btn btn-outline btn-sm">Edit</button>
                  <button className="btn btn-secondary btn-sm">View Details</button>
                </>
              )}
              {user?.role === 'judge' && (
                <button className="btn btn-primary btn-sm">Score Project</button>
              )}
              {user?.role === 'organizer' && (
                <button className="btn btn-secondary btn-sm">View Submission</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectSubmissions;
