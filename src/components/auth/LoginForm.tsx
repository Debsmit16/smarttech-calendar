import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LoginForm as LoginFormType } from '../../types';

interface LoginFormProps {
  onToggleMode: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginFormType>({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <div className="card-header">
        <h2 className="card-title text-center">Sign In</h2>
        <p className="text-gray-600 text-center">
          Welcome back! Please sign in to your account.
        </p>
      </div>
      <div className="card-content">
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your email"
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="error-message" style={{ marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
            style={{ marginBottom: '1rem' }}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onToggleMode}
                className="text-link"
              >
                Sign up here
              </button>
            </p>
          </div>
        </form>

        <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.375rem' }}>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Demo Accounts:</strong>
          </p>
          <div className="text-sm text-gray-600">
            <p><strong>Organizer:</strong> john.doe@example.com</p>
            <p><strong>Judge:</strong> jane.smith@example.com</p>
            <p><strong>Participant:</strong> alex.johnson@example.com</p>
            <p className="mt-2 text-xs">Use any password for demo accounts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
