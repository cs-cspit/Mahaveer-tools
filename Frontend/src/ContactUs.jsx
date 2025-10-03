import React, { useState } from 'react';
import logo2 from './assets/logo2.png';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit inquiry to backend API
    (async () => {
      try {
  const res = await fetch('https://mahaveer-tools.onrender.com/api/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || 'Failed to submit');
        alert('Thank you — your message has been sent.');
        setFormData({ name: '', email: '', message: '' });
      } catch (err) {
        alert(err.message || 'Failed to send message. Please try again later.');
      }
    })();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      {/* Simple Header */}
      <div style={{
        background: '#1a2640',
        color: '#fff',
        padding: '5rem 2rem 4rem',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: 700, 
          margin: '0 0 1rem 0'
        }}>Contact Us</h1>
        <p style={{ 
          fontSize: '1.2rem', 
          color: 'rgba(255,255,255,0.85)',
          maxWidth: '700px',
          margin: '0 auto'
        }}>
          Have a question or need assistance? We're here to help you find the perfect tools for your needs.
        </p>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '3rem 2rem'
      }}>
        {/* Contact Info Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: '2rem',
            textAlign: 'center',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              fontSize: '2.5rem',
              marginBottom: '1rem'
            }}>📧</div>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: 700,
              color: '#1a2640',
              marginBottom: '0.5rem'
            }}>Email</h3>
            <p style={{
              fontSize: '1.1rem',
              color: '#4a5568',
              margin: 0
            }}>jainarham14@gmail.com</p>
          </div>

          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: '2rem',
            textAlign: 'center',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              fontSize: '2.5rem',
              marginBottom: '1rem'
            }}>📞</div>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: 700,
              color: '#1a2640',
              marginBottom: '0.5rem'
            }}>Phone</h3>
            <p style={{
              fontSize: '1.1rem',
              color: '#4a5568',
              margin: 0
            }}>+91-98251-66895</p>
          </div>

          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: '2rem',
            textAlign: 'center',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              fontSize: '2.5rem',
              marginBottom: '1rem'
            }}>🏢</div>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: 700,
              color: '#1a2640',
              marginBottom: '0.5rem'
            }}>Address</h3>
            <p style={{
              fontSize: '1rem',
              color: '#4a5568',
              margin: 0,
              lineHeight: '1.5'
            }}>GF-7 alaknanda complex<br/>Opp. Petrol Pump, Mujmahuda<br/>Vadodara, Gujarat 390020</p>
          </div>
        </div>

        {/* Form and Map Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
          gap: '2rem'
        }}>
          {/* Contact Form */}
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: '2.5rem',
            border: '1px solid #e5e7eb'
          }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: 700,
              color: '#1a2640',
              marginBottom: '1.5rem'
            }}>Send us a Message</h2>
            
            <form onSubmit={handleSubmit} style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1.5rem' 
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#1a2640',
                  marginBottom: '0.5rem'
                }}>Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name" 
                  required 
                  style={{ 
                    width: '100%',
                    padding: '0.9rem', 
                    borderRadius: 8, 
                    border: '1px solid #d1d5db', 
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    background: '#fff',
                    color: '#000'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#1a2640';
                    e.target.style.outline = 'none';
                  }}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#1a2640',
                  marginBottom: '0.5rem'
                }}>Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com" 
                  required 
                  style={{ 
                    width: '100%',
                    padding: '0.9rem', 
                    borderRadius: 8, 
                    border: '1px solid #d1d5db', 
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    background: '#fff',
                    color: '#000'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#1a2640';
                    e.target.style.outline = 'none';
                  }}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#1a2640',
                  marginBottom: '0.5rem'
                }}>Message</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="How can we help you?" 
                  required 
                  rows={5} 
                  style={{ 
                    width: '100%',
                    padding: '0.9rem', 
                    borderRadius: 8, 
                    border: '1px solid #d1d5db', 
                    fontSize: '1rem', 
                    resize: 'vertical',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    background: '#fff',
                    color: '#000'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#1a2640';
                    e.target.style.outline = 'none';
                  }}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
              
              <button 
                type="submit" 
                style={{ 
                  background: '#1a2640', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 8, 
                  padding: '1rem', 
                  fontWeight: 600, 
                  fontSize: '1.05rem', 
                  cursor: 'pointer', 
                  transition: 'all 0.3s ease',
                  fontFamily: 'inherit'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#2d3748';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#1a2640';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Map */}
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: '2.5rem',
            border: '1px solid #e5e7eb'
          }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: 700,
              color: '#1a2640',
              marginBottom: '1.5rem'
            }}>Find Us</h2>
            
            <div style={{
              width: '100%',
              height: '400px',
              borderRadius: 8,
              overflow: 'hidden',
              border: '1px solid #e5e7eb'
            }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d230.7386882901236!2d73.1681606422821!3d22.28484471808152!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fc6106951a5d7%3A0x7484f7dd9ef636eb!2s12%2C%20Alaknanda%20Complex%2C%20Akota%20Rd%2C%20Opposite%20Bharat%20Petrol%20Pump%2C%20Bhairav%20Nagar%2C%20Muj%20Mahuda%2C%20Vadodara%2C%20Gujarat%20390020!5e0!3m2!1sen!2sin!4v1754036693620!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mahaveer Tools Location"
              ></iframe>
            </div>
            
            <a 
              href="https://maps.google.com/?q=GF-7+alaknanda+complex+Opp+Petrol+Pump+Mujmahuda+vadodara+Gujarat+390020"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                marginTop: '1rem',
                textAlign: 'center',
                background: '#f8f9fa',
                color: '#1a2640',
                textDecoration: 'none',
                padding: '0.9rem',
                borderRadius: 8,
                fontWeight: 600,
                transition: 'all 0.3s ease',
                border: '1px solid #e5e7eb'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#1a2640';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f8f9fa';
                e.currentTarget.style.color = '#1a2640';
              }}
            >
              Get Directions →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 