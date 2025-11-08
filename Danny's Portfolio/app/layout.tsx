import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import SpaceTheme from '@/components/Theme/SpaceTheme';
import PremiumSpaceLayout from '@/layouts/PremiumSpaceLayout';
import AdminRoutesOnly from '@/components/AdminRoutesOnly';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Daniel Buckley | Motor Photographer & Software Developer',
  description: 'Portfolio of Daniel Buckley - Motor Photographer, Software Developer, and CEO of Duneworks Studios',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <SpaceTheme>
          {/* Only show Navigation on admin routes */}
          <AdminRoutesOnly>
            <Navigation />
          </AdminRoutesOnly>
          <PremiumSpaceLayout>
            {children}
          </PremiumSpaceLayout>
        </SpaceTheme>
      </body>
    </html>
  );
}
