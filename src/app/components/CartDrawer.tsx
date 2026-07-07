'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isDrawerOpen, 
    setIsDrawerOpen, 
    updateQuantity, 
    removeFromCart, 
    getCartSubtotal, 
    getCartCount 
  } = useCart();

  if (!isDrawerOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)}>
      <div className="drawer-content animate-slide-left" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h2 className="drawer-title">Shopping Cart</h2>
          <button className="drawer-close" onClick={() => setIsDrawerOpen(false)} aria-label="Close cart">
            &times;
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="drawer-empty">
            <div className="drawer-empty-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Select delicious dishes from our menu to satisfy your cravings.</p>
            <button 
              onClick={() => setIsDrawerOpen(false)} 
              className="btn btn-primary"
              style={{ marginTop: '20px', width: '100%' }}
            >
              Browse Food Menu
            </button>
          </div>
        ) : (
          <div className="drawer-body">
            <div className="drawer-items-list">
              {cart.map((item) => (
                <div key={item.id} className="drawer-item">
                  <div className="drawer-item-details">
                    <h4 className="drawer-item-name">{item.name}</h4>
                    <span className="drawer-item-price">{formatPrice(item.price * item.quantity)}</span>
                    <div className="drawer-item-actions">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="drawer-qty-btn"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="drawer-qty-val">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="drawer-qty-btn"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="drawer-remove-btn"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="drawer-summary">
              <div className="drawer-summary-row">
                <span className="drawer-summary-label">Subtotal</span>
                <span className="drawer-summary-val">{formatPrice(getCartSubtotal())}</span>
              </div>
              <p className="drawer-summary-note">
                * Delivery fee is calculated upon checkout.
              </p>
              <Link 
                href="/checkout" 
                className="btn btn-primary drawer-checkout-btn"
                onClick={() => setIsDrawerOpen(false)}
              >
                Proceed to Checkout
              </Link>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="btn btn-secondary drawer-continue-btn"
                style={{ width: '100%', marginTop: '12px' }}
              >
                Continue Ordering
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
