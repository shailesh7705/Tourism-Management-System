import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Heart, ShieldAlert, Clock, Star, Trash2 } from 'lucide-react';

export default function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    async function loadDashboardData() {
      try {
        const bookingsData = await api.get('/bookings/my-bookings');
        setBookings(bookingsData);

        const wishlistData = await api.get('/wishlist');
        setWishlist(wishlistData);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [user, navigate]);

  const removeFromWishlist = async (pkgId) => {
    try {
      await api.delete(`/wishlist/${pkgId}`);
      // Remove local copy
      setWishlist(prev => prev.filter(item => item.id !== pkgId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>Loading your dashboard...</div>;

  return (
    <div className="container" style={{ padding: '40px 24px', minHeight: '80vh' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-display)' }}>Welcome, {user?.name}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track your booking requests and view favorited destinations.</p>
      </div>

      <div className="dashboard-grid">
        {/* Sidebar Navigation */}
        <div className="sidebar">
          <button 
            className={`sidebar-link ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
            style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
          >
            <Calendar size={18} /> My Bookings ({bookings.length})
          </button>
          <button 
            className={`sidebar-link ${activeTab === 'wishlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('wishlist')}
            style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
          >
            <Heart size={18} /> My Wishlist ({wishlist.length})
          </button>
          <Link to="/profile" className="sidebar-link">
            <Clock size={18} /> Edit Profile
          </Link>
        </div>

        {/* Dynamic content panels */}
        <div>
          {activeTab === 'bookings' ? (
            <div className="glass" style={{ padding: '32px', border: '1px solid var(--border-light)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '24px', fontSize: '1.4rem' }}>Booking History</h2>
              
              {bookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
                  <ShieldAlert size={40} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
                  <p>You haven't booked any packages yet.</p>
                  <Link to="/packages" className="btn btn-primary" style={{ marginTop: '20px' }}>Browse Tour Packages</Link>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Package</th>
                        <th>Destination</th>
                        <th>Travel Date</th>
                        <th>Guests</th>
                        <th>Total Cost</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.id}>
                          <td style={{ fontWeight: '600' }}>
                            <Link to={`/packages/${booking.package_id}`} style={{ color: 'var(--primary)' }}>
                              {booking.package_title}
                            </Link>
                          </td>
                          <td>{booking.destination_name}</td>
                          <td>{new Date(booking.travel_date).toLocaleDateString()}</td>
                          <td>{booking.total_guests}</td>
                          <td style={{ fontWeight: 'bold' }}>Rs. {booking.total_price.toLocaleString()}</td>
                          <td>
                            <span className={`status-tag ${booking.status}`}>
                              {booking.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="glass" style={{ padding: '32px', border: '1px solid var(--border-light)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '24px', fontSize: '1.4rem' }}>My Wishlist</h2>
              
              {wishlist.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
                  <Heart size={40} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
                  <p>Your wishlist is empty. Add itineraries to save them here.</p>
                  <Link to="/packages" className="btn btn-primary" style={{ marginTop: '20px' }}>Browse Packages</Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
                  {wishlist.map((pkg) => (
                    <div key={pkg.id} className="card glass" style={{ border: '1px solid var(--border-light)' }}>
                      <div className="card-img-wrapper" style={{ height: '150px' }}>
                        <img className="card-img" src={pkg.image_url} alt={pkg.title} />
                      </div>
                      <div className="card-body" style={{ padding: '16px' }}>
                        <h3 className="card-title" style={{ fontSize: '1.05rem', marginBottom: '8px' }}>{pkg.title}</h3>
                        <p style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1rem', marginBottom: '16px' }}>
                          Rs. {pkg.price.toLocaleString()}
                        </p>
                        <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                          <Link to={`/packages/${pkg.id}`} className="btn btn-primary" style={{ flexGrow: 1, padding: '8px', fontSize: '0.85rem' }}>
                            Book
                          </Link>
                          <button 
                            onClick={() => removeFromWishlist(pkg.id)}
                            className="btn btn-secondary" 
                            style={{ padding: '8px', color: 'rgb(239, 68, 68)', border: '1px solid rgba(239,68,68,0.2)' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
