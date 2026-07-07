'use client';

import React, { useState, useEffect } from 'react';
import styles from './admin.module.css';

interface OrderType {
  _id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  whatsappNumber: string;
  deliveryType: 'pickup' | 'delivery';
  deliveryAddress?: string;
  deliveryArea?: string;
  items: Array<{ name: string; price: number; quantity: number; category: string }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentReceiptUrl?: string;
  orderStatus: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'completed' | 'cancelled';
  createdAt: string;
}

interface MenuItemType {
  _id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl?: string;
  isBestseller: boolean;
}

const CATEGORIES = [
  { name: 'Nigerian Soups', code: 'SOUPS' },
  { name: 'Sauces & Stews', code: 'SAUCES & STEWS' },
  { name: 'Pasta Dishes', code: 'PASTA DISHES' },
  { name: 'Rice Dishes', code: 'RICES DISHES' },
  { name: 'Avenooks Specials', code: 'AVENOOKS SPECIALS' },
  { name: 'Breakfast Packages', code: 'BREAKFAST PACKAGES' },
  { name: 'Drinks & Shakes', code: 'DRINKS & SHAKES' },
  { name: 'Parfaits & Yogurt', code: 'PARFAITS' },
  { name: 'Extras & Add-ons', code: 'ADD-ONS' }
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'menu'>('orders');
  
  // Data lists
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  
  // Loaders
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form states for adding/editing menu item
  const [editingItem, setEditingItem] = useState<MenuItemType | null>(null);
  const [newitemName, setNewitemName] = useState('');
  const [newitemPrice, setNewitemPrice] = useState('');
  const [newitemCategory, setNewitemCategory] = useState('SOUPS');
  const [newitemDesc, setNewitemDesc] = useState('');
  const [newitemImageUrl, setNewitemImageUrl] = useState('');
  const [newitemBestseller, setNewitemBestseller] = useState(false);

  // Modal zoom
  const [zoomReceiptUrl, setZoomReceiptUrl] = useState<string | null>(null);

  // Error/Success banners
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Check auth on mount
  useEffect(() => {
    const savedPassword = localStorage.getItem('avenooks_admin_pw');
    if (savedPassword) {
      verifyAndLogin(savedPassword);
    }
  }, []);

  // Fetch when authenticated or active tab changes
  useEffect(() => {
    if (!isAuthenticated) return;
    const adminPw = localStorage.getItem('avenooks_admin_pw') || '';
    if (activeTab === 'orders') {
      fetchOrders(adminPw);
    } else {
      fetchMenuItems();
    }
  }, [isAuthenticated, activeTab]);

  const verifyAndLogin = (pw: string) => {
    testAuth(pw);
  };

  const testAuth = async (pw: string) => {
    try {
      const res = await fetch(`/api/orders?password=${encodeURIComponent(pw)}`);
      if (res.ok) {
        setIsAuthenticated(true);
        localStorage.setItem('avenooks_admin_pw', pw);
        setActionError('');
      } else {
        localStorage.removeItem('avenooks_admin_pw');
        setActionError('Invalid Admin Password. Please try again.');
      }
    } catch (e) {
      setActionError('Authentication test failed. Please try again.');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput) return;
    testAuth(passwordInput);
  };

  const fetchOrders = async (pw: string) => {
    setLoadingOrders(true);
    try {
      const res = await fetch(`/api/orders?password=${encodeURIComponent(pw)}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to load orders', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchMenuItems = async () => {
    setLoadingMenu(true);
    try {
      const res = await fetch('/api/menu');
      if (res.ok) {
        const data = await res.json();
        setMenuItems(data);
      }
    } catch (error) {
      console.error('Failed to load menu items', error);
    } finally {
      setLoadingMenu(false);
    }
  };

  const handleStatusChange = async (orderId: string, field: 'orderStatus' | 'paymentStatus', val: string) => {
    const adminPw = localStorage.getItem('avenooks_admin_pw') || '';
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [field]: val,
          password: adminPw
        })
      });

      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders((prev) => prev.map((ord) => (ord._id === orderId ? updatedOrder : ord)));
        setActionSuccess('Order status updated successfully.');
        setTimeout(() => setActionSuccess(''), 3000);
      } else {
        const errData = await res.json();
        setActionError(errData.error || 'Failed to update order.');
      }
    } catch (e) {
      setActionError('Error occurred updating status.');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setActionError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setNewitemImageUrl(data.url);
      setActionSuccess('Menu item image uploaded successfully!');
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (error) {
      setActionError('Failed to upload image. Try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const startEditItem = (item: MenuItemType) => {
    setEditingItem(item);
    setNewitemName(item.name);
    setNewitemPrice(item.price.toString());
    setNewitemCategory(item.category);
    setNewitemDesc(item.description || '');
    setNewitemImageUrl(item.imageUrl || '');
    setNewitemBestseller(item.isBestseller);
  };

  const cancelEditItem = () => {
    setEditingItem(null);
    setNewitemName('');
    setNewitemPrice('');
    setNewitemCategory('SOUPS');
    setNewitemDesc('');
    setNewitemImageUrl('');
    setNewitemBestseller(false);
  };

  const handleAddOrEditMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newitemName || !newitemPrice || !newitemCategory) {
      setActionError('Name, price, and category are required.');
      return;
    }

    const adminPw = localStorage.getItem('avenooks_admin_pw') || '';
    const bodyData = {
      name: newitemName,
      price: Number(newitemPrice),
      category: newitemCategory,
      description: newitemDesc,
      imageUrl: newitemImageUrl,
      isBestseller: newitemBestseller,
      password: adminPw
    };

    if (editingItem) {
      // Edit Mode
      try {
        const res = await fetch(`/api/menu/${editingItem._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyData)
        });

        if (res.ok) {
          const updated = await res.json();
          setMenuItems((prev) => prev.map((item) => (item._id === editingItem._id ? updated : item)));
          cancelEditItem();
          setActionSuccess('Menu item updated successfully!');
          setTimeout(() => setActionSuccess(''), 3000);
        } else {
          const errData = await res.json();
          setActionError(errData.error || 'Failed to update menu item.');
        }
      } catch (error) {
        setActionError('Failed to update menu item.');
      }
    } else {
      // Add Mode
      try {
        const res = await fetch('/api/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyData)
        });

        if (res.ok) {
          const createdItem = await res.json();
          setMenuItems((prev) => [...prev, createdItem]);
          
          // Reset form
          setNewitemName('');
          setNewitemPrice('');
          setNewitemCategory('SOUPS');
          setNewitemDesc('');
          setNewitemImageUrl('');
          setNewitemBestseller(false);
          setActionSuccess('New menu item added successfully!');
          setTimeout(() => setActionSuccess(''), 3000);
        } else {
          const errData = await res.json();
          setActionError(errData.error || 'Failed to add menu item.');
        }
      } catch (error) {
        setActionError('Failed to create menu item.');
      }
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    const confirm = window.confirm('Are you sure you want to delete this menu item?');
    if (!confirm) return;

    const adminPw = localStorage.getItem('avenooks_admin_pw') || '';
    try {
      const res = await fetch(`/api/menu/${id}?password=${encodeURIComponent(adminPw)}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setMenuItems((prev) => prev.filter((item) => item._id !== id));
        setActionSuccess('Menu item deleted successfully.');
        setTimeout(() => setActionSuccess(''), 3000);
      } else {
        setActionError('Failed to delete item.');
      }
    } catch (e) {
      setActionError('Error occurred deleting item.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('avenooks_admin_pw');
    setIsAuthenticated(false);
    setOrders([]);
    setMenuItems([]);
    cancelEditItem();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getOrderStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending': return styles.badgePending;
      case 'confirmed': return styles.badgeConfirmed;
      case 'preparing': return styles.badgePreparing;
      case 'delivered': return styles.badgeDelivered;
      case 'completed': return styles.badgeCompleted;
      case 'cancelled': return styles.badgeCancelled;
      default: return '';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className={styles.loginCard}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</div>
          <h1 className={styles.loginTitle}>Admin Dashboard</h1>
          <p className={styles.loginDesc}>Enter password to view orders and manage menu.</p>
          <form onSubmit={handleLoginSubmit}>
            <input
              type="password"
              placeholder="Enter Admin Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              style={{ marginBottom: '20px', textAlign: 'center' }}
            />
            {actionError && (
              <p style={{ color: 'var(--color-error)', fontSize: '13px', fontWeight: 600, marginBottom: '20px' }}>
                {actionError}
              </p>
            )}
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Log In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.adminLayout}>
        <div className={styles.dashboardHeader}>
          <div>
            <h1 className={styles.dashboardTitle}>Management Panel</h1>
            <p style={{ color: 'var(--color-gray-dark)', fontSize: '14px' }}>Welcome to your Avenooks Store Manager</p>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '12px' }}>
            Logout
          </button>
        </div>

        {actionSuccess && (
          <div style={{ padding: '12px 24px', backgroundColor: '#e8f5e9', borderLeft: '4px solid var(--color-success)', color: 'var(--color-success)', fontWeight: 600, fontSize: '14px', marginBottom: '24px', borderRadius: '4px' }}>
            ✓ {actionSuccess}
          </div>
        )}

        {actionError && (
          <div style={{ padding: '12px 24px', backgroundColor: '#ffe5e5', borderLeft: '4px solid var(--color-error)', color: 'var(--color-error)', fontWeight: 600, fontSize: '14px', marginBottom: '24px', borderRadius: '4px' }}>
            ⚠️ {actionError}
          </div>
        )}

        <div className={styles.tabsContainer}>
          <button
            onClick={() => { setActiveTab('orders'); cancelEditItem(); }}
            className={`${styles.tabBtn} ${activeTab === 'orders' ? styles.tabBtnActive : ''}`}
          >
            📋 Orders Tracking
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`${styles.tabBtn} ${activeTab === 'menu' ? styles.tabBtnActive : ''}`}
          >
            🍽️ Menu Manager
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div>
            {loadingOrders ? (
              <div className={styles.loginCard} style={{ boxShadow: 'none', border: 'none' }}>
                <div className={styles.spinner} style={{ margin: '0 auto 16px auto' }}></div>
                <p>Loading orders from database...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className={styles.loginCard} style={{ boxShadow: 'none', border: 'none' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                <h3>No Orders Yet</h3>
                <p style={{ color: 'var(--color-gray-dark)' }}>Orders placed by customers will appear here in real-time.</p>
              </div>
            ) : (
              <div className={styles.ordersGrid}>
                {orders.map((order) => (
                  <div key={order._id} className={styles.orderCard}>
                    <div className={styles.orderHeader}>
                      <div>
                        <span className={styles.orderId}>
                          ORDER #{order._id.substring(order._id.length - 6).toUpperCase()}
                        </span>
                        <div className={styles.orderDate}>
                          Placed: {new Date(order.createdAt).toLocaleString()}
                        </div>
                      </div>

                      <div className={styles.orderStatusGroup}>
                        <div className={styles.inputGroup} style={{ gap: '4px' }}>
                          <span className={styles.label}>Order Status</span>
                          <select
                            value={order.orderStatus}
                            onChange={(e) => handleStatusChange(order._id, 'orderStatus', e.target.value)}
                            className={`${styles.statusSelect} ${getOrderStatusBadgeClass(order.orderStatus)}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="preparing">Preparing</option>
                            <option value="delivered">Out for Delivery</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>

                        <div className={styles.inputGroup} style={{ gap: '4px' }}>
                          <span className={styles.label}>Payment</span>
                          <select
                            value={order.paymentStatus}
                            onChange={(e) => handleStatusChange(order._id, 'paymentStatus', e.target.value)}
                            className={styles.statusSelect}
                          >
                            <option value="pending">Pending Validate</option>
                            <option value="paid">Validated (Paid)</option>
                            <option value="failed">Failed / Fake</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className={styles.orderBody}>
                      <div className={styles.customerInfo}>
                        <h4>Customer Info</h4>
                        <div className={styles.infoRow}>
                          Name: <strong>{order.customerName}</strong>
                        </div>
                        <div className={styles.infoRow}>
                          Phone: <strong>{order.customerPhone}</strong>
                        </div>
                        <div className={styles.infoRow}>
                          WhatsApp: <strong>{order.whatsappNumber}</strong>
                        </div>
                        {order.customerEmail && (
                          <div className={styles.infoRow}>
                            Email: <strong>{order.customerEmail}</strong>
                          </div>
                        )}
                        <div className={styles.infoRow}>
                          Delivery: <strong>{order.deliveryType.toUpperCase()}</strong>
                        </div>
                        {order.deliveryType === 'delivery' && (
                          <>
                            <div className={styles.infoRow}>
                              Area: <strong>{order.deliveryArea}</strong>
                            </div>
                            <div className={styles.infoRow}>
                              Address: <strong>{order.deliveryAddress}</strong>
                            </div>
                          </>
                        )}
                        {order.paymentReceiptUrl && (
                          <div>
                            <span className={styles.label}>Transfer Receipt</span>
                            <br />
                            <img
                              src={order.paymentReceiptUrl}
                              alt="Receipt Proof"
                              className={styles.receiptThumbnail}
                              onClick={() => setZoomReceiptUrl(order.paymentReceiptUrl || null)}
                            />
                          </div>
                        )}
                      </div>

                      <div className={styles.itemsOrdered}>
                        <h4>Items Ordered</h4>
                        <table className={styles.itemsListTable}>
                          <thead>
                            <tr>
                              <th>Item Name</th>
                              <th>Qty</th>
                              <th style={{ textAlign: 'right' }}>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((item, idx) => (
                              <tr key={idx}>
                                <td>{item.name}</td>
                                <td>{item.quantity}</td>
                                <td style={{ textAlign: 'right', fontWeight: 600 }}>
                                  {formatPrice(item.price * item.quantity)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <div style={{ marginTop: '20px', borderTop: '1px solid var(--color-gray-light)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <strong style={{ fontSize: '15px' }}>Grand Total</strong>
                          <strong style={{ fontSize: '18px', color: 'var(--color-wine-red)' }}>
                            {formatPrice(order.total)}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Menu Management */}
        {activeTab === 'menu' && (
          <div className={styles.menuAdminLayout}>
            {/* Form to add or edit item */}
            <div className={styles.addItemCard}>
              <h2 className={styles.sectionTitle} style={{ fontSize: '20px', marginBottom: '20px' }}>
                {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
              </h2>
              <form onSubmit={handleAddOrEditMenuItem} className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Item Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Native Catfish Peppersoup"
                    value={newitemName}
                    onChange={(e) => setNewitemName(e.target.value)}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Price (₦) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 14500"
                    value={newitemPrice}
                    onChange={(e) => setNewitemPrice(e.target.value)}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Category *</label>
                  <select
                    value={newitemCategory}
                    onChange={(e) => setNewitemCategory(e.target.value)}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.code} value={cat.code}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Description</label>
                  <textarea
                    placeholder="Brief description of ingredients..."
                    rows={3}
                    value={newitemDesc}
                    onChange={(e) => setNewitemDesc(e.target.value)}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Item Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    style={{ padding: '6px' }}
                  />
                  {uploadingImage && <span style={{ fontSize: '11px', color: 'var(--color-wine-red)' }}>Uploading to Cloudinary...</span>}
                  {newitemImageUrl && (
                    <div style={{ marginTop: '8px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--color-gray-dark)', display: 'block', marginBottom: '4px' }}>Active Picture Preview:</span>
                      <img
                        src={newitemImageUrl}
                        alt="Uploaded item"
                        style={{ width: '80px', height: '80px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--color-gray-medium)' }}
                      />
                    </div>
                  )}
                </div>

                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={newitemBestseller}
                    onChange={(e) => setNewitemBestseller(e.target.checked)}
                    className={styles.checkboxInput}
                  />
                  Mark as Bestseller
                </label>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="submit" disabled={uploadingImage} className="btn btn-primary" style={{ flex: 1 }}>
                    {editingItem ? 'Save Changes' : 'Save Menu Item'}
                  </button>
                  {editingItem && (
                    <button type="button" onClick={cancelEditItem} className="btn btn-secondary">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List of items */}
            <div className={styles.menuItemsTableWrapper}>
              <h2 className={styles.sectionTitle} style={{ fontSize: '20px', marginBottom: '20px' }}>Current Menu Items</h2>
              {loadingMenu ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div className={styles.spinner} style={{ margin: '0 auto 12px auto' }}></div>
                  <p>Loading items...</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className={styles.menuTable}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {menuItems.map((item) => (
                        <tr key={item._id}>
                          <td>
                            <strong>{item.name}</strong>
                            {item.isBestseller && <span style={{ color: 'var(--color-wine-red)', fontSize: '10px', marginLeft: '6px', fontWeight: 'bold' }}>[BEST]</span>}
                          </td>
                          <td style={{ fontSize: '12px', color: 'var(--color-gray-dark)' }}>{item.category}</td>
                          <td>{formatPrice(item.price)}</td>
                          <td>
                            <button
                              onClick={() => startEditItem(item)}
                              className={styles.editBtn}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteMenuItem(item._id)}
                              className={styles.deleteBtn}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal Zoom */}
      {zoomReceiptUrl && (
        <div className={styles.modalOverlay} onClick={() => setZoomReceiptUrl(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setZoomReceiptUrl(null)}>
              &times;
            </button>
            <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '12px' }}>Payment Proof Receipt</h3>
            <img src={zoomReceiptUrl} alt="Receipt proof full size" className={styles.modalImage} />
          </div>
        </div>
      )}
    </div>
  );
}
