import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginWithEmail, loginWithGoogle, signupWithEmail } from '../services/authService';

function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/dashboard';

  const handleEmailAuth = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        await signupWithEmail(form);
        toast.success('Account created successfully.');
      } else {
        await loginWithEmail(form);
        toast.success('Welcome back.');
      }
      navigate(redirectTo);
    } catch (error) {
      toast.error(error.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Logged in with Google.');
      navigate(redirectTo);
    } catch (error) {
      toast.error(error.message || 'Google login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page container page-section">
      <div className="auth-card card">
        <p className="eyebrow">Authentication</p>
        <h1>{isSignup ? 'Create your account' : 'Welcome back'}</h1>
        <p>Use email/password or Google sign-in. Sessions persist automatically through Firebase Auth.</p>

        <form className="form-grid" onSubmit={handleEmailAuth}>
          {isSignup ? (
            <div className="form-group">
              <label htmlFor="name">Full name</label>
              <input id="name" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required />
            </div>
          ) : null}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} required />
          </div>
          <button className="button button--primary" disabled={loading} type="submit">
            {loading ? 'Please wait...' : isSignup ? 'Create account' : 'Login'}
          </button>
        </form>

        <button className="button button--secondary button--full" disabled={loading} onClick={handleGoogleAuth}>
          Continue with Google
        </button>

        <p className="auth-switch">
          {isSignup ? 'Already have an account?' : 'Need a new account?'}{' '}
          <button type="button" className="text-button" onClick={() => setIsSignup((prev) => !prev)}>
            {isSignup ? 'Login here' : 'Sign up here'}
          </button>
        </p>

        <Link className="text-link" to="/events">Browse events without logging in</Link>
      </div>
    </div>
  );
}

export default AuthPage;
