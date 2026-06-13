import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../utils/api';
import { MapPin, Search, Grid, Map } from 'lucide-react';

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');

  useEffect(() => {
    async function loadDestinations() {
      setLoading(true);
      try {
        // Construct query parameters
        let query = '';
        const params = [];
        if (selectedState) params.push(`state=${encodeURIComponent(selectedState)}`);
        if (selectedCategory) params.push(`category=${encodeURIComponent(selectedCategory)}`);
        if (params.length > 0) query = `?${params.join('&')}`;

        const data = await api.get(`/destinations${query}`);
        setDestinations(data);
      } catch (err) {
        console.error('Error fetching destinations:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDestinations();
  }, [selectedState, selectedCategory]);

  // Sync state filters if URL parameters change
  useEffect(() => {
    setSelectedState(searchParams.get('state') || '');
    setSelectedCategory(searchParams.get('category') || '');
  }, [searchParams]);

  const handleStateChange = (state) => {
    const newParams = new URLSearchParams(searchParams);
    if (state) newParams.set('state', state);
    else newParams.delete('state');
    setSearchParams(newParams);
  };

  const handleCategoryChange = (cat) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat) newParams.set('category', cat);
    else newParams.delete('category');
    setSearchParams(newParams);
  };

  // Filter list by text input client-side
  const filteredDestinations = destinations.filter(dest =>
    dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="section" style={{ minHeight: '80vh' }}>
      <div className="container">
        <div className="section-header" style={{ marginBottom: '40px' }}>
          <span className="section-subtitle">Exquisite Paradises</span>
          <h1 className="section-title">Explore Our Destinations</h1>
          <p className="section-desc">Browse through handpicked destinations in Tamil Nadu and Kerala categorised by unique experiences.</p>
        </div>

        {/* Filter Toolbar */}
        <div className="glass" style={{
          padding: '20px 24px',
          border: '1px solid var(--border-light)',
          borderRadius: '16px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '40px'
        }}>
          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '280px', flexGrow: 1 }}>
            <Search size={18} style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }} />
            <input
              type="text"
              className="form-input"
              style={{ width: '100%', paddingLeft: '48px' }}
              placeholder="Search destinations (e.g. Munnar, Ooty)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* State & Category Filters */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>State:</span>
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="form-input"
                style={{ padding: '8px 12px', background: 'var(--bg-deep)' }}
              >
                <option value="">All States</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Kerala">Kerala</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Theme:</span>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="form-input"
                style={{ padding: '8px 12px', background: 'var(--bg-deep)' }}
              >
                <option value="">All Themes</option>
                <option value="Hills">Hills & Valleys</option>
                <option value="Backwaters">Backwaters</option>
                <option value="Beaches">Beaches</option>
                <option value="Temples">Temples & Heritage</option>
                <option value="Wildlife">Wildlife & Forest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>Loading destinations...</div>
        ) : filteredDestinations.length === 0 ? (
          <div className="glass" style={{
            padding: '60px 40px',
            textAlign: 'center',
            border: '1px solid var(--border-light)',
            color: 'var(--text-secondary)'
          }}>
            <Map size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
            <h3>No Destinations Found</h3>
            <p style={{ marginTop: '8px' }}>Try resetting your filters or modifying your search query.</p>
          </div>
        ) : (
          <div className="cards-grid">
            {filteredDestinations.map((dest) => (
              <div key={dest.id} className="card glass">
                <div className="card-img-wrapper" style={{ height: '250px' }}>
                  <img className="card-img" src={dest.image_url} alt={dest.name} />
                  <div className="card-tag state">{dest.state}</div>
                  <div className="card-tag">{dest.category}</div>
                </div>
                <div className="card-body">
                  <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={18} style={{ color: 'var(--primary)' }} />
                    {dest.name}
                  </h3>
                  <p className="card-desc" style={{ marginBottom: '24px' }}>{dest.description}</p>
                  
                  <Link to={`/destinations/${dest.id}`} className="btn btn-primary" style={{ marginTop: 'auto', width: '100%', padding: '12px' }}>
                    Explore Packages
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
