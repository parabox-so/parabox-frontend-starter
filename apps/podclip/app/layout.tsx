import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PodClip AI | Autonomous Podcast-to-Shorts Engine',
  description: 'Turn long-form podcasts into viral TikToks, Reels, and YouTube Shorts with AI viral scoring, kinetic subtitles, and waveform studio.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎙️</text></svg>',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-[#0B0F17] text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
