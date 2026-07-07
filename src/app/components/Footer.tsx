import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <h2>AVENOOKS</h2>
          <p>
            We specialize in providing our clients with fresh, nutritious, and health-conscious foods and juices. Our mission is to promote wellness through every sip and bite.
          </p>
          <div className="social-links">
            <a href="https://instagram.com/Food_avenooks" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram Food">
              📸
            </a>
            <a href="https://instagram.com/juice_avenooks" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram Juice">
              🥤
            </a>
            <a href="https://tiktok.com/@Food_avenooks" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="TikTok">
              🎵
            </a>
          </div>
        </div>

        <div>
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/menu">Food Menu</Link></li>
            <li><Link href="/checkout">Checkout</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="footer-title">Opening Hours</h3>
          <ul className="footer-links" style={{ color: 'var(--color-gray-medium)', fontSize: '14px' }}>
            <li style={{ marginBottom: '8px' }}>
              <strong>Monday - Sunday</strong>
              <br />
              9:00 AM - 8:00 PM
            </li>
            <li>
              <strong>Delivery Areas:</strong>
              <br />
              Abuja Municipality
            </li>
          </ul>
        </div>

        <div>
          <h3 className="footer-title">Contact Us</h3>
          <div className="footer-contact-item">
            <span className="footer-contact-icon">📍</span>
            <span>Godab Estate Lifecamp, Abuja</span>
          </div>
          <div className="footer-contact-item">
            <span className="footer-contact-icon">📞</span>
            <span>07010673863</span>
          </div>
          <div className="footer-contact-item">
            <span className="footer-contact-icon">💬</span>
            <a href="https://wa.me/2347010673863" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-gold)' }}>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>&copy; {new Date().getFullYear()} Avenooks Restaurant. All Rights Reserved.</p>
        <p style={{ color: 'var(--color-gray-dark)' }}>Sharing Love Through Food</p>
      </div>
    </footer>
  );
};

export default Footer;
