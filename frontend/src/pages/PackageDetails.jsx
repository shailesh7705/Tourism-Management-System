import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Star, Clock, Users, ArrowLeft, Heart, Calendar, CreditCard, Send, Check } from 'lucide-react';

export default function PackageDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  
  // Wishlist state
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Booking states
  const [travelDate, setTravelDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');

  // Review states
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  useEffect(() => {
    async function loadPackage() {
      try {
        const data = await api.get(`/packages/${id}`);
        setPkg(data);

        // If user is logged in, check if package is in their wishlist
        if (user) {
          const list = await api.get('/wishlist');
          const found = list.some(item => item.id === data.id);
          setInWishlist(found);
        }
      } catch (err) {
        setErr(err.message || 'Failed to load package details.');
      } finally {
        setLoading(false);
      }
    }
    loadPackage();
  }, [id, user]);

  const toggleWishlist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setWishlistLoading(true);
    try {
      if (inWishlist) {
        await api.delete(`/wishlist/${pkg.id}`);
        setInWishlist(false);
      } else {
        await api.post('/wishlist', { package_id: pkg.id });
        setInWishlist(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingError('');
    setBookingSuccess('');
    setBookingLoading(true);

    try {
      const res = await api.post('/bookings', {
        package_id: pkg.id,
        travel_date: travelDate,
        total_guests: guests
      });
      setBookingSuccess(res.message);
      setTravelDate('');
      setGuests(1);
    } catch (err) {
      setBookingError(err.message || 'Failed to register booking.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewSuccess('');
    try {
      await api.post('/reviews', {
        package_id: pkg.id,
        rating: reviewRating,
        comment: reviewComment
      });
      setReviewSuccess('Review submitted! Refreshing reviews...');
      setReviewComment('');
      
      // Reload package to fetch updated reviews
      const data = await api.get(`/packages/${id}`);
      setPkg(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>Loading package details...</div>;
  if (err || !pkg) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h3 style={{ color: 'rgb(239, 68, 68)' }}>Error</h3>
        <p style={{ color: 'var(--text-secondary)' }}>{err || 'Package not found.'}</p>
        <Link to="/packages" className="btn btn-secondary" style={{ marginTop: '24px' }}><ArrowLeft size={16} /> Back to Packages</Link>
      </div>
    );
  }

  const calculatedTotalPrice = pkg.price * guests;

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <Link to="/packages" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: '600', marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Back to Packages
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '40px', alignItems: 'start' }}>
        {/* Left Side: Package details and reviews */}
        <div>
          <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', height: '400px', marginBottom: '32px', border: '1px solid var(--border-light)' }}>
            <img src={pkg.image_url} alt={pkg.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button 
              onClick={toggleWishlist} 
              disabled={wishlistLoading}
              className="glass" 
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                padding: '12px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                color: inWishlist ? 'rgb(239, 68, 68)' : 'var(--text-primary)',
                border: inWishlist ? '1px solid rgb(239, 68, 68)' : '1px solid var(--border-light)'
              }}
            >
              <Heart size={20} fill={inWishlist ? 'rgb(239, 68, 68)' : 'none'} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <span className="status-tag approved" style={{ background: 'hsla(152, 75%, 48%, 0.1)' }}>{pkg.destination_state}</span>
            <span className="status-tag pending" style={{ background: 'hsla(38, 92%, 56%, 0.1)' }}>{pkg.destination_name}</span>
          </div>

          <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>{pkg.title}</h1>
          
          <div style={{ display: 'flex', gap: '28px', borderBottom: '1px solid var(--border-light)', paddingBottom: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={20} style={{ color: 'var(--primary)' }} />
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DURATION</p>
                <h4 style={{ fontSize: '0.95rem' }}>{pkg.duration_days} Days / {pkg.duration_nights} Nights</h4>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={20} style={{ color: 'var(--secondary)' }} />
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MAX GUESTS</p>
                <h4 style={{ fontSize: '0.95rem' }}>Up to {pkg.max_people} people</h4>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Star size={20} style={{ color: 'var(--secondary)', fill: 'var(--secondary)' }} />
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>RATING</p>
                <h4 style={{ fontSize: '0.95rem' }}>{pkg.rating || 5.0} Average</h4>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '16px' }}>Experience Overview</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.8' }}>
              {pkg.description}
            </p>
          </div>

          {/* Reviews List */}
          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '40px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '24px' }}>Guest Reviews ({pkg.reviews?.length || 0})</h2>
            
            {/* Submit review form */}
            {user && user.role !== 'admin' && (
              <form onSubmit={handleReviewSubmit} className="glass" style={{ padding: '24px', marginBottom: '32px', border: '1px solid var(--border-light)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Share Your Experience</h3>
                
                {reviewSuccess && (
                  <div style={{ background: 'hsla(152, 75%, 48%, 0.15)', color: 'var(--primary)', padding: '10px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
                    {reviewSuccess}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Rating:</span>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="form-input"
                      style={{ padding: '6px 12px', background: 'var(--bg-deep)' }}
                    >
                      <option value="5">5 Stars (Excellent)</option>
                      <option value="4">4 Stars (Good)</option>
                      <option value="3">3 Stars (Average)</option>
                      <option value="2">2 Stars (Poor)</option>
                      <option value="1">1 Star (Terrible)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <textarea
                    required
                    className="form-input form-textarea"
                    placeholder="Write details about the hotels, guides, transport, and overall scenery..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                  />
                </div>
                
                <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', display: 'inline-flex', gap: '8px' }}>
                  <Send size={16} /> Submit Review
                </button>
              </form>
            )}

            {pkg.reviews?.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No reviews for this package yet. Be the first to share your journey!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {pkg.reviews?.map((review) => (
                  <div key={review.id} className="glass" style={{ padding: '24px', border: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={review.avatar_url || 'https://api.dicebear.com/7.x/adventurer/svg'} alt="avatar" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                        <h4 style={{ fontSize: '0.95rem' }}>{review.user_name}</h4>
                      </div>
                      <div style={{ display: 'flex', gap: '2px', color: 'var(--secondary)' }}>
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} size={14} fill="var(--secondary)" />
                        ))}
                      </div>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{review.comment}</p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '12px' }}>
                      Posted on {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Booking Panel */}
        <div className="glass" style={{ padding: '32px', border: '1px solid var(--border-light)', position: 'sticky', top: '90px' }}>
          <div style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Price per guest</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <h2 style={{ fontSize: '2.2rem', color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>
                Rs. {pkg.price.toLocaleString()}
              </h2>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>INR</span>
            </div>
          </div>

          {user?.role === 'admin' ? (
            <div style={{ padding: '20px 0', borderTop: '1px solid var(--border-light)', color: 'var(--text-secondary)', textAlign: 'center' }}>
              You are signed in as an Admin. Select the Admin Dashboard to manage bookings.
            </div>
          ) : !user ? (
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
              <Link to="/login" className="btn btn-accent" style={{ width: '100%', padding: '14px' }}>
                Sign In to Book Package
              </Link>
            </div>
          ) : (
            <form onSubmit={handleBooking} style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
              {bookingSuccess && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'hsla(152, 75%, 48%, 0.15)',
                  border: '1px solid hsla(152, 75%, 48%, 0.25)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: 'var(--primary)',
                  marginBottom: '20px',
                  fontSize: '0.9rem'
                }}>
                  <Check size={18} />
                  <span>{bookingSuccess}</span>
                </div>
              )}

              {bookingError && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: 'rgb(239, 68, 68)',
                  marginBottom: '20px',
                  fontSize: '0.9rem'
                }}>
                  {bookingError}
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="travel-date">Travel Date</label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="date"
                    id="travel-date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="form-input"
                    style={{ width: '100%', paddingLeft: '48px' }}
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label" htmlFor="guests">Number of Guests</label>
                <div style={{ position: 'relative' }}>
                  <Users size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="number"
                    id="guests"
                    required
                    min="1"
                    max={pkg.max_people}
                    className="form-input"
                    style={{ width: '100%', paddingLeft: '48px' }}
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                  />
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>Max guest capacity is {pkg.max_people}</span>
              </div>

              {/* Instant price tally */}
              <div style={{
                background: 'hsla(222, 25%, 8%, 0.8)',
                padding: '16px',
                borderRadius: '12px',
                marginBottom: '24px',
                border: '1px solid var(--border-light)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                  <span>Rs. {pkg.price.toLocaleString()} x {guests} guest{guests > 1 ? 's' : ''}</span>
                  <span>Rs. {calculatedTotalPrice.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '8px', fontWeight: 'bold' }}>
                  <span>Total Cost</span>
                  <span style={{ color: 'var(--primary)' }}>Rs. {calculatedTotalPrice.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={bookingLoading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', gap: '8px' }}
              >
                <CreditCard size={18} />
                {bookingLoading ? 'Reserving Journey...' : 'Book Package'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
