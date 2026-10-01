'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Play,
  Pause,
  Sparkles,
  Flame,
  Share2,
  Download,
  Scissors,
  Layers,
  Radio,
  Sliders,
  CheckCircle2,
  Clock,
  TrendingUp,
  Volume2,
  VolumeX,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Terminal,
  Cpu,
  Zap,
  Globe,
  Monitor,
  Smartphone,
  Square,
  Copy,
  Check,
  Headphones,
  FileAudio,
  BarChart3,
  Search,
  KeyRound,
  ShieldCheck,
  Video,
  Eye,
  Settings2,
  FlameKindling,
  CheckCheck
} from 'lucide-react';

interface ClipSnippet {
  id: string;
  title: string;
  hookCategory: string;
  score: number;
  duration: string;
  startTime: number;
  endTime: number;
  estViews: string;
  speakers: string[];
  transcript: {
    time: string;
    speaker: string;
    text: string;
    highlightWords?: string[];
  }[];
  kineticSubtitle: string;
  bRollPrompt: string;
}

const SAMPLE_CLIPS: ClipSnippet[] = [
  {
    id: 'clip-1',
    title: 'Why 99% of Startups Fail on Day 1',
    hookCategory: 'Contrarian Hook',
    score: 98,
    duration: '00:46',
    startTime: 252, // 04:12
    endTime: 298,
    estViews: '8.4M',
    speakers: ['Host (Alex)', 'Guest (Marc)'],
    transcript: [
      {
        time: '04:12',
        speaker: 'Marc',
        text: 'The fundamental flaw in 99% of modern startups isn\'t capital or code.',
        highlightWords: ['fundamental', 'flaw', '99%']
      },
      {
        time: '04:18',
        speaker: 'Marc',
        text: 'It\'s that they build scalable architectures for products nobody wants yet.',
        highlightWords: ['nobody', 'wants', 'yet']
      },
      {
        time: '04:26',
        speaker: 'Alex',
        text: 'So you\'re optimizing the engine before testing if the wheels even turn?',
        highlightWords: ['optimizing', 'engine']
      },
      {
        time: '04:32',
        speaker: 'Marc',
        text: 'Exactly! Sell the prototype on a napkin before you touch a database.',
        highlightWords: ['napkin', 'prototype', 'database']
      }
    ],
    kineticSubtitle: 'Sell the prototype on a napkin BEFORE you touch a single line of code! 🚀',
    bRollPrompt: 'Cinematic whiteboard sketch of startup graveyard to unicorn hockey stick'
  },
  {
    id: 'clip-2',
    title: 'The AI Agent Blueprint for 2026',
    hookCategory: 'Technical Insight',
    score: 92,
    duration: '00:55',
    startTime: 1110, // 18:30
    endTime: 1165,
    estViews: '4.2M',
    speakers: ['Host (Alex)', 'Guest (Dr. Wei)'],
    transcript: [
      {
        time: '18:30',
        speaker: 'Dr. Wei',
        text: 'Single-prompt LLMs are completely obsolete for production enterprise systems.',
        highlightWords: ['Single-prompt', 'obsolete', 'enterprise']
      },
      {
        time: '18:37',
        speaker: 'Dr. Wei',
        text: 'The breakthrough is multi-agent state machines with recursive verification loops.',
        highlightWords: ['multi-agent', 'recursive', 'verification']
      },
      {
        time: '18:49',
        speaker: 'Alex',
        text: 'Like having a senior engineer and QA lead critiquing code in milliseconds.',
        highlightWords: ['QA lead', 'critiquing', 'milliseconds']
      }
    ],
    kineticSubtitle: 'Multi-agent state machines are replacing traditional SaaS workflows entirely! ⚡',
    bRollPrompt: '3D neural graph nodes interconnecting with glowing blue pulses'
  },
  {
    id: 'clip-3',
    title: 'The Dopamine Reset Protocol',
    hookCategory: 'Actionable Advice',
    score: 89,
    duration: '00:52',
    startTime: 1870, // 31:10
    endTime: 1922,
    estViews: '3.1M',
    speakers: ['Host (Alex)', 'Guest (Andrew)'],
    transcript: [
      {
        time: '31:10',
        speaker: 'Andrew',
        text: 'If you check your smartphone within 10 minutes of waking up, you hijack your baseline.',
        highlightWords: ['smartphone', '10 minutes', 'hijack']
      },
      {
        time: '31:18',
        speaker: 'Andrew',
        text: 'Get 500 lux photons in your retinal ganglion cells before any digital screen.',
        highlightWords: ['photons', 'retinal', 'digital screen']
      }
    ],
    kineticSubtitle: 'Never look at your phone in the first 10 minutes. Get natural sunlight first! ☀️',
    bRollPrompt: 'Warm morning sun rays entering optic nerve diagram with serotonin graphs'
  },
  {
    id: 'clip-4',
    title: 'Rambling Intro & Sponsor Read',
    hookCategory: 'Low Retention Segment',
    score: 24,
    duration: '02:05',
    startTime: 10,
    endTime: 135,
    estViews: '42K',
    speakers: ['Host (Alex)'],
    transcript: [
      {
        time: '00:10',
        speaker: 'Alex',
        text: 'Hey guys, welcome back to the channel. Before we jump in, a quick word from our mattress sponsor...',
        highlightWords: ['mattress', 'sponsor']
      }
    ],
    kineticSubtitle: 'Welcome back... and thanks to our mattress sponsor! 🥱',
    bRollPrompt: 'Static podcast studio microphone'
  }
];

