import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import type { Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Avenooks Restaurant | Nutritious & Health-Conscious Food',
  description: 'Promoting wellness through every sip and bite. Offering fresh, nutritious, and health-conscious foods and juices in Lifecamp, Abuja.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1 }}>{children}</main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
