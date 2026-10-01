/* Hallmark · macrostructure: workbench · theme: cobalt · pre-emit critique: P5 H5 E5 S5 R5 V5 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  RotateCw,
  Scissors,
  Download,
  Share2,
  Terminal,
  Settings2,
  ChevronRight,
  Search,
  Radio,
  Sliders,
  Check,
  Clock,
  Layers,
  Sparkles,
  Command,
  X,
  Activity,
  FileAudio,
  Film
} from 'lucide-react';

interface ClipSnippet {
  id: string;
  title: string;
  hookCategory: string;
  score: number;
  duration: string;
  startTime: number;
  endTime: number;
  lufs: string;
  speaker: string;
  transcript: {
    time: string;
    speaker: string;
    text: string;
    highlightWords?: string[];
  }[];
  kineticSubtitle: string;
}

const SAMPLE_CLIPS: ClipSnippet[] = [
  {
    id: 'clip-1',
    title: 'Why 99% of Startups Fail on Day 1',
    hookCategory: 'Contrarian Hook',
    score: 98,
    duration: '00:46.320',
    startTime: 252,
    endTime: 298,
    lufs: '-14.2 LUFS',
    speaker: 'Marc Andreessen',
    transcript: [
      {
        time: '04:12.100',
        speaker: 'Marc',
        text: 'The fundamental flaw in 99% of modern startups isn\'t capital or code.',
        highlightWords: ['fundamental', 'flaw', '99%']
      },
      {
        time: '04:18.450',
        speaker: 'Marc',
        text: 'It\'s that they build scalable architectures for products nobody wants yet.',
        highlightWords: ['nobody', 'wants']
      },
      {
        time: '04:26.200',
        speaker: 'Alex',
        text: 'So you\'re optimizing the engine before testing if the wheels even turn?',
        highlightWords: ['optimizing', 'engine']
      },
      {
        time: '04:32.050',
        speaker: 'Marc',
        text: 'Exactly. Sell the prototype on a napkin before touching a database.',
        highlightWords: ['napkin', 'prototype', 'database']
      }
    ],
    kineticSubtitle: 'Sell the prototype on a napkin before you touch a database.'
  },
  {
    id: 'clip-2',
    title: 'The Dopamine Reset Protocol',
    hookCategory: 'High Velocity Debate',
    score: 94,
    duration: '00:38.150',
    startTime: 1870,
    endTime: 1908,
    lufs: '-13.8 LUFS',
    speaker: 'Dr. Andrew Huberman',
    transcript: [
      {
        time: '31:10.020',
        speaker: 'Andrew',
        text: 'If you check your smartphone within 10 minutes of waking up, you hijack baseline dopamine.',
        highlightWords: ['smartphone', '10 minutes', 'hijack']
      },
      {
        time: '31:18.840',
        speaker: 'Andrew',
        text: 'Get 500 lux natural photons in your retinal ganglion cells before any digital screen.',
        highlightWords: ['photons', 'retinal', 'digital screen']
      }
    ],
    kineticSubtitle: 'Never look at your phone in the first 10 minutes. Get natural sunlight first.'
  },
  {
    id: 'clip-3',
    title: 'The AI Supercycle vs Cloud Era',
    hookCategory: 'Actionable Protocol',
    score: 89,
    duration: '00:52.400',
    startTime: 3120,
    endTime: 3172,
    lufs: '-14.0 LUFS',
    speaker: 'Brad Gerstner',
    transcript: [
      {
        time: '52:00.120',
        speaker: 'Brad',
        text: 'This is not the transition from on-premise servers to AWS.',
        highlightWords: ['transition', 'on-premise']
      },
      {
        time: '52:08.500',
        speaker: 'Brad',
        text: 'This is the transition from software as a static tool to software as autonomous labor.',
        highlightWords: ['autonomous', 'labor']
      }
    ],
    kineticSubtitle: 'From software as a static tool to software as autonomous labor.'
  }
];

const SYNTHESIZED_WAVEFORM = [
  35, 62, 28, 75, 88, 34, 52, 90, 65, 42, 78, 55, 30, 85, 92, 40,
  60, 72, 38, 80, 95, 48, 66, 82, 50, 32, 70, 86, 44, 58, 91, 63,
  35, 77, 89, 41, 57, 83, 53, 33, 68, 87, 46, 61, 93, 67, 39, 79,
  94, 49, 64, 84, 51, 31, 69, 85, 43, 59, 90, 62, 36, 76, 88, 42,
  56, 82, 54, 34, 71, 89
];

const SPECTRUM_BARS = [35, 60, 90, 45, 80, 100, 70, 40, 85, 95, 60, 40];

const EPISODE_PRESETS = [
  { name: 'Lex Fridman #412', title: 'Marc Andreessen: AI Superintelligence & Modern Software', duration: '03:14:22.000', rate: '48.0 kHz · 24-bit' },
  { name: 'Huberman Lab #209', title: 'Dr. Andrew Huberman: Dopamine Baselines & Neuroplasticity', duration: '02:28:15.000', rate: '48.0 kHz · 24-bit' },
  { name: 'All-In Podcast #154', title: 'Venture Supercycles, Autonomous Compute & Macro Liquidity', duration: '01:42:08.000', rate: '48.0 kHz · 24-bit' }
];

export default function PodClipHomePage() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [selectedClip, setSelectedClip] = useState<ClipSnippet>(SAMPLE_CLIPS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(SAMPLE_CLIPS[0].startTime + 5);
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '1:1' | '16:9'>('9:16');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [captionStyle, setCaptionStyle] = useState<'word-pop' | 'minimal-sub' | 'kinetic-box'>('word-pop');
  const [isCmdkOpen, setIsCmdkOpen] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [exportPhase, setExportPhase] = useState<string>('Idle');
  const [rssUrl, setRssUrl] = useState<string>('https://rss.art19.com/lex-fridman-podcast');
  const [activeTab, setActiveTab] = useState<'timeline' | 'transcript' | 'telemetry'>('timeline');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Playhead scrubber animation
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= selectedClip.endTime) {
            return selectedClip.startTime;
          }
          return prev + 0.25;
        });
      }, 250);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, selectedClip]);

  // Keyboard shortcut listener: Space (Play/Pause), Cmd+K (Palette), E (Export)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCmdkOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsCmdkOpen(false);
        setIsExporting(false);
      } else if (e.key.toLowerCase() === 'j') {
        setCurrentTime((prev) => Math.max(selectedClip.startTime, prev - 5));
      } else if (e.key.toLowerCase() === 'l') {
        setCurrentTime((prev) => Math.min(selectedClip.endTime, prev + 5));
      } else if (e.key.toLowerCase() === 'm') {
        setIsMuted((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedClip]);

  const handleSelectClip = (clip: ClipSnippet) => {
    setSelectedClip(clip);
    setCurrentTime(clip.startTime);
    setIsPlaying(true);
  };

  const startExportSimulation = () => {
    setIsExporting(true);
    setExportProgress(5);
    setExportPhase('Extracting 48kHz PCM Audio Stems...');

    const phases = [
      { progress: 25, phase: 'Generating Whisper v3 Word Alignments...' },
      { progress: 50, phase: 'Rasterizing Kinetic Typography Canvas @ 60fps...' },
      { progress: 78, phase: 'Hardware Transcode: NVENC H.264 (1080x1920)...' },
      { progress: 95, phase: 'Muxing MP4 Container & Normalizing to -14 LUFS...' },
      { progress: 100, phase: 'Render Complete. Ready for Distribution.' }
    ];

    phases.forEach((item, index) => {
      setTimeout(() => {
        setExportProgress(item.progress);
        setExportPhase(item.phase);
      }, (index + 1) * 800);
    });
  };

  const formatTimecode = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  };

  const clipProgressPct = Math.min(
    100,
    Math.max(0, ((currentTime - selectedClip.startTime) / (selectedClip.endTime - selectedClip.startTime)) * 100)
  );

  return (
    <div className="min-h-screen bg-[#080B11] text-[#F1F5F9] font-sans antialiased selection:bg-[#2563EB]/30 selection:text-white">
      {/* ⌘K Command Palette Modal */}
      {isCmdkOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-[#0E131F] border border-[#1C2638] rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center px-3 border-b border-[#1C2638]">
              <Search className="w-4 h-4 text-[#64748B] mr-2" />
              <input
                type="text"
                placeholder="Type a command, jump to timestamp, or search audio transcript..."
                className="w-full bg-transparent py-3 text-sm text-[#F1F5F9] placeholder-[#64748B] focus:outline-none font-mono"
                autoFocus
              />
              <button onClick={() => setIsCmdkOpen(false)} className="text-[#64748B] hover:text-[#F1F5F9] p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2 space-y-1 text-xs">
              <div className="px-2 py-1.5 text-[10px] uppercase font-mono tracking-wider text-[#64748B]">Actions</div>
              <button
                onClick={() => { setIsCmdkOpen(false); startExportSimulation(); }}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded text-left hover:bg-[#141B2D] text-[#F1F5F9]"
              >
                <span className="flex items-center gap-2"><Film className="w-3.5 h-3.5 text-[#2563EB]" /> Render Active Clip to MP4</span>
                <span className="font-mono text-[10px] text-[#64748B] bg-[#080B11] px-1.5 py-0.5 rounded border border-[#1C2638]">E</span>
              </button>
              <button
                onClick={() => { setIsCmdkOpen(false); setIsPlaying(!isPlaying); }}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded text-left hover:bg-[#141B2D] text-[#F1F5F9]"
              >
                <span className="flex items-center gap-2"><Play className="w-3.5 h-3.5 text-[#2563EB]" /> Toggle Play / Pause</span>
                <span className="font-mono text-[10px] text-[#64748B] bg-[#080B11] px-1.5 py-0.5 rounded border border-[#1C2638]">Space</span>
              </button>
              <button
                onClick={() => { setIsCmdkOpen(false); setAspectRatio('9:16'); }}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded text-left hover:bg-[#141B2D] text-[#F1F5F9]"
              >
                <span className="flex items-center gap-2"><Layers className="w-3.5 h-3.5 text-[#2563EB]" /> Switch Aspect Ratio to 9:16 Vertical</span>
                <span className="font-mono text-[10px] text-[#64748B] bg-[#080B11] px-1.5 py-0.5 rounded border border-[#1C2638]">1</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export / Render Modal */}
      {isExporting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0E131F] border border-[#1C2638] rounded-lg p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1C2638] pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#2563EB] animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-wider text-[#F1F5F9]">Hardware Encoder Pipeline</span>
              </div>
              <button onClick={() => setIsExporting(false)} className="text-[#64748B] hover:text-[#F1F5F9]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#94A3B8]">{exportPhase}</span>
                <span className="text-[#2563EB] font-bold">{exportProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#141B2D] rounded-full overflow-hidden border border-[#1C2638]">
                <div
                  className="h-full bg-[#2563EB] transition-all duration-300"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>

            <div className="bg-[#080B11] p-3 rounded border border-[#1C2638] text-[11px] font-mono space-y-1 text-[#64748B]">
              <div>Target: 1080x1920 (9:16 Vertical Video)</div>
              <div>Codec: H.264 / AAC High Profile @ 60.00 fps</div>
              <div>Audio Normalization: Integrated -14.2 LUFS (EBU R128)</div>
              <div>Output stem: {selectedClip.id}_render_master.mp4</div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              {exportProgress === 100 ? (
                <button
                  onClick={() => setIsExporting(false)}
                  className="w-full py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium rounded transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Download Rendered MP4
                </button>
              ) : (
                <button
                  onClick={() => setIsExporting(false)}
                  className="px-3 py-1.5 border border-[#1C2638] hover:border-[#2A3852] text-[#94A3B8] text-xs rounded transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* HEADER / NAVIGATION: Hairline Bordered, Space Grotesk / Monospace */}
      <header className="sticky top-0 z-40 w-full border-b border-[#1C2638] bg-[#080B11]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#2563EB]" />
              <span className="font-mono text-sm font-semibold tracking-tight text-[#F1F5F9]">PODCLIP</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[#1C2638] text-[#94A3B8] bg-[#0E131F]">
                STUDIO v3.8
              </span>
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-[#64748B] pl-4 border-l border-[#1C2638]">
              <span>PCM 48.0kHz</span>
              <span>•</span>
              <span>24-bit Stereo</span>
              <span>•</span>
              <span className="text-[#94A3B8]">LUFS -14.2</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCmdkOpen(true)}
              className="hidden sm:flex items-center gap-2 text-xs font-mono px-2.5 py-1 rounded border border-[#1C2638] hover:border-[#2A3852] bg-[#0E131F] text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
            >
              <Command className="w-3 h-3 text-[#64748B]" />
              <span>Jump to timecode...</span>
              <span className="text-[10px] bg-[#141B2D] px-1 py-0.5 rounded border border-[#1C2638]">⌘K</span>
            </button>

            <button
              onClick={startExportSimulation}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-medium px-3 py-1.5 rounded bg-[#2563EB] hover:bg-[#1D4ED8] text-white transition-colors shadow-sm"
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Render Active Clip</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN WORKBENCH LAYOUT (Macrostructure 05: The tool is the primary focal point) */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        
        {/* INGESTION BAR: Real Audio Feeds & Presets */}
        <section className="bg-[#0E131F] border border-[#1C2638] rounded-lg p-3">
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#64748B]">
                <Radio className="w-3.5 h-3.5 text-[#2563EB]" />
              </div>
              <input
                type="text"
                value={rssUrl}
                onChange={(e) => setRssUrl(e.target.value)}
                placeholder="Enter podcast episode RSS feed, Spotify link, or .wav master stem URL..."
                className="w-full bg-[#080B11] border border-[#1C2638] text-xs text-[#F1F5F9] pl-9 pr-3 py-2 rounded focus:outline-none focus:border-[#2563EB] font-mono"
              />
            </div>
            
            <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto text-[11px] font-mono text-[#94A3B8]">
              <span className="text-[#64748B] text-[10px] uppercase tracking-wider shrink-0">Presets:</span>
              {EPISODE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setRssUrl(preset.title)}
                  className="px-2 py-1 rounded border border-[#1C2638] hover:border-[#2A3852] bg-[#080B11] hover:text-[#F1F5F9] transition-colors whitespace-nowrap"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* WORKBENCH STUDIO GRID: Asymmetric Left (Clips Queue & Telemetry) + Right (9:16 Canvas & Scrubber) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN (lg:col-span-5): Detected Clips Queue with Real Audio Engineering Specs */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1C2638] pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                <h2 className="text-xs font-mono uppercase tracking-wider font-semibold text-[#F1F5F9]">
                  Segmented Retention Hooks ({SAMPLE_CLIPS.length})
                </h2>
              </div>
              <span className="text-[10px] font-mono text-[#64748B]">VAD + Whisper v3</span>
            </div>

            <div className="space-y-2">
              {SAMPLE_CLIPS.map((clip) => {
                const isSelected = selectedClip.id === clip.id;
                return (
                  <button
                    key={clip.id}
                    onClick={() => handleSelectClip(clip)}
                    className={`w-full text-left p-3.5 rounded-lg border transition-all text-xs space-y-2.5 ${
                      isSelected
                        ? 'bg-[#141B2D] border-[#2563EB] shadow-sm'
                        : 'bg-[#0E131F] border-[#1C2638] hover:border-[#2A3852]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-[#1C2638] bg-[#080B11] text-[#94A3B8]">
                        SCORE {clip.score} · VIRAL
                      </span>
                      <div className="flex items-center gap-2 font-mono text-[10px] text-[#64748B]">
                        <span>{clip.duration}</span>
                        <span>•</span>
                        <span>{clip.lufs}</span>
                      </div>
                    </div>

                    <div className="font-medium text-sm text-[#F1F5F9] leading-snug">
                      {clip.title}
                    </div>

                    <div className="text-[11px] text-[#94A3B8] leading-relaxed line-clamp-2 italic">
                      "{clip.kineticSubtitle}"
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#1C2638]/60 text-[10px] font-mono text-[#64748B]">
                      <span>Speaker: {clip.speaker}</span>
                      <span className="text-[#2563EB] flex items-center gap-1">
                        Inspect Waveform <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* TABULAR PIPELINE INSPECTION (Clean technical spec, not 3-card grid) */}
            <div className="bg-[#0E131F] border border-[#1C2638] rounded-lg p-3.5 space-y-3 text-xs">
              <div className="font-mono text-[11px] uppercase tracking-wider text-[#94A3B8] font-semibold border-b border-[#1C2638] pb-1.5 flex items-center justify-between">
                <span>Audio Engine Telemetry</span>
                <span className="text-[#2563EB]">EBU R128</span>
              </div>
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="bg-[#080B11] p-2 rounded border border-[#1C2638]">
                  <span className="text-[#64748B] block text-[9px] uppercase">Sampling Rate</span>
                  <span className="text-[#F1F5F9] font-medium">48,000 Hz</span>
                </div>
                <div className="bg-[#080B11] p-2 rounded border border-[#1C2638]">
                  <span className="text-[#64748B] block text-[9px] uppercase">Quantization</span>
                  <span className="text-[#F1F5F9] font-medium">24-bit Linear PCM</span>
                </div>
                <div className="bg-[#080B11] p-2 rounded border border-[#1C2638]">
                  <span className="text-[#64748B] block text-[9px] uppercase">Loudness Target</span>
                  <span className="text-[#F1F5F9] font-medium">-14.0 LUFS ±0.5</span>
                </div>
                <div className="bg-[#080B11] p-2 rounded border border-[#1C2638]">
                  <span className="text-[#64748B] block text-[9px] uppercase">VAD Algorithm</span>
                  <span className="text-[#F1F5F9] font-medium">Silero v4.1 Diarized</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (lg:col-span-7): The Studio Monitor & Timeline Scrubber */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* STUDIO MONITOR BOX */}
            <div className="bg-[#0E131F] border border-[#1C2638] rounded-lg overflow-hidden flex flex-col">
              
              {/* Studio Canvas Toolbar */}
              <div className="px-4 py-2.5 border-b border-[#1C2638] flex items-center justify-between text-xs font-mono bg-[#080B11]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
                  <span className="text-[#F1F5F9] font-semibold">VIEWPORT: {aspectRatio}</span>
                  <span className="text-[#64748B]">|</span>
                  <span className="text-[#94A3B8]">{formatTimecode(currentTime)}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setAspectRatio('9:16')}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors ${
                      aspectRatio === '9:16'
                        ? 'bg-[#2563EB] border-[#2563EB] text-white'
                        : 'bg-[#0E131F] border-[#1C2638] text-[#94A3B8] hover:text-[#F1F5F9]'
                    }`}
                  >
                    9:16
                  </button>
                  <button
                    onClick={() => setAspectRatio('1:1')}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors ${
                      aspectRatio === '1:1'
                        ? 'bg-[#2563EB] border-[#2563EB] text-white'
                        : 'bg-[#0E131F] border-[#1C2638] text-[#94A3B8] hover:text-[#F1F5F9]'
                    }`}
                  >
                    1:1
                  </button>
                  <button
                    onClick={() => setAspectRatio('16:9')}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors ${
                      aspectRatio === '16:9'
                        ? 'bg-[#2563EB] border-[#2563EB] text-white'
                        : 'bg-[#0E131F] border-[#1C2638] text-[#94A3B8] hover:text-[#F1F5F9]'
                    }`}
                  >
                    16:9
                  </button>
                </div>
              </div>

              {/* Studio Canvas Display: Simulated Video Frame with Kinetic Text Overlay */}
              <div className="relative bg-[#05070B] aspect-[16/10] sm:aspect-[16/9] flex items-center justify-center p-6 overflow-hidden">
                
                {/* 9:16 Aspect Mask Guide */}
                <div
                  className={`relative bg-[#0E131F] border border-[#2A3852] rounded shadow-2xl flex flex-col justify-between p-4 transition-all duration-300 ${
                    aspectRatio === '9:16'
                      ? 'w-[200px] h-[355px]'
                      : aspectRatio === '1:1'
                      ? 'w-[280px] h-[280px]'
                      : 'w-full h-[260px]'
                  }`}
                >
                  {/* Speaker Identifier Badge */}
                  <div className="flex items-center justify-between text-[10px] font-mono border-b border-[#1C2638] pb-1.5 text-[#94A3B8]">
                    <span>{selectedClip.speaker}</span>
                    <span className="text-[#2563EB]">LIVE STREAM</span>
                  </div>

                  {/* Kinetic Audio Visualizer simulation */}
                  <div className="flex items-center justify-center gap-1 h-12 my-auto">
                    {SPECTRUM_BARS.map((h, i) => (
                      <span
                        key={i}
                        className="w-1 bg-[#2563EB] rounded-full transition-all duration-150"
                        style={{
                          height: (mounted && isPlaying) ? `${Math.round(h * 0.75)}%` : '20%',
                          opacity: (mounted && isPlaying) ? 0.9 : 0.3
                        }}
                      />
                    ))}
                  </div>

                  {/* Kinetic Subtitle Box (Hormozi / Clean Typography) */}
                  <div className="text-center space-y-1">
                    <span className="inline-block bg-[#2563EB] text-white font-mono font-bold text-xs uppercase px-2 py-0.5 rounded tracking-wide shadow">
                      {isPlaying ? '▶' : '❚❚'} {selectedClip.kineticSubtitle.split(' ').slice(0, 4).join(' ')}
                    </span>
                    <p className="text-[11px] font-medium text-[#F1F5F9] leading-tight px-1">
                      {selectedClip.kineticSubtitle}
                    </p>
                  </div>

                  {/* Bottom Audio Telemetry Strip */}
                  <div className="flex items-center justify-between text-[9px] font-mono text-[#64748B] pt-1.5 border-t border-[#1C2638]">
                    <span>48kHz</span>
                    <span className="text-[#2563EB]">{selectedClip.lufs}</span>
                    <span>60 FPS</span>
                  </div>
                </div>
              </div>

              {/* TIMELINE SCRUBBER (Inspired by 21st.dev Filmstrip Scrub pattern) */}
              <div className="p-4 bg-[#080B11] border-t border-[#1C2638] space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-[#2563EB] font-bold">{formatTimecode(currentTime)}</span>
                    <span className="text-[#64748B]">/</span>
                    <span className="text-[#94A3B8]">{formatTimecode(selectedClip.endTime)}</span>
                  </div>

                  {/* Decibel VU Meter Display */}
                  <div className="flex items-center gap-1 text-[10px] text-[#64748B]">
                    <span>VU:</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((bar) => (
                        <span
                          key={bar}
                          className={`w-1.5 h-3 rounded-xs ${
                            bar < 6
                              ? 'bg-emerald-500'
                              : bar === 6
                              ? 'bg-amber-400'
                              : 'bg-rose-500'
                          }`}
                          style={{ opacity: isPlaying && bar <= 5 ? 1 : 0.2 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Interactive Waveform Track & Scrub Bar */}
                <div
                  className="relative h-12 bg-[#0E131F] border border-[#1C2638] rounded cursor-pointer overflow-hidden flex items-center px-1"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const pct = clickX / rect.width;
                    const newTime = selectedClip.startTime + pct * (selectedClip.endTime - selectedClip.startTime);
                    setCurrentTime(newTime);
                  }}
                >
                  {/* Synthesized Waveform Amplitude Bars */}
                  <div className="absolute inset-0 flex items-center justify-between px-2 gap-0.5 opacity-50 pointer-events-none">
                    {SYNTHESIZED_WAVEFORM.map((h, idx) => (
                      <div
                        key={idx}
                        className="w-1 bg-[#2A3852] rounded-xs"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>

                  {/* Elapsed Highlight Track */}
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-[#2563EB]/15 border-r border-[#2563EB] pointer-events-none transition-all duration-75"
                    style={{ width: `${clipProgressPct}%` }}
                  />

                  {/* Playhead Marker */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-[#2563EB] pointer-events-none z-10"
                    style={{ left: `${clipProgressPct}%` }}
                  >
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#2563EB] rounded-full shadow" />
                  </div>
                </div>

                {/* Audio Transport Controls */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentTime((prev) => Math.max(selectedClip.startTime, prev - 5))}
                      className="p-1.5 rounded border border-[#1C2638] hover:border-[#2A3852] bg-[#0E131F] text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
                      title="Rewind 5s [J]"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="px-3 py-1.5 rounded bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Play/Pause [Space]"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
                    </button>
                    <button
                      onClick={() => setCurrentTime((prev) => Math.min(selectedClip.endTime, prev + 5))}
                      className="p-1.5 rounded border border-[#1C2638] hover:border-[#2A3852] bg-[#0E131F] text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
                      title="Forward 5s [L]"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1.5 rounded border border-[#1C2638] hover:border-[#2A3852] bg-[#0E131F] text-[#94A3B8] hover:text-[#F1F5F9] transition-colors ml-1"
                      title="Mute [M]"
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] text-[#64748B]">
                    <span>[Space] Play</span>
                    <span>[J/L] Seek</span>
                    <span>[M] Mute</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SYNCED TRANSCRIPT INSPECTOR */}
            <div className="bg-[#0E131F] border border-[#1C2638] rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#1C2638] pb-2">
                <span className="font-mono text-xs uppercase tracking-wider text-[#94A3B8] font-semibold">
                  Sub-Frame Aligned Transcript
                </span>
                <span className="font-mono text-[10px] text-[#2563EB]">Whisper v3 Turbo</span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedClip.transcript.map((line, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded border border-[#1C2638]/70 bg-[#080B11] text-xs space-y-1 hover:border-[#2A3852] transition-colors"
                  >
                    <div className="flex items-center justify-between font-mono text-[10px] text-[#64748B]">
                      <span className="text-[#94A3B8] font-semibold">{line.speaker}</span>
                      <span>{line.time}</span>
                    </div>
                    <p className="text-[#F1F5F9] leading-relaxed">
                      {line.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* FOOTER: Minimal Technical Masthead */}
      <footer className="border-t border-[#1C2638] mt-12 py-6 text-center text-xs font-mono text-[#64748B]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>PARABOX PODCLIP AI · AUDIO INTELLIGENCE SUITE</span>
          <div className="flex items-center gap-4 text-[#94A3B8]">
            <a href="https://github.com/parabox-so" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
            <span>•</span>
            <span>FastAPI Monorepo</span>
            <span>•</span>
            <span>Next.js 15 Turbopack</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
