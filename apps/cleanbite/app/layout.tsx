import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CleanBite | The Playful Food & Ingredient Scanner',
  description: 'Scan barcodes and labels instantly. Unmask hidden additives, seed oils, and ultra-processed junk with 0-100 health scores and clean swaps.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🥑</text></svg>',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-[#FAF8F5] text-emerald-950">
        {children}
      </body>
    </html>
  );
}
