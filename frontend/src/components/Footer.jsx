import React from 'react';
import { Compass, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      background: 'hsl(222, 25%, 5%)',
      borderTop: '1px solid var(--border-light)',
      padding: '60px 0 30px',
      color: 'var(--text-secondary)',
      fontSize: '0.9rem'
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '40px',
        marginBottom: '40px'
      }}>
        <div>
          <div className="logo" style={{ marginBottom: '20px' }}>
            <Compass size={24} style={{ color: 'var(--primary)' }} />
            Tourism Management <span>System</span>
          </div>
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            Curating luxury journeys and experiential travel across the magnificent landscapes of Tamil Nadu and Kerala. Experience heritage, hills, backwaters, and pristine beaches like never before.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="https://github.com" className="btn-secondary" style={{ padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
            <a href="https://linkedin.com" className="btn-secondary" style={{ padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '20px', fontFamily: 'var(--font-display)' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><Link to="/" style={{ hoverColor: 'var(--text-primary)' }}>Home</Link></li>
            <li><Link to="/destinations">Explore Destinations</Link></li>
            <li><Link to="/packages">Tour Packages</Link></li>
            <li><Link to="/about">About Tourism System</Link></li>
            <li><Link to="/contact">Contact Support</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '20px', fontFamily: 'var(--font-display)' }}>Our Destinations</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li>Munnar Hills, Kerala</li>
            <li>Alleppey Backwaters, Kerala</li>
            <li>Ooty Queen of Hills, Tamil Nadu</li>
            <li>Madurai Temple Heritage, Tamil Nadu</li>
            <li>Kanyakumari Oceans Merge, Tamil Nadu</li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '20px', fontFamily: 'var(--font-display)' }}>Contact Info</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={18} style={{ color: 'var(--primary)' }} />
              <span>12, IT Highway, OMR, Chennai, India</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Phone size={18} style={{ color: 'var(--secondary)' }} />
              <span>+91 98765 43210</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={18} style={{ color: 'var(--primary)' }} />
              <span>support@tourismms.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container" style={{
        borderTop: '1px solid var(--border-light)',
        paddingTop: '30px',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <p>&copy; {new Date().getFullYear()} Tourism Management System. All rights reserved.</p>
        <p style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
          Crafted for CSE Portfolio with <Heart size={14} style={{ color: 'var(--primary)', fill: 'var(--primary)' }} />
        </p>
      </div>
    </footer>
  );
}
