import './globals.css';
import Providers from '@/components/Providers';

export const metadata = {
  title: 'SmartScrap | Smart Scrap Pickup & Reward System',
  description: 'Schedule a pickup, recycle responsibly, track your collector and earn rewards for every kilogram you recycle.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
