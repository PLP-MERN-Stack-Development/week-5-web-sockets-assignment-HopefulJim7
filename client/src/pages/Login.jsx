import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) navigate('/chat');
  };

  return (
    <form
      onSubmit={handleLogin}
      className="max-w-md mx-auto p-6 bg-background shadow rounded space-y-4"
      autoComplete="on"
    >
      <h2 className="text-lg font-medium">Login</h2>

      <div>
        <label htmlFor="username" className="block text-sm font-medium mb-1">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          autoComplete="username"
          placeholder="Username"
          className="w-full px-3 py-2 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          autoComplete="current-password"
          placeholder="Password"
          className="w-full px-3 py-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="bg-primary text-white px-4 py-2 rounded w-full"
      >
        Login
      </button>

      <div className="text-sm text-center mt-2">
        New here?{' '}
        <Link to="/signup" className="text-blue-600 hover:underline font-medium">
          Create an account
        </Link>
      </div>
    </form>
  );
}