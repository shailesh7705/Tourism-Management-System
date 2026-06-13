import React, { useState } from 'react';
import { api } from '../utils/api';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setLoading(true);

    try {
      const res = await api.post('/contact', { name, email, message });
      setSuccess(res.message);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <div className="container">
        <div className="section-header" style={{ marginBottom: '60px' }}>
          <span className="section-subtitle">Get In Touch</span>
          <h1 className="section-title">Contact Our Concierge</h1>
          <p className="section-desc">Have questions about packages, local transport, or custom travel routes? Write to us.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'start' }}>
          {/* Contact Details */}
          <div className="glass" style={{ padding: '40px', border: '1px solid var(--border-light)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '24px', fontSize: '1.5rem' }}>Luxury Travel HQ</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: '1.7' }}>
              The Tourism Management System coordinates travel plans directly with licensed local transport networks, boutique heritage hotels, and nature naturalists in Tamil Nadu and Kerala.
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'hsla(152, 75%, 48%, 0.1)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '4px' }}>Office Location</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>12, IT Highway, OMR, Chennai, Tamil Nadu, India</p>
                </div>
              </li>

              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'hsla(38, 92%, 56%, 0.1)',
                  color: 'var(--secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Phone size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '4px' }}>Concierge Hotline</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>+91 98765 43210 (Mon-Sat, 9AM to 7PM)</p>
                </div>
              </li>

              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'hsla(248, 85%, 66%, 0.1)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Mail size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '4px' }}>Email Enquiries</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>concierge@voyaluxe.com</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact Form */}
          <div className="glass" style={{ padding: '40px', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '24px', fontFamily: 'var(--font-display)' }}>Send a Message</h3>
            
            {success && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'hsla(152, 75%, 48%, 0.15)',
                border: '1px solid hsla(152, 75%, 48%, 0.25)',
                borderRadius: '8px',
                padding: '12px 16px',
                color: 'var(--primary)',
                marginBottom: '24px',
                fontSize: '0.9rem'
              }}>
                <Check size={18} />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="contact-name">Your Name</label>
                <input
                  type="text"
                  id="contact-name"
                  required
                  className="form-input"
                  style={{ width: '100%' }}
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-email">Email Address</label>
                <input
                  type="email"
                  id="contact-email"
                  required
                  className="form-input"
                  style={{ width: '100%' }}
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label" htmlFor="contact-message">Message Details</label>
                <textarea
                  id="contact-message"
                  required
                  className="form-input form-textarea"
                  placeholder="How can we assist you with your Tamil Nadu or Kerala trip? Tell us group size, interests, etc..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', gap: '8px' }}
              >
                <Send size={16} />
                {loading ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
