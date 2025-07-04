import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockProjects, mockScores } from '../../data/mockData';

const JudgingPanel: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-content">
      <div className="content-header">
        <div>
          <h2 className="content-title">Judging Panel</h2>
          <p className="content-subtitle">
            Evaluate project submissions and provide feedback to participants
          </p>
        </div>
      </div>

      <div className="judging-stats">
        <div className="judging-stat">
          <span className="stat-number">12</span>
          <span className="stat-label">Projects to Review</span>
        </div>
        <div className="judging-stat">
          <span className="stat-number">8</span>
          <span className="stat-label">Completed Reviews</span>
        </div>
        <div className="judging-stat">
          <span className="stat-number">4</span>
          <span className="stat-label">Pending Reviews</span>
        </div>
      </div>

      <div className="projects-to-judge">
        {mockProjects.map((project) => (
          <div key={project.id} className="judging-card">
            <div className="judging-header">
              <div>
                <h3 className="project-title">{project.title}</h3>
                <p className="team-name">by {project.team.name}</p>
              </div>
              <div className="judging-status">
                <span className="status-badge status-open">Pending Review</span>
              </div>
            </div>
            
            <p className="project-description">{project.description}</p>
            
            <div className="project-tech">
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

            <div className="scoring-section">
              <h4 className="scoring-title">Scoring Criteria</h4>
              <div className="criteria-grid">
                <div className="criteria-item">
                  <label>Innovation (25 pts)</label>
                  <input type="number" min="0" max="25" className="score-input" placeholder="0-25" />
                </div>
                <div className="criteria-item">
                  <label>Technical Implementation (25 pts)</label>
                  <input type="number" min="0" max="25" className="score-input" placeholder="0-25" />
                </div>
                <div className="criteria-item">
                  <label>Impact (25 pts)</label>
                  <input type="number" min="0" max="25" className="score-input" placeholder="0-25" />
                </div>
                <div className="criteria-item">
                  <label>Presentation (25 pts)</label>
                  <input type="number" min="0" max="25" className="score-input" placeholder="0-25" />
                </div>
              </div>
              
              <div className="feedback-section">
                <label htmlFor="feedback">Feedback (Optional)</label>
                <textarea 
                  id="feedback" 
                  className="feedback-textarea" 
                  placeholder="Provide constructive feedback to help the team improve..."
                  rows={4}
                ></textarea>
              </div>
            </div>

            <div className="judging-actions">
              <button className="btn btn-outline btn-sm">Save Draft</button>
              <button className="btn btn-primary btn-sm">Submit Review</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JudgingPanel;
