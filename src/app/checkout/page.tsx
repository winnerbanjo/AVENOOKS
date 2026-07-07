'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import styles from './checkout.module.css';

const ABUJA_AREAS = [
  'Lifecamp',
  'Gwarinpa',
  'Wuse I / II',
  'Maitama',
  'Asokoro',
  'Jabi',
  'Garki I / II',
  'Central Business District',
  'Guzape',
  'Utako'
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartSubtotal, clearCart } = useCart();

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryArea, setDeliveryArea] = useState('Lifecamp');
  
  // Payment states
  const [paymentReceiptUrl, setPaymentReceiptUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMsg('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      setPaymentReceiptUrl(data.url);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to upload receipt screenshot. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validations
    if (!customerName || !customerPhone || !whatsappNumber) {
      setErrorMsg('Please fill in all required customer details.');
      return;
    }

    if (deliveryType === 'delivery' && !deliveryAddress) {
      setErrorMsg('Please enter a delivery address.');
      return;
    }

    if (!paymentReceiptUrl) {
      setErrorMsg('Please upload your bank transfer receipt screenshot. Payment validates all orders.');
      return;
    }

    setSubmitting(true);

    const orderData = {
      customerName,
      customerPhone,
      customerEmail,
      whatsappNumber,
      deliveryType,
      deliveryAddress,
      deliveryArea,
      items: cart.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        category: item.category
      })),
      subtotal: getCartSubtotal(),
      deliveryFee: 0, // Not fixed, calculated at delivery
      total: getCartSubtotal(),
      paymentReceiptUrl
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        throw new Error('Failed to save order to database.');
      }

      const savedOrder = await res.json();

      // Formulate WhatsApp message
      const orderItemsText = cart
        .map((item) => `- ${item.name} (x${item.quantity}) - ${formatPrice(item.price * item.quantity)}`)
        .join('\n');

      const whatsappText = `*NEW ORDER FROM AVENOOKS WEBSITE*

*Order Details:*
- *Order ID:* #${savedOrder._id.substring(savedOrder._id.length - 6).toUpperCase()}
- *Name:* ${customerName}
- *Phone:* ${customerPhone}
- *WhatsApp:* ${whatsappNumber}
- *Delivery Type:* ${deliveryType.toUpperCase()}
${deliveryType === 'delivery' ? `- *Address:* ${deliveryAddress}\n- *Area:* ${deliveryArea}\n` : ''}
*Items Ordered:*
${orderItemsText}

*Order Summary:*
- *Subtotal:* ${formatPrice(getCartSubtotal())}
- *Delivery Fee:* Not Fixed (TBD at delivery)
- *Total:* ${formatPrice(getCartSubtotal())}

*Payment Proof (Receipt URL):*
${paymentReceiptUrl}

_Payment validates orders. Thank you!_`;

      const whatsappNumberClean = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2347010673863';
      const whatsappUrl = `https://wa.me/${whatsappNumberClean}?text=${encodeURIComponent(whatsappText)}`;

      // Clear Cart
      clearCart();

      // Redirect to WhatsApp
      window.location.href = whatsappUrl;
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An error occurred while placing your order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (cart.length === 0) {
    return (
      <div className="container text-center animate-fade" style={{ padding: '100px 0' }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🛒</div>
        <h2 style={{ fontSize: '28px', marginBottom: '16px' }}>Your Cart is Empty</h2>
        <p style={{ color: 'var(--color-gray-dark)', marginBottom: '32px' }}>
          Please add items to your cart before checking out.
        </p>
        <Link href="/menu" className="btn btn-primary">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.checkoutLayout}>
        {/* Left: Form */}
        <div>
          <div className={styles.titleArea}>
            <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>Checkout</h1>
            <p style={{ color: 'var(--color-gray-dark)' }}>Confirm details and upload bank transfer proof to complete order.</p>
          </div>

          <div className={styles.toggleContainer}>
            <button
              onClick={() => setDeliveryType('delivery')}
              className={`${styles.toggleBtn} ${deliveryType === 'delivery' ? styles.toggleBtnActive : ''}`}
            >
              🚚 Delivery
            </button>
            <button
              onClick={() => setDeliveryType('pickup')}
              className={`${styles.toggleBtn} ${deliveryType === 'pickup' ? styles.toggleBtnActive : ''}`}
            >
              🛍️ Pickup
            </button>
          </div>

          <form onSubmit={handleSubmitOrder} className={styles.checkoutForm}>
            <h2 className={styles.sectionTitle}>Contact Information</h2>
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 08012345678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 08012345678"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="e.g. john@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </div>
            </div>

            {deliveryType === 'delivery' && (
              <div className="animate-fade" style={{ marginBottom: '32px' }}>
                <h2 className={styles.sectionTitle}>Delivery Information</h2>
                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Delivery Area (Abuja Municipality) *</label>
                    <select
                      value={deliveryArea}
                      onChange={(e) => setDeliveryArea(e.target.value)}
                    >
                      {ABUJA_AREAS.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                    <label className={styles.label}>Full Street Address *</label>
                    <textarea
                      required={deliveryType === 'delivery'}
                      placeholder="House number, Street name, Estate details..."
                      rows={3}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            <h2 className={styles.sectionTitle}>Payment Details (Bank Transfer)</h2>
            <p style={{ fontSize: '13px', color: 'var(--color-gray-dark)', marginBottom: '20px' }}>
              We operate on a <strong>Payment Validates Orders</strong> policy. Make your transfer to the account below, then upload a screenshot of the receipt.
            </p>

            <div className={styles.bankDetailsCard}>
              <div className={styles.bankRow}>
                <span>Bank Name</span>
                <strong>Zenith Bank</strong>
              </div>
              <div className={styles.bankRow}>
                <span>Account Name</span>
                <strong>Avenooks Restaurant</strong>
              </div>
              <div className={styles.bankRow}>
                <span>Account Number</span>
                <strong>1218520846</strong>
              </div>
            </div>

            <div className={styles.inputGroup} style={{ marginBottom: '24px' }}>
              <label className={styles.label}>Upload Transfer Receipt Screenshot *</label>
              <div className={`${styles.uploadWrapper} ${paymentReceiptUrl ? styles.uploadWrapperActive : ''}`}>
                <div className={styles.uploadIcon}>{paymentReceiptUrl ? '✅' : '📤'}</div>
                <div className={styles.uploadText}>
                  {uploading ? (
                    'Uploading screenshot...'
                  ) : paymentReceiptUrl ? (
                    'Receipt Uploaded Successfully!'
                  ) : (
                    <>
                      <span>Click to upload</span> or drag and drop image file
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className={styles.fileInput}
                />
              </div>
            </div>

            {errorMsg && (
              <p style={{ color: 'var(--color-error)', fontWeight: 600, fontSize: '14px', marginBottom: '20px' }}>
                ⚠️ {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || uploading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '16px' }}
            >
              {submitting ? 'Placing Order...' : 'Submit Order & Open WhatsApp'}
            </button>
          </form>
        </div>

        {/* Right: Order Summary */}
        <aside className={styles.summaryBox}>
          <div className={styles.summaryHeader}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
          </div>

          <div className={styles.itemsList}>
            {cart.map((item) => (
              <div key={item.id} className={styles.summaryItem}>
                <div>
                  {item.name}
                  <span className={styles.summaryItemQty}>x{item.quantity}</span>
                </div>
                <span className={styles.priceLabel}>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className={styles.totalsArea}>
            <div className={styles.totalsRow}>
              <span>Subtotal</span>
              <span>{formatPrice(getCartSubtotal())}</span>
            </div>
            <div className={styles.totalsRow}>
              <span>Delivery Fee</span>
              <span style={{ fontStyle: 'italic', fontSize: '13px', color: 'var(--color-gray-dark)' }}>
                {deliveryType === 'delivery' ? 'Not Fixed (Paid on delivery)' : 'Free Pickup'}
              </span>
            </div>
            <div className={styles.totalRow}>
              <span>Total Payment</span>
              <span className={styles.totalVal}>{formatPrice(getCartSubtotal())}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
