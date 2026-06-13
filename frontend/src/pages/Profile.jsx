import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { User, Phone, Lock, Save, ArrowLeft, Check, AlertCircle } from 'lucide-react';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState(user?.avatar_url || '');

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [err, setErr] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setSuccessMsg('');

    if (password && password !== confirmPassword) {
      setErr('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        name,
        phone,
        password: password || undefined,
        avatar_url: avatar
      });
      setSuccessMsg('Profile updated successfully.');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      setErr(error.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleRandomAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    setAvatar(`https://api.dicebear.com/7.x/adventurer/svg?seed=${randomSeed}`);
  };

  return (
    <div className="container" style={{ padding: '40px 24px', minHeight: '80vh' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: '600' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="glass" style={{ width: '100%', maxWidth: '600px', padding: '40px', border: '1px solid var(--border-light)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '8px', fontSize: '1.75rem' }}>Edit Profile</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Keep your contact details up to date.</p>

          {successMsg && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'hsla(152, 75%, 48%, 0.15)',
              border: '1px solid hsla(152, 75%, 48%, 0.25)',
              borderRadius: '8px',
              padding: '12px 16px',
              color: 'var(--primary)',
              marginBottom: '24px',
              fontSize: '0.9rem'
            }}>
              <Check size={18} />
              <span>{successMsg}</span>
            </div>
          )}

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
            {/* Avatar customization */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px', background: 'hsla(222, 25%, 8%, 0.5)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <img src={avatar || 'https://api.dicebear.com/7.x/adventurer/svg'} alt="Avatar" style={{ width: '70px', height: '70px', borderRadius: '50%', border: '2px solid var(--primary)', background: 'var(--bg-deep)' }} />
              <div>
                <h4 style={{ marginBottom: '8px' }}>Your Travel Avatar</h4>
                <button type="button" onClick={handleRandomAvatar} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                  Roll New Avatar
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address (Cannot change)</label>
              <input
                type="email"
                id="email"
                disabled
                className="form-input"
                style={{ width: '100%', opacity: 0.5, cursor: 'not-allowed' }}
                value={user?.email || ''}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  id="name"
                  required
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '48px' }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="tel"
                  id="phone"
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '48px' }}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-light)', marginTop: '32px', paddingTop: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>Update Password</h3>
              
              <div className="form-group">
                <label className="form-label" htmlFor="password">New Password (leave blank to keep current)</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    id="password"
                    className="form-input"
                    style={{ width: '100%', paddingLeft: '48px' }}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    id="confirmPassword"
                    className="form-input"
                    style={{ width: '100%', paddingLeft: '48px' }}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', marginTop: '24px', gap: '8px' }}
            >
              <Save size={18} />
              {loading ? 'Saving Changes...' : 'Save Settings'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
