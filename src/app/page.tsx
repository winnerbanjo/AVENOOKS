import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  const categories = [
    { name: 'Nigerian Soups', code: 'SOUPS', icon: '🍲', count: 8, image: '/assets/WhatsApp Image 2026-06-30 at 5.17.21 PM (3).jpeg' },
    { name: 'Rice Dishes', code: 'RICES DISHES', icon: '🍚', count: 12, image: '/assets/WhatsApp Image 2026-06-30 at 5.17.18 PM.jpeg' },
    { name: 'Pasta Dishes', code: 'PASTA DISHES', icon: '🍝', count: 9, image: '/assets/WhatsApp Image 2026-06-30 at 5.17.18 PM (1).jpeg' },
    { name: 'Drinks & Shakes', code: 'DRINKS & SHAKES', icon: '🥤', count: 12, image: '/assets/WhatsApp Image 2026-06-30 at 5.17.19 PM.jpeg' },
    { name: 'Parfaits & Yogurt', code: 'PARFAITS', icon: '🍧', count: 3, image: '/assets/WhatsApp Image 2026-06-30 at 5.17.20 PM.jpeg' },
    { name: 'Sauces & Stew Bowls', code: 'SAUCES & STEWS', icon: '🍛', count: 5, image: '/assets/WhatsApp Image 2026-06-30 at 5.17.20 PM (1).jpeg' }
  ];

  const testimonials = [
    {
      quote: "Avenooks has completely changed how I eat in Abuja. Finding nutritious meals that actually taste amazing and are prepared with premium fresh ingredients used to be a chore. Their Protein Fiesta Coconut Rice is a masterpiece!",
      author: "Hadiza Bello",
      role: "Fitness Coach, Wuse II"
    },
    {
      quote: "Their cold-pressed green juice is my daily ritual. You can tell they don't add sugar or preservatives. Delivery is always prompt and the food arrives fresh and warm. Absolutely worth every Naira.",
      author: "Chinedu Okafor",
      role: "Tech Consultant, Lifecamp"
    },
    {
      quote: "Outstanding customer service! I order directly from their website and pay before delivery. They validate orders immediately and keep me updated via WhatsApp. The Oha Soup is out of this world.",
      author: "Amina Yusuf",
      role: "Doctor, Gwarinpa"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <span className={styles.tagline}>Nourishment for Body & Soul</span>
              <h1 className={styles.title}>
                Promoting Wellness Through Every <span>Sip & Bite</span>
              </h1>
              <p className={styles.description}>
                We specialize in providing you with fresh, nutritious, and health-conscious foods and cold-pressed juices. Fuel your body and support a healthy lifestyle.
              </p>
              <div className={styles.ctaGroup}>
                <Link href="/menu" className="btn btn-primary">
                  Explore Menu
                </Link>
                <Link href="/checkout" className="btn btn-secondary" style={{ borderColor: 'var(--color-white)', color: 'var(--color-white)' }}>
                  Order Now
                </Link>
              </div>
            </div>
            {/* The background is handled nicely by the gradient and text layout. The hero image is placed in the layout or CSS */}
          </div>
        </div>
        <div 
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '45%',
            height: '100%',
            backgroundImage: 'url(/hero.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.85,
            zIndex: 1,
            borderLeft: '1px solid var(--color-wine-red-light)'
          }}
          className="hero-image-desktop-only"
        />
      </section>

      {/* About Section */}
      <section className={styles.about}>
        <div className="container">
          <div className={styles.aboutGrid}>
            <div className={styles.aboutImgWrapper}>
              <img src="/about.jpg" alt="Fresh Organic Ingredients" className={styles.aboutImg} />
            </div>
            <div>
              <span className={styles.aboutSubtitle}>Our Mission</span>
              <h2 className={styles.aboutTitle}>Fresh. Nutritious. Health-Conscious.</h2>
              <p className={styles.aboutText}>
                At Avenooks Restaurant, our mission is to promote wellness by offering only the best natural ingredients that fuel your body and support a healthy lifestyle.
              </p>
              <p className={styles.aboutText}>
                Every plate we serve and every bottle we press is packed with natural vitamins, minerals, and rich spices. We believe that healthy eating should be a joyful, flavorful experience.
              </p>
              <Link href="/menu" className="btn btn-secondary" style={{ marginTop: '20px' }}>
                View Our Menu
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className={styles.highlights}>
        <div className="container">
          <div className={styles.highlightsGrid}>
            <div className={styles.highlightCard}>
              <div className={styles.highlightIcon}>🌱</div>
              <h3>100% Natural</h3>
              <p>No artificial preservatives, colors, or refined sugars. Only raw, organic ingredients.</p>
            </div>
            <div className={styles.highlightCard}>
              <div className={styles.highlightIcon}>🥑</div>
              <h3>Nutrient Dense</h3>
              <p>Carefully selected items that promote digestion, cardiovascular health, and physical energy.</p>
            </div>
            <div className={styles.highlightCard}>
              <div className={styles.highlightIcon}>🛵</div>
              <h3>Fast Delivery</h3>
              <p>Freshly cooked meals and cold juices delivered directly to your doorstep in Abuja Municipality.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className={styles.categoriesSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSubtitle}>Handcrafted Menu</span>
            <h2 className={styles.sectionTitle}>Browse Food Categories</h2>
          </div>
          <div className={styles.categoryGrid}>
            {categories.map((cat, index) => (
              <Link href={`/menu?category=${encodeURIComponent(cat.code)}`} key={index} className={styles.categoryCard}>
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url('${cat.image}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: 0
                  }}
                />
                <div className={styles.categoryOverlay}>
                  <div style={{ fontSize: '32px', marginBottom: '10px' }}>{cat.icon}</div>
                  <h3 className={styles.categoryName}>{cat.name}</h3>
                  <span className={styles.categoryLinkText}>{cat.count} Items &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.testimonials}>
        <div className="container">
          <div className={styles.sectionHeader} style={{ marginBottom: '40px' }}>
            <span className={styles.sectionSubtitle} style={{ color: 'var(--color-gold)' }}>Testimonials</span>
            <h2 className={styles.sectionTitle} style={{ color: 'var(--color-white)' }}>What Our Clients Say</h2>
          </div>
          <div className={styles.testimonialGrid}>
            {testimonials.map((test, index) => (
              <div key={index} className={styles.testimonialCard}>
                <p className={styles.testimonialQuote}>"{test.quote}"</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorAvatar}>
                    {test.author.charAt(0)}
                  </div>
                  <div>
                    <div className={styles.authorName}>{test.author}</div>
                    <div className={styles.authorRole}>{test.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className={styles.infoSection}>
        <div className="container">
          <div className={styles.infoGrid}>
            <div>
              <h2 className={styles.aboutTitle} style={{ marginBottom: '40px' }}>Where To Find Us</h2>
              <div className={styles.detailsList}>
                <div className={styles.detailItem}>
                  <div className={styles.detailIcon}>📍</div>
                  <div>
                    <h4>Our Location</h4>
                    <p>Godab Estate Lifecamp, Abuja, Nigeria</p>
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailIcon}>🕒</div>
                  <div>
                    <h4>Opening Hours</h4>
                    <p>Monday - Sunday: 9:00 AM - 8:00 PM</p>
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailIcon}>💳</div>
                  <div>
                    <h4>Payment Policy</h4>
                    <p>Payment validates all orders. Orders are processed immediately upon confirmation of transfer.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.infoMapWrapper} style={{ background: 'var(--color-black-light)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px', color: 'var(--color-white)', textAlign: 'center', flexDirection: 'column', gap: '20px' }}>
              <div style={{ fontSize: '48px' }}>📍</div>
              <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)' }}>Abuja Delivery</h3>
              <p style={{ fontSize: '14px', color: 'var(--color-gray-medium)' }}>
                We deliver to all areas within the Abuja Municipality, including Gwarinpa, Lifecamp, Wuse, Maitama, Asokoro, Central Area, and Jabi.
              </p>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', fontSize: '13px' }}>
                Delivery fee is not fixed and is calculated based on distance.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
