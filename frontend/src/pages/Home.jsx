import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { Search, Compass, Star, MapPin, Shield, Calendar, Award } from 'lucide-react';

export default function Home() {
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [searchState, setSearchState] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadPackages() {
      try {
        const data = await api.get('/packages');
        // Grab first 3 packages as featured
        setFeaturedPackages(data.slice(0, 3));
      } catch (err) {
        console.error('Error loading packages:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPackages();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    let queryParams = [];
    if (searchState) queryParams.push(`state=${encodeURIComponent(searchState)}`);
    if (searchCategory) queryParams.push(`category=${encodeURIComponent(searchCategory)}`);
    
    navigate(`/packages?${queryParams.join('&')}`);
  };

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="hero-tag">
              <Compass size={16} /> Premium Travel Experiences
            </div>
            <h1 className="hero-title">
              Discover the Soul of <br />
              <span>South India</span>
            </h1>
            <p className="hero-desc">
              Immerse yourself in the colonial charm of Tamil Nadu's hill stations, ancient temple architecture, and Kerala's emerald backwaters. Curating bespoke itineraries for the discerning traveler.
            </p>
            
            {/* Quick search bar */}
            <form onSubmit={handleSearchSubmit} className="glass" style={{
              display: 'flex',
              padding: '8px',
              borderRadius: '16px',
              gap: '8px',
              maxWidth: '550px',
              alignItems: 'center',
              marginTop: '16px',
              border: '1px solid var(--border-light)'
            }}>
              <div style={{ flex: 1, padding: '0 12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <MapPin size={18} style={{ color: 'var(--primary)' }} />
                <select 
                  value={searchState} 
                  onChange={(e) => setSearchState(e.target.value)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    width: '100%',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="" style={{ background: 'var(--bg-deep)' }}>Select State</option>
                  <option value="Tamil Nadu" style={{ background: 'var(--bg-deep)' }}>Tamil Nadu</option>
                  <option value="Kerala" style={{ background: 'var(--bg-deep)' }}>Kerala</option>
                </select>
              </div>
              <div style={{ width: '1px', height: '30px', background: 'var(--border-light)' }}></div>
              <div style={{ flex: 1, padding: '0 12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Compass size={18} style={{ color: 'var(--secondary)' }} />
                <select 
                  value={searchCategory} 
                  onChange={(e) => setSearchCategory(e.target.value)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    width: '100%',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="" style={{ background: 'var(--bg-deep)' }}>Select Theme</option>
                  <option value="Hills" style={{ background: 'var(--bg-deep)' }}>Hills & Valleys</option>
                  <option value="Backwaters" style={{ background: 'var(--bg-deep)' }}>Backwaters</option>
                  <option value="Beaches" style={{ background: 'var(--bg-deep)' }}>Beaches</option>
                  <option value="Temples" style={{ background: 'var(--bg-deep)' }}>Temples & Heritage</option>
                  <option value="Wildlife" style={{ background: 'var(--bg-deep)' }}>Wildlife & Spice</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '12px 20px', borderRadius: '12px' }}>
                <Search size={16} /> Search
              </button>
            </form>
          </div>

          <div className="hero-image-container">
            {/* Banner image of Kerala/TN backdrop */}
            <img 
              className="hero-image" 
              src="https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80" 
              alt="Munnar Tea Estates Kerala Banner" 
            />
            <div className="hero-badge glass">
              <div className="hero-badge-icon">
                <Star size={24} style={{ fill: 'var(--primary)', stroke: 'var(--primary)' }} />
              </div>
              <div className="hero-badge-text">
                <h4>4.9 / 5.0</h4>
                <p>Guest Satisfaction Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ADVANTAGES SPOTLIGHT */}
      <section className="section" style={{ background: 'hsla(222, 25%, 5%, 0.5)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Why VoyaLuxe</span>
            <h2 className="section-title">The Art of Experiential Travel</h2>
            <p className="section-desc">We craft journeys that go beyond sight-seeing, focusing on culture, comfort, and premium memories.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '32px',
            marginTop: '48px'
          }}>
            <div className="glass" style={{ padding: '32px', border: '1px solid var(--border-light)' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'hsla(152, 75%, 48%, 0.1)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <Award size={24} />
              </div>
              <h3 style={{ marginBottom: '12px', fontSize: '1.25rem' }}>Luxury Stays</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Handpicked 5-star colonial heritage hotels, private tea estate bungalows, and premium glass-walled houseboats.
              </p>
            </div>

            <div className="glass" style={{ padding: '32px', border: '1px solid var(--border-light)' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'hsla(38, 92%, 56%, 0.1)',
                color: 'var(--secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <Calendar size={24} />
              </div>
              <h3 style={{ marginBottom: '12px', fontSize: '1.25rem' }}>Curated Itineraries</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Balanced schedules blending active exploration (treks, yacht cruises) with relaxation and premium wellness therapies.
              </p>
            </div>

            <div className="glass" style={{ padding: '32px', border: '1px solid var(--border-light)' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'hsla(248, 85%, 66%, 0.1)',
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <Shield size={24} />
              </div>
              <h3 style={{ marginBottom: '12px', fontSize: '1.25rem' }}>Seamless Security</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                24/7 dedicated support concierge, private luxury transport, and vetted guides to ensure absolute safety and peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PACKAGES */}
      <section className="section">
        <div className="container">
          <div className="section-header" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            textAlign: 'left',
            marginBottom: '48px'
          }}>
            <div>
              <span className="section-subtitle">Exquisite Packages</span>
              <h2 className="section-title" style={{ margin: 0 }}>Featured Indulgences</h2>
            </div>
            <Link to="/packages" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
              View All Packages
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading luxury experiences...</div>
          ) : featuredPackages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
              No active packages found. Check back soon!
            </div>
          ) : (
            <div className="cards-grid">
              {featuredPackages.map((pkg) => (
                <div key={pkg.id} className="card glass">
                  <div className="card-img-wrapper">
                    <img className="card-img" src={pkg.image_url} alt={pkg.title} />
                    <div className="card-tag state">{pkg.destination_state}</div>
                    <div className="card-tag">{pkg.duration_days} Days</div>
                  </div>
                  <div className="card-body">
                    <h3 className="card-title">{pkg.title}</h3>
                    <p className="card-desc">{pkg.description}</p>
                    <div className="card-footer">
                      <div className="card-meta">
                        <Star size={16} style={{ color: 'var(--secondary)', fill: 'var(--secondary)' }} />
                        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{pkg.rating || 5.0}</span>
                        <span>({pkg.reviewsCount || 1} reviews)</span>
                      </div>
                      <div className="card-price">
                        Rs. {pkg.price.toLocaleString()}<span>/ guest</span>
                      </div>
                    </div>
                    <Link to={`/packages/${pkg.id}`} className="btn btn-primary" style={{ width: '100%', marginTop: '20px', padding: '10px' }}>
                      Experience Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. DESTINATION HIGHLIGHTSPLIT (Kerala vs Tamil Nadu) */}
      <section className="section" style={{ background: 'hsla(222, 25%, 3%, 0.8)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">States of South India</span>
            <h2 className="section-title">Two Worlds, One Extraordinary Journey</h2>
            <p className="section-desc">Select a state to explore tailored collections of destinations.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px',
            marginTop: '40px'
          }}>
            {/* Kerala Panel */}
            <div 
              onClick={() => navigate('/destinations?state=Kerala')}
              style={{
                position: 'relative',
                height: '350px',
                borderRadius: '20px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: '1px solid var(--border-light)',
                transition: 'var(--transition-smooth)'
              }}
              className="state-panel"
            >
              <img 
                src="https://images.unsplash.com/photo-1593693411515-c202e974fe62?auto=format&fit=crop&w=800&q=80" 
                alt="Kerala Backwaters" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition-smooth)' }} 
              />
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 10%, rgba(0,0,0,0.2) 70%)',
                padding: '40px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end'
              }}>
                <span style={{ color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', marginBottom: '8px' }}>Kerala Collection</span>
                <h3 style={{ fontSize: '2rem', marginBottom: '10px' }}>Discover God's Own Country</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Emerald houseboats, misty tea estates, and wild spice reserves.</p>
              </div>
            </div>

            {/* Tamil Nadu Panel */}
            <div 
              onClick={() => navigate('/destinations?state=Tamil+Nadu')}
              style={{
                position: 'relative',
                height: '350px',
                borderRadius: '20px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: '1px solid var(--border-light)',
                transition: 'var(--transition-smooth)'
              }}
              className="state-panel"
            >
              <img 
                src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80" 
                alt="Tamil Nadu Temples" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition-smooth)' }} 
              />
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 10%, rgba(0,0,0,0.2) 70%)',
                padding: '40px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end'
              }}>
                <span style={{ color: 'var(--secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', marginBottom: '8px' }}>Tamil Nadu Collection</span>
                <h3 style={{ fontSize: '2rem', marginBottom: '10px' }}>Experience Land of Temples</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Gigantic ancient gopurams, Ooty toy trains, and merging oceans.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
