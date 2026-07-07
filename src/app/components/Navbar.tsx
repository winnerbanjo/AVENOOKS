'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../context/CartContext';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { getCartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="header">
      <div className="container header-container">
        <Link href="/" className="logo-link" onClick={() => setIsOpen(false)}>
          <img src="/logo.jpg" alt="Avenooks Restaurant" className="logo-img" />
          <span className="logo-text">AVENOOKS</span>
        </Link>

        <nav>
          <ul className={`nav-menu ${isOpen ? 'nav-menu-mobile nav-menu-mobile-open' : ''}`}>
            <li>
              <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/menu" className={`nav-link ${pathname === '/menu' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                Menu
              </Link>
            </li>
            <li>
              <Link href="/checkout" className={`nav-link ${pathname === '/checkout' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                Order Now
              </Link>
            </li>
          </ul>
        </nav>

        <div className="nav-actions">
          <Link href="/menu" className="btn btn-icon" aria-label="Cart">
            🛒
            {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
          </Link>
          <Link href="/menu" className="btn btn-primary hero-image-desktop-only" style={{ padding: '8px 20px', fontSize: '12px' }}>
            Order Online
          </Link>
          <button className="hamburger" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