const PODCAST_PRESETS = [
  { name: 'Lex Fridman #412', url: 'https://rss.art19.com/lex-fridman-podcast', duration: '03:14:22', episode: 'Marc Andreessen: Tech, AI & Future' },
  { name: 'Huberman Lab #209', url: 'https://feeds.megaphone.fm/hubermanlab', duration: '02:28:15', episode: 'Optimize Dopamine & Focus' },
  { name: 'All-In Podcast #154', url: 'https://feeds.megaphone.fm/all-in', duration: '01:42:08', episode: 'Venture Capital & AI Supercycles' },
];

export default function PodClipHomePage() {
  const [selectedClip, setSelectedClip] = useState<ClipSnippet>(SAMPLE_CLIPS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackTime, setPlaybackTime] = useState<number>(SAMPLE_CLIPS[0].startTime);
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9' | '1:1'>('9:16');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [activeTab, setActiveTab] = useState<'studio' | 'captions' | 'broll' | 'export'>('studio');
  const [rssInput, setRssInput] = useState<string>('https://rss.art19.com/lex-fridman-podcast');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [exportStatus, setExportStatus] = useState<string>('Initializing GPU Render...');
  const [isExportComplete, setIsExportComplete] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [captionStyle, setCaptionStyle] = useState<'hormozi' | 'cyber' | 'minimal'>('hormozi');

  // Spacebar hotkey listener for play/pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        startExport();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedClip]);

  // Audio simulation timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackTime((prev) => {
          if (prev >= selectedClip.endTime) {
            return selectedClip.startTime;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, selectedClip, playbackSpeed]);

  const handleSelectClip = (clip: ClipSnippet) => {
    setSelectedClip(clip);
    setPlaybackTime(clip.startTime);
    setIsPlaying(true);
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    const hours = Math.floor(mins / 60);
    const displayMins = mins % 60;
    return `${hours.toString().padStart(2, '0')}:${displayMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnalyzeFeed = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setSelectedClip(SAMPLE_CLIPS[0]);
      setPlaybackTime(SAMPLE_CLIPS[0].startTime);
    }, 1200);
  };

  const startExport = () => {
    setIsExportModalOpen(true);
    setIsExportComplete(false);
    setExportProgress(0);
    setExportStatus('1/4 Diarizing audio & extracting kinetic timestamps...');

    let progress = 0;
    const interval = setInterval(() => {
      progress += 12;
      if (progress < 35) {
        setExportStatus('2/4 Syncing kinetic Hormozi-style subtitles...');
      } else if (progress < 70) {
        setExportStatus('3/4 Auto-generating 4K dynamic B-roll cutaways...');
      } else if (progress < 95) {
        setExportStatus('4/4 Hardware acceleration encoding (NVENC H.265)...');
      }

      if (progress >= 100) {
        clearInterval(interval);
        setExportProgress(100);
        setExportStatus('🎉 Render complete! 1080x1920 (60fps) ready for download.');
        setIsExportComplete(true);
      } else {
        setExportProgress(progress);
      }
    }, 280);
  };

  const copyClipLink = () => {
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // Generate simulated waveform bars
  const totalWaveBars = 48;
  const currentClipProgress = Math.max(
    0,
    Math.min(1, (playbackTime - selectedClip.startTime) / (selectedClip.endTime - selectedClip.startTime || 1))
  );

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Bar / High Density Nav */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#0B0F17]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          {/* Logo & Status Badge */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm shadow-blue-500/20">
                <Mic className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white">PodClip<span className="text-blue-500">.ai</span></span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">v3.8</span>
              </div>
            </a>

            <div className="hidden md:flex items-center gap-2 pl-3 border-l border-slate-800 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[11px] text-slate-300">Engine Online</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 text-[11px]">120ms Ingestion</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-300">
            <a href="#studio-demo" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-500" />
              Studio Editor
            </a>
            <a href="#viral-radar" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              Viral Radar
            </a>
            <a href="#features-bento" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Engine Specs
            </a>
            <a href="#pricing" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
              Pricing
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                const el = document.getElementById('studio-demo');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-2.5 py-1.5 rounded-md border border-slate-800 hover:border-slate-700 bg-slate-900/60 transition-all font-mono"
            >
              <Terminal className="w-3 h-3 text-slate-400" />
              <span className="text-slate-400 text-[10px] bg-slate-800 px-1 py-0.5 rounded">⌘K</span>
              Quick Demo
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('studio-demo');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 px-3.5 py-1.5 rounded-md transition-all shadow-md shadow-blue-600/20 active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              Launch Studio
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION: Asymmetric Linear / Cobalt Diptych */}
        <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-slate-800/60 bg-studio-grid">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Top Pill Announcement */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs mb-6 shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
              <span className="font-semibold text-blue-200">PodClip v3.8</span>
              <span className="text-blue-500">•</span>
              <span className="text-slate-300">DeepSeek R1 Hook Scoring & 60fps Kinetic Audio Render</span>
              <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Value Prop & Ingestion */}
              <div className="lg:col-span-7 space-y-6">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
                  Turn 2-Hour Podcasts into <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-cyan-400">
                    10 Viral Shorts in 18 Seconds.
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
                  Autonomous AI podcast-to-shorts clipping engine. Whisper v3 Turbo transcription, DeepSeek retention hook detection, kinetic dynamic captions, and 1-click multi-aspect rendering.
                </p>

                {/* Instant RSS / Audio Ingestion Box */}
                <div className="bg-[#0F172A]/90 border border-slate-700/80 p-2 sm:p-2.5 rounded-xl cobalt-glow-sm">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
                        <Radio className="w-4 h-4 text-blue-400" />
                      </div>
                      <input
                        type="text"
                        value={rssInput}
                        onChange={(e) => setRssInput(e.target.value)}
                        placeholder="Paste Spotify, Apple Podcast, YouTube or RSS Feed URL..."
                        className="w-full bg-[#0B0F17] border border-slate-800 text-xs sm:text-sm text-slate-200 pl-9 pr-3 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                    <button
                      onClick={handleAnalyzeFeed}
                      disabled={isAnalyzing}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs sm:text-sm px-4 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-md shadow-blue-600/30 active:scale-95 disabled:opacity-60"
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Ingesting Audio...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-blue-200" />
                          <span>Extract Viral Clips</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Preset feeds quick selector */}
                  <div className="flex items-center flex-wrap gap-2 mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                    <span className="font-mono text-slate-500">Try sample feed:</span>
                    {PODCAST_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => {
                          setRssInput(preset.url);
                          handleAnalyzeFeed();
                        }}
                        className="bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 hover:text-white px-2 py-0.5 rounded border border-slate-700/50 transition-colors flex items-center gap-1 font-mono text-[11px]"
                      >
                        <span>{preset.name}</span>
                        <span className="text-slate-500">({preset.duration})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Key Metrics Row */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="bg-slate-900/50 border border-slate-800/90 rounded-lg p-3">
                    <div className="text-xl sm:text-2xl font-bold font-mono text-blue-400">98.4%</div>
                    <div className="text-[11px] text-slate-400 font-medium">Hook Accuracy</div>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-800/90 rounded-lg p-3">
                    <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">4.2x</div>
                    <div className="text-[11px] text-slate-400 font-medium">Avg Views Growth</div>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-800/90 rounded-lg p-3">
                    <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400">&lt;18s</div>
                    <div className="text-[11px] text-slate-400 font-medium">GPU Render Time</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Studio Live Inspector Card */}
              <div className="lg:col-span-5">
                <div className="bg-[#0F172A] border border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl cobalt-glow">
                  {/* Card Header */}
                  <div className="bg-[#0B0F17] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      <span className="text-xs font-mono text-slate-400 ml-2">live-stream-worker:04</span>
                    </div>
                    <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded">
                      BUFFER: 100%
                    </span>
                  </div>

                  {/* Inspector Body */}
                  <div className="p-4 sm:p-5 space-y-4">
                    {/* Active Ingested Episode Info */}
                    <div className="flex items-start justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center text-white shadow-md">
                          <Headphones className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">Lex Fridman #412: Marc Andreessen</div>
                          <div className="text-[11px] text-slate-400 font-mono">03:14:22 • 44.1kHz Stereo • 2 Speakers</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                        PARSED
                      </span>
                    </div>

                    {/* AI Scoring Radar Mini Bars */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-400">Viral Hook Probability</span>
                        <span className="text-blue-400 font-bold">98 / 100 (Extremely High)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full w-[98%]" />
                      </div>
                    </div>

                    {/* Detected Highlights Pill Stack */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-mono text-slate-400">Detected High-Retention Micro-Clips:</span>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-blue-950/40 border border-blue-500/30 text-xs">
                          <div className="flex items-center gap-2">
                            <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400/20" />
                            <span className="font-medium text-slate-200 truncate max-w-[200px]">Why 99% Startups Fail</span>
                          </div>
                          <span className="font-mono text-emerald-400 text-[11px] font-bold">98 Score</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                            <span className="font-medium truncate max-w-[200px]">AI Agent Blueprint</span>
                          </div>
                          <span className="font-mono text-blue-400 text-[11px]">92 Score</span>
                        </div>
                      </div>
                    </div>

                    {/* Mini Waveform & Play Trigger */}
                    <div className="bg-[#0B0F17] p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-transform active:scale-90"
                      >
                        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                      </button>

                      <div className="flex-1 flex items-end gap-1 h-6">
                        {Array.from({ length: 24 }).map((_, i) => {
                          const heights = [30, 45, 75, 90, 60, 30, 85, 100, 70, 40, 60, 95, 80, 50, 65, 85, 40, 70, 90, 60, 40, 80, 55, 35];
                          const isActive = i < 14;
                          return (
                            <div
                              key={i}
                              className={`flex-1 rounded-full transition-all duration-300 ${
                                isActive ? 'bg-blue-500' : 'bg-slate-700'
                              } ${isPlaying && isActive ? 'animate-pulse' : ''}`}
                              style={{ height: `${heights[i % heights.length]}%` }}
                            />
                          );
                        })}
                      </div>

                      <span className="text-[11px] font-mono text-slate-400">00:46</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE WAVEFORM & CLIP STUDIO DEMO */}
        <section id="studio-demo" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-blue-400 text-xs font-mono uppercase tracking-wider mb-2">
                <Scissors className="w-3.5 h-3.5" />
                <span>Interactive Clip Studio</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Inspect AI Clustered Segments
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Select any detected hook segment below to preview kinetic subtitles, customize aspect ratios, and test 1-click exports.
              </p>
            </div>

            {/* Keyboard shortcuts reminder badge */}
            <div className="hidden sm:flex items-center gap-3 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400">
              <span className="text-slate-500">Shortcuts:</span>
              <span className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 border border-slate-700">[Space] Play/Pause</span>
              <span className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 border border-slate-700">[E] 1-Click Export</span>
            </div>
          </div>

          {/* Studio Canvas Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Live Clip Selector List (4 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono text-slate-400">
                <span>DETECTED VIRAL SEGMENTS ({SAMPLE_CLIPS.length})</span>
                <span>SORT BY VIRALITY</span>
              </div>

              {SAMPLE_CLIPS.map((clip) => {
                const isSelected = selectedClip.id === clip.id;
                const isHighViral = clip.score >= 90;
                const isMedViral = clip.score >= 70 && clip.score < 90;

                return (
                  <div
                    key={clip.id}
                    onClick={() => handleSelectClip(clip)}
                    className={`cursor-pointer rounded-xl p-4 transition-all border text-left relative overflow-hidden ${
                      isSelected
                        ? 'bg-slate-900 border-blue-500 shadow-lg shadow-blue-500/10'
                        : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700'
                    }`}
                  >
                    {/* Active Accent Indicator Bar */}
                    {isSelected && (
                      <div className="absolute top-0 left-0 bottom-0 w-1 bg-blue-500" />
                    )}

                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                        {clip.hookCategory}
                      </span>

                      {/* Score Chip */}
                      <div
                        className={`flex items-center gap-1 font-mono text-xs font-bold px-2 py-0.5 rounded-full ${
                          isHighViral
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : isMedViral
                            ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {isHighViral && <Flame className="w-3 h-3 fill-emerald-400" />}
                        <span>Score: {clip.score}/100</span>
                      </div>
                    </div>

                    <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {clip.title}
                    </h3>

                    <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                      "{clip.transcript[0]?.text}"
                    </p>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/60 text-[11px] font-mono text-slate-400">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{clip.duration}</span>
                        <span>•</span>
                        <span>{formatSeconds(clip.startTime).substring(3)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-300">
                        <Eye className="w-3 h-3 text-blue-400" />
                        <span>Est. {clip.estViews} views</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Interactive Waveform Timeline & Audiogram Video Preview (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Studio Card Container */}
              <div className="bg-[#0F172A] border border-slate-700/80 rounded-2xl overflow-hidden p-4 sm:p-6 space-y-6 cobalt-glow">
                {/* Header Controls: Aspect Ratio Switcher & Tab Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
                    <button
                      onClick={() => setAspectRatio('9:16')}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium transition-all ${
                        aspectRatio === '9:16'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>9:16 Shorts</span>
                    </button>
                    <button
                      onClick={() => setAspectRatio('16:9')}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium transition-all ${
                        aspectRatio === '16:9'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      <span>16:9 YouTube</span>
                    </button>
                    <button
                      onClick={() => setAspectRatio('1:1')}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium transition-all ${
                        aspectRatio === '1:1'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Square className="w-3.5 h-3.5" />
                      <span>1:1 Feed</span>
                    </button>
                  </div>

                  {/* Speed & Mute Toggles */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                      title="Toggle Mute"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-blue-400" />}
                    </button>

                    <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
                      {[1.0, 1.25, 1.5].map((speed) => (
                        <button
                          key={speed}
                          onClick={() => setPlaybackSpeed(speed)}
                          className={`px-2 py-0.5 rounded ${
                            playbackSpeed === speed ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Audiogram Dynamic Preview Box */}
                <div className="flex justify-center bg-[#070A10] rounded-xl p-4 sm:p-6 border border-slate-800/80 relative min-h-[340px] items-center">
                  <div
                    className={`relative rounded-xl overflow-hidden border border-slate-700/80 bg-gradient-to-b from-slate-900 to-[#0B0F17] flex flex-col justify-between p-4 shadow-2xl transition-all duration-300 ${
                      aspectRatio === '9:16'
                        ? 'w-[240px] h-[380px]'
                        : aspectRatio === '16:9'
                        ? 'w-[480px] h-[270px]'
                        : 'w-[320px] h-[320px]'
                    }`}
                  >
                    {/* Top Watermark & Speaker Tag */}
                    <div className="flex items-center justify-between z-10">
                      <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-slate-700/50">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[10px] font-mono text-white font-semibold">
                          {selectedClip.speakers[0] || 'Speaker'}
                        </span>
                      </div>
                      <div className="text-[9px] font-mono uppercase bg-blue-600/80 text-white px-1.5 py-0.5 rounded font-bold">
                        PODCLIP AI
                      </div>
                    </div>

                    {/* Middle: Sound Waveform Reactive Sphere / Kinetic Bar Display */}
                    <div className="my-auto text-center space-y-4 z-10">
                      {/* Avatar / Sound Wave Ring */}
                      <div className="relative inline-block mx-auto">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/30">
                          <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xl">
                            🎙️
                          </div>
                        </div>
                        {isPlaying && (
                          <div className="absolute -inset-2 rounded-full border border-blue-500/40 animate-ping pointer-events-none" />
                        )}
                      </div>

                      {/* Kinetic Dynamic Sound Wave Frequency Visualizer */}
                      <div className="flex items-center justify-center gap-1 h-8 px-4">
                        {Array.from({ length: 18 }).map((_, i) => {
                          const heights = [20, 60, 95, 45, 80, 100, 30, 85, 60, 40, 90, 75, 50, 70, 95, 40, 60, 30];
                          const dynamicHeight = isPlaying ? `${heights[i % heights.length]}%` : '15%';
                          return (
                            <div
                              key={i}
                              className="w-1 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-full transition-all duration-150"
                              style={{ height: dynamicHeight }}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Bottom: Kinetic Word-by-Word Hormozi Subtitles */}
                    <div className="bg-black/80 backdrop-blur-md p-3 rounded-lg border border-slate-700/60 text-center z-10">
                      <div className="text-xs sm:text-sm font-extrabold uppercase tracking-tight text-yellow-300 drop-shadow-md">
                        {selectedClip.kineticSubtitle}
                      </div>
                      <div className="text-[9px] font-mono text-slate-400 mt-1">
                        Auto-Synced • 99.4% Word Precision
                      </div>
                    </div>

                    {/* Ambient Glow in background */}
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-600/20 blur-2xl rounded-full pointer-events-none" />
                  </div>
                </div>

                {/* Waveform Scrubber & Timecode Timeline Bar */}
                <div className="space-y-3 bg-[#0B0F17] p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400 font-bold">{formatSeconds(playbackTime)}</span>
                      <span className="text-slate-600">/</span>
                      <span className="text-slate-400">{formatSeconds(selectedClip.endTime)}</span>
                    </div>

                    <div className="text-slate-400 text-[11px]">
                      Selected Clip Duration: <span className="text-slate-200 font-bold">{selectedClip.duration}</span>
                    </div>
                  </div>

                  {/* Interactive Waveform Canvas / Bars Container */}
                  <div className="relative py-2">
                    {/* Scrub Progress Bar Line */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-blue-400 z-20 shadow-md shadow-blue-400"
                      style={{ left: `${currentClipProgress * 100}%` }}
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-400 -translate-x-1 -translate-y-1 shadow-sm" />
                    </div>

                    {/* Timeline waveform bars */}
                    <div
                      className="flex items-end gap-1 h-14 cursor-pointer"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickX = e.clientX - rect.left;
                        const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                        const targetTime = Math.floor(selectedClip.startTime + ratio * (selectedClip.endTime - selectedClip.startTime));
                        setPlaybackTime(targetTime);
                      }}
                    >
                      {Array.from({ length: totalWaveBars }).map((_, idx) => {
                        const heights = [
                          20, 35, 60, 80, 45, 90, 100, 70, 40, 85, 95, 60, 30, 75, 80, 50, 40, 90, 85, 65, 30, 80, 95, 70,
                          45, 85, 60, 90, 100, 75, 35, 60, 80, 95, 50, 40, 70, 85, 60, 30, 75, 90, 65, 45, 80, 50, 30, 20
                        ];
                        const barRatio = idx / totalWaveBars;
                        const isPast = barRatio <= currentClipProgress;

                        return (
                          <div
                            key={idx}
                            className={`flex-1 rounded-sm transition-all duration-150 ${
                              isPast
                                ? 'bg-gradient-to-t from-blue-600 to-cyan-400'
                                : 'bg-slate-800 hover:bg-slate-700'
                            }`}
                            style={{ height: `${heights[idx % heights.length]}%` }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Studio Action Buttons: Play/Pause, Rewind, Export */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all shadow-md shadow-blue-600/20 active:scale-95"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                        <span>{isPlaying ? 'Pause' : 'Play Clip'}</span>
                      </button>

                      <button
                        onClick={() => setPlaybackTime(selectedClip.startTime)}
                        className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                        title="Restart Clip"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>

                      <button
                        onClick={copyClipLink}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
                      >
                        {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                        <span>{copiedUrl ? 'Copied' : 'Share Timestamp'}</span>
                      </button>
                    </div>

                    {/* 1-Click Export Trigger Button */}
                    <button
                      onClick={startExport}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-lg shadow-blue-600/30 active:scale-95"
                    >
                      <Download className="w-4 h-4" />
                      <span>1-Click Export ({aspectRatio})</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VIRAL RADAR & HOOK TAXONOMY SECTION */}
        <section id="viral-radar" className="py-16 bg-[#080C14] border-y border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <div className="flex items-center gap-2 text-orange-400 text-xs font-mono uppercase tracking-wider mb-2">
                <Flame className="w-3.5 h-3.5" />
                <span>Multimodal Viral Radar</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Trained on 500,000+ Top 1% Short-Form Videos
              </h2>
              <p className="text-slate-400 text-sm mt-2">
                PodClip scans podcast transcripts for 7 key psychological hook patterns: contrarian revelations, open loop suspense, cognitive dissonance, emotional punchlines, and actionable blueprints.
              </p>
            </div>

            {/* Radar Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                    RETENTION HOOK
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">98/100</span>
                </div>
                <h3 className="text-base font-bold text-white">The First 3 Seconds Rule</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Automatically extracts the most provocative contrarian claim and places it at 00:00 before the speaker introduction.
                </p>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Avg Watch Time</span>
                  <span className="text-slate-200 font-bold">+184%</span>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">
                    DIARIZATION ENGINE
                  </span>
                  <span className="text-xs font-mono text-cyan-400 font-bold">99.4% Sync</span>
                </div>
                <h3 className="text-base font-bold text-white">Host vs. Guest Dynamic Cuts</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Identifies multiple speakers by acoustic fingerprint. Alternates single-shot face tracking and split-screen reactions seamlessly.
                </p>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Speaker Accuracy</span>
                  <span className="text-slate-200 font-bold">2-8 Speakers</span>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded">
                    KINETIC AUTO-EMOJIS
                  </span>
                  <span className="text-xs font-mono text-orange-300 font-bold">Smart B-Roll</span>
                </div>
                <h3 className="text-base font-bold text-white">Visual Punch Emphasis</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Keywords like "money", "AI", "algorithm", "failed", and "growth" dynamically trigger animated SFX, highlight glows, and context B-roll.
                </p>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>CTR Boost</span>
                  <span className="text-slate-200 font-bold">+62%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HIGH-DENSITY FEATURE BENTO */}
        <section id="features-bento" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-blue-400 text-xs font-mono uppercase tracking-wider mb-2">
              <Cpu className="w-3.5 h-3.5" />
              <span>Full-Stack Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineered for Production Studios & Creators
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Everything required to scale from a single weekly episode to 50+ localized shorts across TikTok, YouTube, and Instagram.
            </p>
          </div>

          {/* Bento Box Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
            {/* Bento Item 1: Real-Time Transcription (8 cols) */}
            <div className="md:col-span-8 bg-[#0F172A] border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
                  <Mic className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Whisper v3 Turbo Transcription & Diarization</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                  Ultra-fast speech-to-text pipeline with 99.4% word precision. Automatically filters filler words ("um", "like", "you know"), detects background music, and handles accents in 38 languages.
                </p>
              </div>

              {/* Terminal Code Snippet Preview */}
              <div className="bg-[#0B0F17] p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-300">
                <div className="flex items-center justify-between text-slate-500 mb-2 border-b border-slate-800/80 pb-1 text-[11px]">
                  <span>pipeline-diarization.ts</span>
                  <span className="text-emerald-400">LATENCY: 142ms</span>
                </div>
                <div className="text-blue-400">await podclip.transcribe(audioBuffer, &#123;</div>
                <div className="pl-4 text-slate-400">model: "whisper-large-v3-turbo",</div>
                <div className="pl-4 text-slate-400">removeFillerWords: true,</div>
                <div className="pl-4 text-slate-400">detectSpeakers: 2,</div>
                <div className="text-blue-400">&#125;);</div>
              </div>
            </div>

            {/* Bento Item 2: AI Viral Scoring (4 cols) */}
            <div className="md:col-span-4 bg-[#0F172A] border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-4">
                  <Flame className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">AI Retention Scoring</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Scores every 30-60s window from 0-100 based on narrative climax, punchline density, and curiosity gaps.
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between font-mono text-xs">
                <span className="text-slate-400">Top Hook Score</span>
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">98 / 100</span>
              </div>
            </div>

            {/* Bento Item 3: Smart Caption Sync (4 cols) */}
            <div className="md:col-span-4 bg-[#0F172A] border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Hormozi Kinetic Captions</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Word-by-word karaoke bounce styling with custom typography, shadow depth, and automatic keyword highlights.
                </p>
              </div>

              <div className="mt-4 p-2 bg-[#0B0F17] rounded-lg border border-slate-800 text-center font-bold text-xs text-yellow-400 uppercase">
                "NOBODY WANTS IT YET! 🚀"
              </div>
            </div>

            {/* Bento Item 4: Direct RSS Ingestion & Automated Webhooks (8 cols) */}
            <div className="md:col-span-8 bg-[#0F172A] border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Automated RSS Ingestion & Overnight Clipping</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                  Connect your show RSS feed once. The moment a new episode publishes to Apple Podcasts or Spotify, PodClip generates 5 vertical shorts and pushes them directly to your Slack channel or cloud storage.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                  <span className="block text-blue-400 font-bold">1-Click</span>
                  Apple & Spotify Sync
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                  <span className="block text-cyan-400 font-bold">Webhooks</span>
                  Zapier / Make / Slack
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                  <span className="block text-emerald-400 font-bold">4K 60fps</span>
                  GPU Auto Render
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING MATRIX */}
        <section id="pricing" className="py-16 md:py-24 bg-[#080C14] border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-2">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Simple Transparent Pricing</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Scale Your Podcast Audience Today
              </h2>
              <p className="text-slate-400 text-sm mt-2">
                No contracts. Cancel anytime. Start with our free tier or upgrade for full 4K render speed.
              </p>

              {/* Billing Cycle Toggle */}
              <div className="inline-flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 mt-6 text-xs font-mono">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    billingCycle === 'monthly' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    billingCycle === 'annual' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Annual</span>
                  <span className="bg-emerald-500 text-[10px] text-black font-bold px-1.5 py-0.2 rounded">Save 20%</span>
                </button>
              </div>
            </div>

            {/* Pricing Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {/* Free Tier */}
              <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="text-sm font-mono text-slate-400 uppercase mb-2">Hobby</div>
                  <div className="text-3xl font-extrabold text-white font-mono">$0 <span className="text-xs text-slate-500 font-normal">/ month</span></div>
                  <p className="text-xs text-slate-400 mt-2">Ideal for testing out PodClip on individual episodes.</p>

                  <ul className="mt-6 space-y-3 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>30 minutes audio ingestion / mo</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>720p HD export (watermarked)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Standard viral hook scoring</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Basic kinetic subtitle styles</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => {
                    const el = document.getElementById('studio-demo');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="mt-8 w-full py-2.5 rounded-lg border border-slate-700 bg-slate-800/60 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                >
                  Start Free
                </button>
              </div>

              {/* Pro Tier (Featured) */}
              <div className="bg-[#0F172A] border-2 border-blue-500 rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative shadow-2xl cobalt-glow">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white font-mono text-[10px] uppercase font-bold px-3 py-1 rounded-full tracking-wider shadow-sm">
                  MOST POPULAR • CREATOR CHOICE
                </div>

                <div>
                  <div className="text-sm font-mono text-blue-400 uppercase mb-2">Creator Pro</div>
                  <div className="text-3xl font-extrabold text-white font-mono">
                    {billingCycle === 'annual' ? '$15' : '$19'} <span className="text-xs text-slate-500 font-normal">/ month</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">For active podcasters publishing weekly content.</p>

                  <ul className="mt-6 space-y-3 text-xs text-slate-200">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <span><strong>5 hours</strong> audio ingestion / mo</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <span><strong>4K 60fps HDR</strong> kinetic export (No watermark)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <span>DeepSeek R1 Hook virality radar</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <span>Auto B-roll insertion & SFX sounds</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <span>Direct RSS Ingestion & Auto-clipping</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => {
                    const el = document.getElementById('studio-demo');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="mt-8 w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30"
                >
                  Upgrade to Pro
                </button>
              </div>

              {/* Team / Studio Tier */}
              <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="text-sm font-mono text-purple-400 uppercase mb-2">Studio & Agency</div>
                  <div className="text-3xl font-extrabold text-white font-mono">
                    {billingCycle === 'annual' ? '$39' : '$49'} <span className="text-xs text-slate-500 font-normal">/ month</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">For multi-show networks, editing agencies, and production teams.</p>

                  <ul className="mt-6 space-y-3 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span><strong>Unlimited audio</strong> ingestion</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span>Multi-host speaker diarization (up to 8)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span>Custom brand font & color templates</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span>Webhook API & Slack auto-push integration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span>Dedicated GPU cluster render queue</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => {
                    const el = document.getElementById('studio-demo');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="mt-8 w-full py-2.5 rounded-lg border border-purple-500/40 bg-purple-950/40 hover:bg-purple-900/50 text-purple-200 text-xs font-semibold transition-colors"
                >
                  Contact Enterprise
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* DENSE COLOPHON FOOTER */}
      <footer className="border-t border-slate-800/80 bg-[#080B12] py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800/80">
            {/* Brand column */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <Mic className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-sm text-white">PodClip<span className="text-blue-500">.ai</span></span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                The high-performance autonomous podcast clipping pipeline for creators, studios, and agencies.
              </p>
              <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>All 18 GPU Render Nodes Operational</span>
              </div>
            </div>

            {/* Supported Specs */}
            <div>
              <h4 className="font-mono text-slate-200 uppercase text-[11px] font-bold mb-3">Audio & Video Specs</h4>
              <ul className="space-y-1.5 text-[11px] text-slate-500 font-mono">
                <li>• Ingest: MP3, WAV, AAC, M4A, OGG</li>
                <li>• Max Bitrate: 320kbps 48kHz Stereo</li>
                <li>• Export: 1080x1920 (9:16), 1920x1080, 1:1</li>
                <li>• Video Codec: H.264 / H.265 / ProRes 422</li>
              </ul>
            </div>

            {/* Developer & Engine */}
            <div>
              <h4 className="font-mono text-slate-200 uppercase text-[11px] font-bold mb-3">AI Stack & Engine</h4>
              <ul className="space-y-1.5 text-[11px] text-slate-500 font-mono">
                <li>• Whisper Large-v3 Turbo (ASR)</li>
                <li>• PyAnnote 3.1 (Speaker Diarization)</li>
                <li>• DeepSeek R1 (Hook Reasoning)</li>
                <li>• Webhook API v3 REST / GraphQL</li>
              </ul>
            </div>

            {/* Legal & Shortcuts */}
            <div>
              <h4 className="font-mono text-slate-200 uppercase text-[11px] font-bold mb-3">Studio Keyboard Reference</h4>
              <div className="space-y-1 text-[11px] font-mono text-slate-500">
                <div className="flex justify-between">
                  <span>Play / Pause</span>
                  <span className="text-slate-300 bg-slate-900 px-1 rounded">[Space]</span>
                </div>
                <div className="flex justify-between">
                  <span>1-Click Export</span>
                  <span className="text-slate-300 bg-slate-900 px-1 rounded">[E]</span>
                </div>
                <div className="flex justify-between">
                  <span>Quick Demo Search</span>
                  <span className="text-slate-300 bg-slate-900 px-1 rounded">[⌘K]</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-600 font-mono">
            <div>
              © 2026 PodClip AI Inc. All rights reserved. Hallmark Cobalt Theme.
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-slate-400">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-slate-400">Terms of Service</a>
              <span>•</span>
              <a href="#" className="hover:text-slate-400">Security Whitepaper</a>
            </div>
          </div>
        </div>
      </footer>

      {/* 1-CLICK EXPORT SIMULATOR MODAL */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0F172A] border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl cobalt-glow">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white text-base">Exporting Clip: {selectedClip.title}</h3>
              </div>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            {/* Target Spec Summary */}
            <div className="grid grid-cols-3 gap-2 bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300">
              <div>
                <span className="text-slate-500 block">Aspect:</span>
                <span className="font-bold text-blue-400">{aspectRatio}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Resolution:</span>
                <span>1080x1920 (60fps)</span>
              </div>
              <div>
                <span className="text-slate-500 block">Subtitles:</span>
                <span className="text-yellow-400">Kinetic Hormozi</span>
              </div>
            </div>

            {/* Progress Bar & Status */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">{exportStatus}</span>
                <span className="text-blue-400 font-bold">{exportProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 transition-all duration-200"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>

            {/* Terminal logs */}
            <div className="bg-[#0B0F17] p-3 rounded-lg border border-slate-800/80 font-mono text-[10px] text-slate-400 space-y-1 max-h-28 overflow-y-auto">
              <div>[0.12s] ffmpeg -i segment_{selectedClip.id}.wav -vf "scale=1080:1920"</div>
              <div>[0.45s] Applying kinetic text overlay font: Inter-Black tracking=-0.03em</div>
              <div>[1.20s] Hardware encoder: NVIDIA RTX 4090 NVENC session active</div>
              {exportProgress >= 100 && (
                <div className="text-emerald-400 font-bold">[1.88s] Render successful: clip_{selectedClip.id}_{aspectRatio.replace(':', 'x')}.mp4</div>
              )}
            </div>

            {/* Action CTAs */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="px-3 py-2 rounded-lg border border-slate-800 text-xs text-slate-300 hover:text-white"
              >
                Dismiss
              </button>

              {isExportComplete ? (
                <a
                  href={`#download-${selectedClip.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Simulated download triggered for: clip_${selectedClip.id}_${aspectRatio.replace(':', 'x')}.mp4`);
                    setIsExportModalOpen(false);
                  }}
                  className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-md transition-all active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download MP4</span>
                </a>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center gap-1.5 bg-blue-600/50 text-white/50 text-xs font-bold px-4 py-2 rounded-lg cursor-not-allowed"
                >
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Rendering...</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
