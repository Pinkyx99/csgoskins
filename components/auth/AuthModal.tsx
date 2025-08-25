import React, { useState } from 'react';
import { useUser } from '../../hooks/useUser';
import Button from '../ui/Button';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signInWithUsername, signUpWithUsername } = useUser();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters.");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      if (isLoginView) {
        const { error } = await signInWithUsername({ username, password });
        if (error) throw error;
      } else {
        const { error } = await signUpWithUsername({ username, password });
        if (error) throw error;
      }
      onClose();
    } catch (err: any) {
      setError(err.error_description || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={onClose}>
      <div className="bg-[#12233f] border border-blue-900/50 rounded-lg w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-blue-900/50 flex justify-between items-center">
          <h3 className="font-semibold text-xl text-white">{isLoginView ? 'Login' : 'Sign Up'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        <form onSubmit={handleAuth} className="p-6 space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full bg-[#0d1a2f] border border-blue-800/50 rounded-md py-2.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-[#0d1a2f] border border-blue-800/50 rounded-md py-2.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full !py-3" variant="secondary">
            {loading ? 'Processing...' : isLoginView ? 'Login' : 'Create Account'}
          </Button>
          <p className="text-center text-sm text-gray-400">
            {isLoginView ? "Don't have an account?" : "Already have an account?"}{' '}
            <button type="button" onClick={() => { setIsLoginView(!isLoginView); setError(null); }} className="text-blue-400 hover:underline">
              {isLoginView ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;