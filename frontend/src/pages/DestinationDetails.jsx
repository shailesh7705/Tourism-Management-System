import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { Star, MapPin, Clock, ArrowLeft, Users } from 'lucide-react';

export default function DestinationDetails() {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    async function loadDetails() {
      try {
        const data = await api.get(`/destinations/${id}`);
        setDestination(data);
      } catch (err) {
        setErr(err.message || 'Failed to load destination details.');
      } finally {
        setLoading(false);
      }
    }
    loadDetails();
  }, [id]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>Loading destination info...</div>;
  }

  if (err || !destination) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h3 style={{ color: 'rgb(239, 68, 68)' }}>Error</h3>
        <p style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>{err || 'Destination not found.'}</p>
        <Link to="/destinations" className="btn btn-secondary" style={{ marginTop: '24px' }}>
          <ArrowLeft size={16} /> Back to Destinations
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Dynamic Header Banner */}
      <div style={{
        position: 'relative',
        height: '400px',
        overflow: 'hidden'
      }}>
        <img 
          src={destination.image_url} 
          alt={destination.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9) 15%, rgba(0, 0, 0, 0.2) 80%)',
          display: 'flex',
          alignItems: 'flex-end',
          paddingBottom: '48px'
        }}>
          <div className="container">
            <Link to="/destinations" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--primary)',
              fontWeight: '600',
              marginBottom: '20px',
              fontSize: '0.9rem'
            }}>
              <ArrowLeft size={16} /> Back to Destinations
            </Link>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <span className="status-tag approved" style={{ background: 'hsla(152, 75%, 48%, 0.15)' }}>{destination.state}</span>
              <span className="status-tag pending" style={{ background: 'hsla(38, 92%, 56%, 0.15)' }}>{destination.category}</span>
            </div>
            
            <h1 style={{ fontSize: '3.5rem', marginBottom: '8px' }}>{destination.name}</h1>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '60px 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '48px',
          alignItems: 'start',
          marginBottom: '60px'
        }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '20px', fontSize: '1.75rem' }}>About this Destination</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.8' }}>
              {destination.description}
            </p>
          </div>

          <div className="glass" style={{ padding: '32px', border: '1px solid var(--border-light)' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>Travel Guidelines</h3>
            <ul style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              fontSize: '0.9rem',
              color: 'var(--text-secondary)'
            }}>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✓</span>
                <span>Best time to visit: October to March (for backwaters & beaches) or Summer (for hills).</span>
              </li>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✓</span>
                <span>Clothing: Warm clothing for Ooty/Munnar, light cotton for plains & coastal areas.</span>
              </li>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✓</span>
                <span>Local transport: Private luxury sedans can be scheduled through our dashboard.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Available Packages section */}
        <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '32px', fontSize: '1.75rem' }}>
          Available Packages in {destination.name}
        </h2>

        {destination.packages.length === 0 ? (
          <div className="glass" style={{
            padding: '40px',
            textAlign: 'center',
            border: '1px solid var(--border-light)',
            color: 'var(--text-secondary)'
          }}>
            No active tour packages are registered for this destination yet. Contact support to schedule custom VIP itineraries.
          </div>
        ) : (
          <div className="cards-grid">
            {destination.packages.map((pkg) => (
              <div key={pkg.id} className="card glass">
                <div className="card-img-wrapper">
                  <img className="card-img" src={pkg.image_url} alt={pkg.title} />
                  <div className="card-tag">{pkg.duration_days}D / {pkg.duration_nights}N</div>
                </div>
                <div className="card-body">
                  <h3 className="card-title" style={{ fontSize: '1.25rem' }}>{pkg.title}</h3>
                  <p className="card-desc" style={{ fontSize: '0.85rem' }}>{pkg.description}</p>
                  
                  <div style={{ display: 'flex', gap: '16px', margin: '16px 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} style={{ color: 'var(--primary)' }} />
                      {pkg.duration_days} Days
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={14} style={{ color: 'var(--secondary)' }} />
                      Max {pkg.max_people} Guests
                    </span>
                  </div>

                  <div className="card-footer">
                    <div className="card-meta">
                      <Star size={16} style={{ color: 'var(--secondary)', fill: 'var(--secondary)' }} />
                      <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{pkg.rating || 5.0}</span>
                      <span>({pkg.reviewsCount || 1})</span>
                    </div>
                    <div className="card-price">
                      Rs. {pkg.price.toLocaleString()}<span>/ guest</span>
                    </div>
                  </div>
                  
                  <Link to={`/packages/${pkg.id}`} className="btn btn-primary" style={{ width: '100%', marginTop: '20px', padding: '10px' }}>
                    View Package & Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
