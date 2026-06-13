import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Mail, Lock, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      
      // Enforce Admin role restriction
      if (loggedUser.role !== 'admin') {
        logout(); // Discard the session
        setErr('Access Denied: Standard user accounts cannot log in to the Admin Console.');
      } else {
        navigate('/admin');
      }
    } catch (error) {
      setErr(error.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80vh',
      padding: '40px 24px'
    }}>
      <div className="glass" style={{
        width: '100%',
        maxWidth: '450px',
        padding: '40px',
        border: '1px solid rgba(239, 68, 68, 0.25)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'rgba(239, 68, 68, 0.1)',
            color: 'rgb(239, 68, 68)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <ShieldAlert size={32} />
          </div>
          <h2 style={{ color: 'var(--text-primary)' }}>Admin Portal</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Sign in to manage bookings and destinations</p>
        </div>

        {err && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '8px',
            padding: '12px 16px',
            color: 'rgb(239, 68, 68)',
            marginBottom: '24px',
            fontSize: '0.9rem'
          }}>
            <AlertCircle size={18} />
            <span>{err}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Admin Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                type="email"
                id="email"
                required
                className="form-input"
                style={{ width: '100%', paddingLeft: '48px' }}
                placeholder="admin@voyaluxe.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label className="form-label" htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                type="password"
                id="password"
                required
                className="form-input"
                style={{ width: '100%', paddingLeft: '48px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-accent"
            style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, rgb(239, 68, 68), rgb(180, 40, 40))', color: '#fff', boxShadow: 'none' }}
            disabled={loading}
          >
            {loading ? 'Authenticating Admin...' : 'Secure Log In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Standard User?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>
            Go to Customer Login
          </Link>
        </div>

        <div style={{
          marginTop: '32px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-light)',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          textAlign: 'center'
        }}>
          <p>Demo Account: admin@voyaluxe.com (adminpassword)</p>
        </div>
      </div>
    </div>
  );
}
