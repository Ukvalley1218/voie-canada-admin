import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import logo from '../assets/logo.png'

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Invalid credentials');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-gray">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center">
            <div className="w-auto h-4  flex items-center justify-center">
             <img src={logo} alt="VOIE LOGO" />
            </div>
           
          </div>
          <h1 className="mt-4 text-xl font-heading font-semibold text-text-dark">Admin Panel</h1>
        </div>

        {/* Login Form */}
        <div className="card-admin p-8">
          <h2 className="text-2xl font-heading font-semibold text-text-dark mb-6">
            Sign in to your account
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="label-admin" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-admin"
                placeholder="admin@voiecanada.com"
                required
              />
            </div>

            <div className="mb-6">
              <label className="label-admin" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-admin"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-admin-primary py-3 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-4 text-sm text-text-muted text-center">
            Contact administrator if you don't have access
          </p>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-text-muted">
          © {new Date().getFullYear()} Voie Canada. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;