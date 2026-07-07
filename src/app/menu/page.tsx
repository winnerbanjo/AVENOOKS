'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import styles from './menu.module.css';

interface MenuItemType {
  _id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl?: string;
  isBestseller: boolean;
}

const CATEGORY_MAP: Record<string, string> = {
  'SOUPS': 'Nigerian Soups',
  'SAUCES & STEWS': 'Sauces & Stews',
  'PASTA DISHES': 'Pasta Dishes',
  'RICES DISHES': 'Rice Dishes',
  'BREAKFAST PACKAGES': 'Breakfast Packages',
  'DRINKS & SHAKES': 'Drinks & Shakes',
  'PARFAITS': 'Parfaits & Yogurt',
  'ADD-ONS': 'Extras & Add-ons',
};

function MenuContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Category selected
  const categoryParam = searchParams.get('category') || 'ALL';

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch('/api/menu');
        if (res.ok) {
          const data = await res.json();
          setMenuItems(data);
        }
      } catch (error) {
        console.error('Failed to load menu items', error);
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  const handleCategorySelect = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === 'ALL') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    router.push(`/menu?${params.toString()}`);
  };

  // Filter items
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryParam === 'ALL' || item.category === categoryParam;

    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryImage = (category: string) => {
    switch (category) {
      case 'SOUPS': return '🍲';
      case 'RICES DISHES': return '🍚';
      case 'PASTA DISHES': return '🍝';
      case 'DRINKS & SHAKES': return '🥤';
      case 'PARFAITS': return '🍧';
      case 'SAUCES & STEWS': return '🍛';
      case 'BREAKFAST PACKAGES': return '🍳';
      case 'ADD-ONS': return '🍗';
      default: return '🍽️';
    }
  };

  if (loading) {
    return (
      <div className={styles.loader}>
        <div className={styles.spinner}></div>
        <p>Loading our delicious menu...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.menuLayout}>
        <div className={styles.headerArea}>
          <h1 className={styles.title}>Our Delicious Menu</h1>
          <p className={styles.subtitle}>Nutritious, fresh, and health-conscious items prepared just for you.</p>
        </div>

        {/* Search bar */}
        <div className={styles.searchFilterBar}>
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search food menu (e.g. Oha soup, coconut rice)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className={styles.categoriesWrapper}>
          <button
            onClick={() => handleCategorySelect('ALL')}
            className={`${styles.categoryTab} ${categoryParam === 'ALL' ? styles.categoryTabActive : ''}`}
          >
            All Items
          </button>
          {Object.keys(CATEGORY_MAP).map((catCode) => (
            <button
              key={catCode}
              onClick={() => handleCategorySelect(catCode)}
              className={`${styles.categoryTab} ${categoryParam === catCode ? styles.categoryTabActive : ''}`}
            >
              {CATEGORY_MAP[catCode]}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className={styles.cartEmpty}>
            <div className={styles.cartEmptyIcon}>🍽️</div>
            <h3>No items found</h3>
            <p>Try searching for something else or changing the category filter.</p>
          </div>
        ) : (
          <div className={styles.itemsGrid}>
            {filteredItems.map((item) => (
              <div key={item._id} className={`${styles.itemCard} animate-scale`}>
                <div className={styles.itemImageWrapper}>
                  {item.isBestseller && <span className={styles.itemBestsellerBadge}>Bestseller</span>}
                  <span className={styles.itemBadge}>{CATEGORY_MAP[item.category] || item.category}</span>
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <div className={styles.itemImagePlaceholder}>
                      {getCategoryImage(item.category)}
                    </div>
                  )}
                </div>
                <div className={styles.itemDetails}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.itemDesc}>{item.description}</p>
                  <div className={styles.itemFooter}>
                    <span className={styles.itemPrice}>{formatPrice(item.price)}</span>
                    <button
                      onClick={() => addToCart({ id: item._id, name: item.name, price: item.price, category: item.category })}
                      className="btn btn-primary"
                      style={{ padding: '8px 16px', fontSize: '12px' }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={
      <div className={styles.loader}>
        <div className={styles.spinner}></div>
        <p>Loading Menu Component...</p>
      </div>
    }>
      <MenuContent />
    </Suspense>
  );
}
