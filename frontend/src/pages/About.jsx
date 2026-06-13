import React from 'react';
import { Compass, Users, MapPin, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="section-header" style={{ marginBottom: '60px' }}>
          <span className="section-subtitle">Our Philosophy</span>
          <h1 className="section-title">About Tourism Management System</h1>
          <p className="section-desc">Pioneering luxury eco-tourism and cultural expeditions in South India.</p>
        </div>

        <div className="glass" style={{ padding: '40px', border: '1px solid var(--border-light)', marginBottom: '48px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '16px', fontSize: '1.5rem' }}>Our Mission</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '24px' }}>
            The Tourism Management System was founded with a clear vision: to create a digital gateway for high-end, responsible tourism across Tamil Nadu and Kerala. We believe in providing travellers with deep, immersive local connections while ensuring maximum premium comfort and seamless booking convenience.
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.8' }}>
            We work directly with local heritage hotels, tea plantation owners, and expert nature naturalists. By bypasssing traditional agencies, we guarantee authentic itineraries, competitive pricing in Rupees, and direct support for rural preservation initiatives.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          <div className="glass" style={{ padding: '32px', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <MapPin size={24} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)' }}>Local Integration</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Every guide on our platform is a licensed naturalist or historian from Munnar, Madurai, or Kochi. We value local knowledge above all.
            </p>
          </div>

          <div className="glass" style={{ padding: '32px', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <Award size={24} style={{ color: 'var(--secondary)' }} />
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)' }}>Premium Standards</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              We vet every hotel room, yacht deck, and private transport vehicle to ensure they meet 5-star safety and quality compliance.
            </p>
          </div>
        </div>

        <div className="glass" style={{
          marginTop: '60px',
          padding: '32px',
          border: '1px dashed var(--primary)',
          textAlign: 'center',
          background: 'hsla(152, 75%, 48%, 0.03)'
        }}>
          <Compass size={32} style={{ color: 'var(--primary)', marginBottom: '12px' }} />
          <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>CSE Portfolio Project Details</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '600px', margin: '0 auto' }}>
            This Full-Stack Tourism Management System is designed for academic demonstration. It showcases clean REST API endpoints, secure JSON Web Token sessions, SQLite database relations, and glassmorphic user dashboards.
          </p>
        </div>
      </div>
    </div>
  );
}
