import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <Compass size={28} className="logo-icon" style={{ color: 'var(--primary)' }} />
          Tourism Management <span>System</span>
        </Link>

        {/* Desktop Links */}
        <ul className="nav-links" style={{ display: 'flex' }}>
          <li>
            <NavLink to="/" className={({ active }) => `nav-link ${active ? 'active' : ''}`}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/destinations" className={({ active }) => `nav-link ${active ? 'active' : ''}`}>
              Destinations
            </NavLink>
          </li>
          <li>
            <NavLink to="/packages" className={({ active }) => `nav-link ${active ? 'active' : ''}`}>
              Packages
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({ active }) => `nav-link ${active ? 'active' : ''}`}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={({ active }) => `nav-link ${active ? 'active' : ''}`}>
              Contact
            </NavLink>
          </li>

          {user ? (
            <>
              {isAdmin ? (
                <li>
                  <Link to="/admin" className="btn btn-accent" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
                    <LayoutDashboard size={16} /> Admin Console
                  </Link>
                </li>
              ) : (
                <li>
                  <NavLink to="/dashboard" className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
                    <LayoutDashboard size={16} /> My Dashboard
                  </NavLink>
                </li>
              )}
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link to="/profile" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <img
                    src={user.avatar_url || 'https://api.dicebear.com/7.x/adventurer/svg'}
                    alt="avatar"
                    style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid var(--primary)' }}
                  />
                  <span style={{ fontSize: '0.85rem' }}>{user.name.split(' ')[0]}</span>
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <LogOut size={16} />
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="nav-link">Sign In</Link>
              </li>
              <li>
                <Link to="/register" className="btn btn-primary" style={{ padding: '8px 18px' }}>Explore Now</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
