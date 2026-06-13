import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../utils/api';
import { Star, Search, Filter, Calendar, MapPin } from 'lucide-react';

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || '');
  const [maxBudget, setMaxBudget] = useState(30000); // Max default budget slider limit
  const [maxDuration, setMaxDuration] = useState(5); // Max default days limit

  useEffect(() => {
    async function loadPackages() {
      setLoading(true);
      try {
        let query = '';
        const params = [];
        if (selectedState) params.push(`state=${encodeURIComponent(selectedState)}`);
        if (maxBudget) params.push(`maxBudget=${maxBudget}`);
        if (maxDuration) params.push(`duration=${maxDuration}`);
        if (params.length > 0) query = `?${params.join('&')}`;

        const data = await api.get(`/packages${query}`);
        setPackages(data);
      } catch (err) {
        console.error('Error fetching packages:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPackages();
  }, [selectedState, maxBudget, maxDuration]);

  useEffect(() => {
    setSelectedState(searchParams.get('state') || '');
  }, [searchParams]);

  const handleStateChange = (state) => {
    const newParams = new URLSearchParams(searchParams);
    if (state) newParams.set('state', state);
    else newParams.delete('state');
    setSearchParams(newParams);
  };

  const filteredPackages = packages.filter(pkg => 
    pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.destination_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="section" style={{ minHeight: '80vh' }}>
      <div className="container">
        <div className="section-header" style={{ marginBottom: '40px' }}>
          <span className="section-subtitle">Luxury Collections</span>
          <h1 className="section-title">Tour Packages</h1>
          <p className="section-desc">Handpicked custom itineraries with premium hotel bookings, private transport, and local guides.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          gap: '32px',
          alignItems: 'start'
        }}>
          {/* Sidebar Filter Control Panel */}
          <div className="glass" style={{
            padding: '28px',
            border: '1px solid var(--border-light)',
            position: 'sticky',
            top: '90px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
              <Filter size={18} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)' }}>Filter Itineraries</h3>
            </div>

            <div className="form-group">
              <label className="form-label">Search Packages</label>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '36px', fontSize: '0.85rem' }}
                  placeholder="e.g. Houseboat, Resort..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '20px' }}>
              <label className="form-label">Destination State</label>
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="form-input"
                style={{ background: 'var(--bg-deep)', fontSize: '0.85rem' }}
              >
                <option value="">All States</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Kerala">Kerala</option>
              </select>
            </div>

            <div className="form-group" style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label className="form-label" style={{ margin: 0 }}>Max Budget (Rs.)</label>
                <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold' }}>Rs. {maxBudget.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="30000"
                step="1000"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                style={{ accentColor: 'var(--primary)', cursor: 'pointer', width: '100%' }}
              />
            </div>

            <div className="form-group" style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label className="form-label" style={{ margin: 0 }}>Max Duration (Days)</label>
                <span style={{ fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: 'bold' }}>{maxDuration} Days</span>
              </div>
              <input
                type="range"
                min="2"
                max="5"
                step="1"
                value={maxDuration}
                onChange={(e) => setMaxDuration(Number(e.target.value))}
                style={{ accentColor: 'var(--secondary)', cursor: 'pointer', width: '100%' }}
              />
            </div>
          </div>

          {/* Packages Display Grid */}
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px' }}>Loading packages...</div>
            ) : filteredPackages.length === 0 ? (
              <div className="glass" style={{
                padding: '60px 40px',
                textAlign: 'center',
                border: '1px solid var(--border-light)',
                color: 'var(--text-secondary)'
              }}>
                <h3>No Packages Match Your Criteria</h3>
                <p style={{ marginTop: '8px', fontSize: '0.9rem' }}>Try clearing filters or adjusting your budget range slider.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {filteredPackages.map((pkg) => (
                  <div key={pkg.id} className="card glass">
                    <div className="card-img-wrapper" style={{ height: '200px' }}>
                      <img className="card-img" src={pkg.image_url} alt={pkg.title} />
                      <div className="card-tag state">{pkg.destination_state}</div>
                      <div className="card-tag">{pkg.duration_days} Days</div>
                    </div>
                    <div className="card-body" style={{ padding: '20px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600', marginBottom: '8px' }}>
                        <MapPin size={12} />
                        {pkg.destination_name}
                      </span>
                      <h3 className="card-title" style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{pkg.title}</h3>
                      <p className="card-desc" style={{ fontSize: '0.85rem', marginBottom: '16px' }}>{pkg.description}</p>
                      
                      <div className="card-footer" style={{ paddingT: '12px' }}>
                        <div className="card-meta">
                          <Star size={14} style={{ color: 'var(--secondary)', fill: 'var(--secondary)' }} />
                          <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{pkg.rating || 5.0}</span>
                          <span>({pkg.reviewsCount || 1})</span>
                        </div>
                        <div className="card-price" style={{ fontSize: '1.15rem' }}>
                          Rs. {pkg.price.toLocaleString()}<span>/ guest</span>
                        </div>
                      </div>
                      
                      <Link to={`/packages/${pkg.id}`} className="btn btn-primary" style={{ width: '100%', marginTop: '16px', padding: '10px' }}>
                        Reserve Journey
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
