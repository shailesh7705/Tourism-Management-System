import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, MapPin, Package, FileText, Check, X, Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [packages, setPackages] = useState([]);
  
  const [activeTab, setActiveTab] = useState('bookings');
  const [loading, setLoading] = useState(true);

  // Forms state
  const [destForm, setDestForm] = useState({ id: null, name: '', state: 'Tamil Nadu', description: '', category: 'Hills', image_url: '' });
  const [pkgForm, setPkgForm] = useState({ id: null, destination_id: '', title: '', description: '', price: 10000, duration_days: 3, duration_nights: 2, max_people: 4, image_url: '' });
  const [showDestForm, setShowDestForm] = useState(false);
  const [showPkgForm, setShowPkgForm] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
      return;
    }

    async function loadAdminData() {
      try {
        const statsData = await api.get('/admin/stats');
        setStats(statsData);

        const bookingsData = await api.get('/bookings');
        setBookings(bookingsData);

        const destsData = await api.get('/destinations');
        setDestinations(destsData);

        const pkgsData = await api.get('/packages');
        setPackages(pkgsData);
      } catch (err) {
        console.error('Error fetching admin data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, [isAdmin, navigate]);

  const refreshData = async () => {
    try {
      const statsData = await api.get('/admin/stats');
      setStats(statsData);
      const bookingsData = await api.get('/bookings');
      setBookings(bookingsData);
      const destsData = await api.get('/destinations');
      setDestinations(destsData);
      const pkgsData = await api.get('/packages');
      setPackages(pkgsData);
    } catch (err) {
      console.error(err);
    }
  };

  // Booking Approve/Reject
  const handleBookingAction = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // Destination Submit (Create/Update)
  const handleDestSubmit = async (e) => {
    e.preventDefault();
    try {
      if (destForm.id) {
        await api.put(`/destinations/${destForm.id}`, destForm);
      } else {
        await api.post('/destinations', destForm);
      }
      setDestForm({ id: null, name: '', state: 'Tamil Nadu', description: '', category: 'Hills', image_url: '' });
      setShowDestForm(false);
      refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Destination
  const handleDestDelete = async (id) => {
    if (!window.confirm('Delete this destination and all its packages?')) return;
    try {
      await api.delete(`/destinations/${id}`);
      refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // Package Submit (Create/Update)
  const handlePkgSubmit = async (e) => {
    e.preventDefault();
    try {
      if (pkgForm.id) {
        await api.put(`/packages/${pkgForm.id}`, pkgForm);
      } else {
        await api.post('/packages', pkgForm);
      }
      setPkgForm({ id: null, destination_id: '', title: '', description: '', price: 10000, duration_days: 3, duration_nights: 2, max_people: 4, image_url: '' });
      setShowPkgForm(false);
      refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Package
  const handlePkgDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    try {
      await api.delete(`/packages/${id}`);
      refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>Loading admin dashboard...</div>;

  return (
    <div className="container" style={{ padding: '40px 24px', minHeight: '90vh' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-display)' }}>Admin Management Console</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome, {user?.name}. Oversee bookings, manage packages, and inspect revenues.</p>
      </div>

      {/* 1. ANALYTICS CARDS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        <div className="glass" style={{ padding: '24px', border: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TOTAL REVENUE</span>
          <h2 style={{ fontSize: '2rem', color: 'var(--primary)', marginTop: '8px' }}>
            Rs. {stats?.revenue?.toLocaleString() || 0}
          </h2>
        </div>
        <div className="glass" style={{ padding: '24px', border: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TOTAL BOOKINGS</span>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginTop: '8px' }}>
            {stats?.bookingsCount || 0}
          </h2>
        </div>
        <div className="glass" style={{ padding: '24px', border: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TOTAL CLIENTS</span>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginTop: '8px' }}>
            {stats?.usersCount || 0}
          </h2>
        </div>
        <div className="glass" style={{ padding: '24px', border: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ACTIVE PACKAGES</span>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginTop: '8px' }}>
            {stats?.packagesCount || 0}
          </h2>
        </div>
      </div>

      {/* 2. STATE SPLIT GRAPH (Kerala vs TN) */}
      <div className="glass" style={{ padding: '32px', border: '1px solid var(--border-light)', marginBottom: '40px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '12px' }}>Bookings split by State</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Comparing user engagement across regions.</p>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginTop: '24px' }}>
          {stats?.stateSplit?.map((item, idx) => {
            const count = item.count;
            const state = item.state;
            const percentage = stats.bookingsCount > 0 ? (count / stats.bookingsCount) * 100 : 0;
            const color = state === 'Kerala' ? 'var(--primary)' : 'var(--secondary)';
            return (
              <div key={idx} style={{ flexGrow: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                  <span>{state}</span>
                  <span style={{ fontWeight: 'bold' }}>{count} Bookings ({percentage.toFixed(0)}%)</span>
                </div>
                <div style={{ height: '12px', background: 'var(--bg-deep)', borderRadius: '100px', overflow: 'hidden' }}>
                  <div style={{ width: `${percentage}%`, height: '100%', background: color }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. MANAGEMENT PAGES / TABS */}
      <div className="dashboard-grid">
        {/* Sidebar */}
        <div className="sidebar">
          <button 
            className={`sidebar-link ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
            style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
          >
            <FileText size={18} /> Bookings Manager
          </button>
          <button 
            className={`sidebar-link ${activeTab === 'destinations' ? 'active' : ''}`}
            onClick={() => { setActiveTab('destinations'); setShowDestForm(false); }}
            style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
          >
            <MapPin size={18} /> Destinations CRUD
          </button>
          <button 
            className={`sidebar-link ${activeTab === 'packages' ? 'active' : ''}`}
            onClick={() => { setActiveTab('packages'); setShowPkgForm(false); }}
            style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
          >
            <Package size={18} /> Packages CRUD
          </button>
        </div>

        {/* Tab content panel */}
        <div>
          {/* A. BOOKINGS MANAGER */}
          {activeTab === 'bookings' && (
            <div className="glass" style={{ padding: '32px', border: '1px solid var(--border-light)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '24px', fontSize: '1.4rem' }}>Manage Bookings</h2>
              
              {bookings.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No booking inquiries found in database.</p>
              ) : (
                <div className="table-wrapper">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Client</th>
                        <th>Package</th>
                        <th>Travel Date</th>
                        <th>Total Cost</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.id}>
                          <td>
                            <div style={{ fontWeight: '600' }}>{booking.user_name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{booking.user_email}</div>
                          </td>
                          <td>
                            <div>{booking.package_title}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{booking.destination_name}</div>
                          </td>
                          <td>{new Date(booking.travel_date).toLocaleDateString()}</td>
                          <td style={{ fontWeight: 'bold' }}>Rs. {booking.total_price.toLocaleString()}</td>
                          <td>
                            <span className={`status-tag ${booking.status}`}>{booking.status.toUpperCase()}</span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {booking.status === 'pending' && (
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                <button 
                                  onClick={() => handleBookingAction(booking.id, 'approved')}
                                  className="btn btn-primary" 
                                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                >
                                  <Check size={14} /> Approve
                                </button>
                                <button 
                                  onClick={() => handleBookingAction(booking.id, 'rejected')}
                                  className="btn btn-secondary" 
                                  style={{ padding: '6px 12px', fontSize: '0.8rem', color: 'rgb(239, 68, 68)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                                >
                                  <X size={14} /> Reject
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* B. DESTINATIONS CRUD */}
          {activeTab === 'destinations' && (
            <div className="glass" style={{ padding: '32px', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>Destinations Manager</h2>
                {!showDestForm && (
                  <button onClick={() => { setShowDestForm(true); setDestForm({ id: null, name: '', state: 'Tamil Nadu', description: '', category: 'Hills', image_url: '' }); }} className="btn btn-primary" style={{ padding: '8px 16px' }}>
                    <Plus size={16} /> Add Destination
                  </button>
                )}
              </div>

              {showDestForm && (
                <form onSubmit={handleDestSubmit} className="glass" style={{ padding: '24px', marginBottom: '32px', border: '1px solid var(--border-light)' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '20px' }}>{destForm.id ? 'Edit Destination' : 'Add New Destination'}</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Destination Name</label>
                      <input type="text" className="form-input" required value={destForm.name} onChange={(e) => setDestForm({ ...destForm, name: e.target.value })} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">State</label>
                      <select className="form-input" style={{ background: 'var(--bg-deep)' }} value={destForm.state} onChange={(e) => setDestForm({ ...destForm, state: e.target.value })}>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Kerala">Kerala</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Category Theme</label>
                      <select className="form-input" style={{ background: 'var(--bg-deep)' }} value={destForm.category} onChange={(e) => setDestForm({ ...destForm, category: e.target.value })}>
                        <option value="Hills">Hills</option>
                        <option value="Temples">Temples</option>
                        <option value="Beaches">Beaches</option>
                        <option value="Backwaters">Backwaters</option>
                        <option value="Wildlife">Wildlife</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Image URL</label>
                      <input type="url" className="form-input" required value={destForm.image_url} onChange={(e) => setDestForm({ ...destForm, image_url: e.target.value })} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description Details</label>
                    <textarea className="form-input form-textarea" required value={destForm.description} onChange={(e) => setDestForm({ ...destForm, description: e.target.value })} />
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                    <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px' }}>Save</button>
                    <button type="button" onClick={() => setShowDestForm(false)} className="btn btn-secondary" style={{ padding: '10px 20px' }}>Cancel</button>
                  </div>
                </form>
              )}

              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>State</th>
                      <th>Category</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {destinations.map((dest) => (
                      <tr key={dest.id}>
                        <td style={{ fontWeight: '600' }}>{dest.name}</td>
                        <td>{dest.state}</td>
                        <td>{dest.category}</td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button 
                              onClick={() => { setDestForm(dest); setShowDestForm(true); }}
                              className="btn btn-secondary" 
                              style={{ padding: '6px 10px' }}
                            >
                              <Edit size={14} />
                            </button>
                            <button 
                              onClick={() => handleDestDelete(dest.id)}
                              className="btn btn-secondary" 
                              style={{ padding: '6px 10px', color: 'rgb(239, 68, 68)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* C. PACKAGES CRUD */}
          {activeTab === 'packages' && (
            <div className="glass" style={{ padding: '32px', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>Packages Manager</h2>
                {!showPkgForm && (
                  <button onClick={() => { setShowPkgForm(true); setPkgForm({ id: null, destination_id: destinations[0]?.id || '', title: '', description: '', price: 12000, duration_days: 3, duration_nights: 2, max_people: 4, image_url: '' }); }} className="btn btn-primary" style={{ padding: '8px 16px' }}>
                    <Plus size={16} /> Add Package
                  </button>
                )}
              </div>

              {showPkgForm && (
                <form onSubmit={handlePkgSubmit} className="glass" style={{ padding: '24px', marginBottom: '32px', border: '1px solid var(--border-light)' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '20px' }}>{pkgForm.id ? 'Edit Package' : 'Add Tour Package'}</h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Linked Destination</label>
                      <select className="form-input" style={{ background: 'var(--bg-deep)' }} value={pkgForm.destination_id} onChange={(e) => setPkgForm({ ...pkgForm, destination_id: Number(e.target.value) })}>
                        {destinations.map(d => (
                          <option key={d.id} value={d.id}>{d.name} ({d.state})</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Package Title</label>
                      <input type="text" className="form-input" required value={pkgForm.title} onChange={(e) => setPkgForm({ ...pkgForm, title: e.target.value })} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Price (Rs.)</label>
                      <input type="number" className="form-input" required value={pkgForm.price} onChange={(e) => setPkgForm({ ...pkgForm, price: Number(e.target.value) })} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Max Guest Capacity</label>
                      <input type="number" className="form-input" required value={pkgForm.max_people} onChange={(e) => setPkgForm({ ...pkgForm, max_people: Number(e.target.value) })} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Duration Days</label>
                      <input type="number" className="form-input" required value={pkgForm.duration_days} onChange={(e) => setPkgForm({ ...pkgForm, duration_days: Number(e.target.value) })} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Duration Nights</label>
                      <input type="number" className="form-input" required value={pkgForm.duration_nights} onChange={(e) => setPkgForm({ ...pkgForm, duration_nights: Number(e.target.value) })} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Image URL</label>
                    <input type="url" className="form-input" required value={pkgForm.image_url} onChange={(e) => setPkgForm({ ...pkgForm, image_url: e.target.value })} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Package Details & Description</label>
                    <textarea className="form-input form-textarea" required value={pkgForm.description} onChange={(e) => setPkgForm({ ...pkgForm, description: e.target.value })} />
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                    <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px' }}>Save</button>
                    <button type="button" onClick={() => setShowPkgForm(false)} className="btn btn-secondary" style={{ padding: '10px 20px' }}>Cancel</button>
                  </div>
                </form>
              )}

              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Location</th>
                      <th>Price</th>
                      <th>Duration</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packages.map((pkg) => (
                      <tr key={pkg.id}>
                        <td style={{ fontWeight: '600' }}>{pkg.title}</td>
                        <td>{pkg.destination_name}</td>
                        <td>Rs. {pkg.price.toLocaleString()}</td>
                        <td>{pkg.duration_days}D/{pkg.duration_nights}N</td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button 
                              onClick={() => { setPkgForm(pkg); setShowPkgForm(true); }}
                              className="btn btn-secondary" 
                              style={{ padding: '6px 10px' }}
                            >
                              <Edit size={14} />
                            </button>
                            <button 
                              onClick={() => handlePkgDelete(pkg.id)}
                              className="btn btn-secondary" 
                              style={{ padding: '6px 10px', color: 'rgb(239, 68, 68)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
