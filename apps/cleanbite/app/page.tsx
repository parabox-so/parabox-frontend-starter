'use client';

import React, { useState } from 'react';

interface FoodItem {
  id: string;
  name: string;
  category: string;
  emoji: string;
  score: number;
  grade: 'Excellent' | 'Good' | 'Poor' | 'Bad';
  color: string;
  bgBadge: string;
  nutrition: {
    sugar: { level: 'Low' | 'Moderate' | 'High'; value: string };
    fat: { level: 'Low' | 'Moderate' | 'High'; value: string };
    salt: { level: 'Low' | 'Moderate' | 'High'; value: string };
    fiber: { level: 'Low' | 'Moderate' | 'High'; value: string };
  };
  additives: { name: string; risk: 'High' | 'Moderate' | 'None'; note: string }[];
  swap?: {
    name: string;
    emoji: string;
    score: number;
    pointsDiff: number;
    reason: string;
  };
}

const SAMPLE_FOODS: FoodItem[] = [
  {
    id: 'donut',
    name: 'Glazed Confetti Mini Donuts',
    category: 'Packaged Bakery',
    emoji: '🍩',
    score: 18,
    grade: 'Bad',
    color: 'text-rose-600',
    bgBadge: 'bg-rose-100 text-rose-800 border-rose-200',
    nutrition: {
      sugar: { level: 'High', value: '34g (Too sweet)' },
      fat: { level: 'High', value: '18g saturated fat' },
      salt: { level: 'Moderate', value: '380mg sodium' },
      fiber: { level: 'Low', value: '<1g dietary fiber' },
    },
    additives: [
      { name: 'Titanium Dioxide (E171)', risk: 'High', note: 'Genotoxicity concern, banned in EU' },
      { name: 'Red 40 & Yellow 5', risk: 'High', note: 'Artificial petroleum dyes linked to attention issues' },
      { name: 'High Fructose Corn Syrup', risk: 'Moderate', note: 'Ultra-processed metabolic stressor' },
    ],
    swap: {
      name: 'Organic Sprouted Cinnamon Oat Bites',
      emoji: '🌾',
      score: 88,
      pointsDiff: 70,
      reason: '0 artificial dyes, sweetened with dates & maple, 6g prebiotic fiber',
    },
  },
  {
    id: 'soda',
    name: 'Neon Blast Strawberry Soda',
    category: 'Beverages',
    emoji: '🥤',
    score: 24,
    grade: 'Bad',
    color: 'text-rose-600',
    bgBadge: 'bg-rose-100 text-rose-800 border-rose-200',
    nutrition: {
      sugar: { level: 'High', value: '42g (10 tsp sugar)' },
      fat: { level: 'Low', value: '0g fat' },
      salt: { level: 'Low', value: '45mg sodium' },
      fiber: { level: 'Low', value: '0g fiber' },
    },
    additives: [
      { name: 'Red Dye #40 (Allura Red)', risk: 'High', note: 'Allergenic potential & gut barrier stress' },
      { name: 'Sodium Benzoate (E211)', risk: 'High', note: 'Forms benzene when combined with vitamin C' },
      { name: 'Phosphoric Acid', risk: 'Moderate', note: 'Can leach calcium from bone enamel' },
    ],
    swap: {
      name: 'Wild Strawberry Prebiotic Sparkler',
      emoji: '🍓',
      score: 92,
      pointsDiff: 68,
      reason: '100% real fruit juice, 2g sugar, 5g plant fiber for gut microbiome',
    },
  },
  {
    id: 'oats',
    name: 'Organic Steel-Cut Rolled Oats',
    category: 'Breakfast Grains',
    emoji: '🥣',
    score: 96,
    grade: 'Excellent',
    color: 'text-emerald-700',
    bgBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    nutrition: {
      sugar: { level: 'Low', value: '0g added sugar' },
      fat: { level: 'Low', value: '2.5g whole plant fats' },
      salt: { level: 'Low', value: '0mg sodium' },
      fiber: { level: 'High', value: '8g beta-glucan fiber' },
    },
    additives: [
      { name: 'Zero Artificial Additives', risk: 'None', note: 'Single whole-food ingredient: 100% Organic Oats' },
      { name: 'Glyphosate-Free Certified', risk: 'None', note: 'Tested clean from agricultural chemical residue' },
    ],
  },
  {
    id: 'peanut-butter',
    name: 'Commercial Creamy Peanut Butter',
    category: 'Spreads',
    emoji: '🥜',
    score: 38,
    grade: 'Poor',
    color: 'text-amber-600',
    bgBadge: 'bg-amber-100 text-amber-800 border-amber-200',
    nutrition: {
      sugar: { level: 'High', value: '8g added cane sugar' },
      fat: { level: 'High', value: '16g (partially hydrogenated)' },
      salt: { level: 'Moderate', value: '150mg salt' },
      fiber: { level: 'Moderate', value: '2g fiber' },
    },
    additives: [
      { name: 'Fully Hydrogenated Vegetable Oils', risk: 'High', note: 'Industrial trans fat byproduct' },
      { name: 'Mono & Diglycerides (E471)', risk: 'Moderate', note: 'Emulsifier linked to gut lining disruption' },
    ],
    swap: {
      name: 'Stone-Ground Single-Ingredient Peanut Butter',
      emoji: '🫙',
      score: 90,
      pointsDiff: 52,
      reason: 'Only dry roasted organic peanuts + pinch of sea salt. 0 seed oils.',
    },
  },
];

export default function CleanBiteLandingPage() {
  const [activeItem, setActiveItem] = useState<FoodItem>(SAMPLE_FOODS[0]);
  const [isScanning, setIsScanning] = useState(false);

  const handleSelectFood = (item: FoodItem) => {
    setIsScanning(true);
    setTimeout(() => {
      setActiveItem(item);
      setIsScanning(false);
    }, 350);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5] text-emerald-950 selection:bg-emerald-200">
      {/* 🟢 TOP ANNOUNCEMENT BANNER */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>100% Independent • Zero Brand Ads • Science-Backed Nutrition Decoding</span>
      </div>

      {/* 🧭 NAVIGATION */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-emerald-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl shadow-md shadow-emerald-600/20 rotate-[-4deg]">
              🥑
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-emerald-950 font-serif">CleanBite</span>
              <span className="hidden sm:inline-block ml-2 text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Hum Edition
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-emerald-900/80">
            <a href="#demo" className="hover:text-emerald-700 transition-colors">Live Scanner</a>
            <a href="#how-it-works" className="hover:text-emerald-700 transition-colors">How it Works</a>
            <a href="#features" className="hover:text-emerald-700 transition-colors">Additive Radar</a>
            <a href="#pricing" className="hover:text-emerald-700 transition-colors">Plans</a>
            <a href="#faq" className="hover:text-emerald-700 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#demo"
              className="px-5 py-2.5 rounded-full bg-emerald-800 text-white text-sm font-bold shadow-lg shadow-emerald-800/20 hover:bg-emerald-900 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Scan a Product Free
            </a>
          </div>
        </div>
      </header>

      {/* 🚀 HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <span>🛡️ Your Pocket Grocery Bodyguard</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-emerald-950 tracking-tight font-serif max-w-4xl mx-auto leading-[1.08]">
          Scan your food. <br className="hidden sm:inline" />
          <span className="text-emerald-700 underline decoration-amber-400 decoration-wavy decoration-2">
            Expose hidden junk.
          </span> <br className="hidden sm:inline" />
          Eat with total confidence.
        </h1>

        <p className="text-lg sm:text-xl text-emerald-900/80 max-w-2xl mx-auto font-normal leading-relaxed">
          Point your camera at any grocery barcode or ingredient label. CleanBite decodes toxic additives, endocrine disruptors, and industrial seed oils in <strong>under 200ms</strong> — then hands you clean, delicious swaps.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <a
            href="#demo"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-base font-bold shadow-xl shadow-emerald-700/25 hover:shadow-2xl transition-all flex items-center justify-center gap-2"
          >
            <span>📱 Try the Live Scanner Demo</span>
            <span>↓</span>
          </a>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-900 border-2 border-emerald-900/10 text-base font-bold shadow-sm transition-all"
          >
            See How Scoring Works
          </a>
        </div>

        {/* Floating pill tags */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-emerald-800">
          <span className="px-3.5 py-1.5 rounded-full bg-white border border-emerald-100 shadow-sm">
            ✨ 0–100 Objective Score
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-white border border-emerald-100 shadow-sm">
            🚫 1,400+ Additives Flagged
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-white border border-emerald-100 shadow-sm">
            🥑 Instant Healthy Swaps
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-white border border-emerald-100 shadow-sm">
            ⚡ Offline Scanner Mode
          </span>
        </div>
      </section>

      {/* 🎮 LIVE INTERACTIVE SCANNER CANVAS DEMO */}
      <section id="demo" className="py-16 px-4 sm:px-6 lg:px-8 bg-emerald-950 text-white rounded-3xl max-w-7xl mx-auto my-8 shadow-2xl relative overflow-hidden">
        {/* Background glow & accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-900/80 px-3 py-1 rounded-full border border-emerald-700/50">
              Interactive Live Demonstration
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-serif tracking-tight text-white">
              Pick a food. Watch CleanBite dissect the label.
            </h2>
            <p className="text-sm text-emerald-200/80 max-w-xl mx-auto">
              Click any sample grocery item below to simulate a real-time camera barcode scan.
            </p>
          </div>

          {/* Sample Food Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SAMPLE_FOODS.map((food) => {
              const isSelected = activeItem.id === food.id;
              return (
                <button
                  key={food.id}
                  onClick={() => handleSelectFood(food)}
                  className={`p-3.5 rounded-2xl text-left border transition-all flex items-center gap-3 ${
                    isSelected
                      ? 'bg-emerald-800 border-emerald-400 ring-2 ring-emerald-400/40 scale-[1.02] shadow-lg'
                      : 'bg-emerald-900/40 border-emerald-800/60 hover:bg-emerald-900/80 text-zinc-300'
                  }`}
                >
                  <span className="text-3xl">{food.emoji}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{food.name}</p>
                    <p className="text-[11px] text-emerald-300/80">{food.category}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Simulated Scanner Device & Analysis Canvas */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-4">
            {/* Left: Simulated Camera Viewfinder */}
            <div className="lg:col-span-5 bg-black/60 rounded-3xl p-6 border border-emerald-700/40 relative overflow-hidden flex flex-col items-center justify-center min-h-[380px]">
              {/* Scan Laser Animation */}
              <div className="absolute inset-x-4 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399] animate-scan-laser z-20 pointer-events-none" />

              {/* Viewfinder Target Frame */}
              <div className="w-56 h-56 rounded-2xl border-2 border-dashed border-emerald-500/50 flex flex-col items-center justify-center relative p-4 bg-emerald-950/20">
                <span className="text-6xl mb-2 animate-float-soft">{activeItem.emoji}</span>
                <span className="text-xs font-mono text-emerald-300 bg-black/80 px-2 py-1 rounded">
                  BARCODE: 8492019482
                </span>
                {/* Corner markers */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 justify-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  {isScanning ? 'DECODING INGREDIENTS...' : 'SCAN COMPLETE (140ms)'}
                </p>
                <p className="text-xs text-zinc-400 mt-1">{activeItem.name}</p>
              </div>
            </div>

            {/* Right: Health Score & Additive Dissection */}
            <div className="lg:col-span-7 bg-white text-emerald-950 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              {/* Header: Score Ring & Classification */}
              <div className="flex items-center justify-between border-b border-zinc-100 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{activeItem.emoji}</span>
                    <h3 className="text-xl font-bold font-serif">{activeItem.name}</h3>
                  </div>
                  <p className="text-xs text-zinc-500">{activeItem.category} • Analyzed by CleanBite Index</p>
                </div>

                {/* Score Pill */}
                <div className="flex flex-col items-end">
                  <div className={`text-3xl font-black font-serif ${activeItem.color}`}>
                    {activeItem.score}<span className="text-base text-zinc-400">/100</span>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${activeItem.bgBadge}`}>
                    {activeItem.grade}
                  </span>
                </div>
              </div>

              {/* Nutritional Matrix */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Nutritional Breakdown</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
                    <p className="text-zinc-500 text-[10px] uppercase font-semibold">Sugar</p>
                    <p className="font-bold text-zinc-800">{activeItem.nutrition.sugar.level}</p>
                    <p className="text-[10px] text-zinc-400 truncate">{activeItem.nutrition.sugar.value}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
                    <p className="text-zinc-500 text-[10px] uppercase font-semibold">Saturated Fat</p>
                    <p className="font-bold text-zinc-800">{activeItem.nutrition.fat.level}</p>
                    <p className="text-[10px] text-zinc-400 truncate">{activeItem.nutrition.fat.value}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
                    <p className="text-zinc-500 text-[10px] uppercase font-semibold">Sodium</p>
                    <p className="font-bold text-zinc-800">{activeItem.nutrition.salt.level}</p>
                    <p className="text-[10px] text-zinc-400 truncate">{activeItem.nutrition.salt.value}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
                    <p className="text-zinc-500 text-[10px] uppercase font-semibold">Fiber</p>
                    <p className="font-bold text-zinc-800">{activeItem.nutrition.fiber.level}</p>
                    <p className="text-[10px] text-zinc-400 truncate">{activeItem.nutrition.fiber.value}</p>
                  </div>
                </div>
              </div>

              {/* Flagged Additives */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Additive & Chemical Analysis ({activeItem.additives.length})
                </h4>
                <div className="space-y-2">
                  {activeItem.additives.map((add, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl text-xs flex items-start justify-between gap-3 border ${
                        add.risk === 'High'
                          ? 'bg-rose-50 border-rose-200 text-rose-950'
                          : add.risk === 'Moderate'
                          ? 'bg-amber-50 border-amber-200 text-amber-950'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      }`}
                    >
                      <div>
                        <p className="font-bold flex items-center gap-1.5">
                          <span>{add.risk === 'High' ? '🔴' : add.risk === 'Moderate' ? '🟡' : '🟢'}</span>
                          {add.name}
                        </p>
                        <p className="text-[11px] opacity-80 mt-0.5">{add.note}</p>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/80 border shrink-0">
                        {add.risk} Risk
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Smart Swap Recommendation (If applicable) */}
              {activeItem.swap && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-full">
                      ✨ Clean Swap Recommended
                    </span>
                    <span className="text-xs font-bold text-emerald-700">
                      +{activeItem.swap.pointsDiff} pts Healthier!
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2.5">
                      <span className="text-3xl">{activeItem.swap.emoji}</span>
                      <div>
                        <p className="text-sm font-bold text-emerald-950">{activeItem.swap.name}</p>
                        <p className="text-xs text-emerald-700">{activeItem.swap.reason}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xl font-black text-emerald-700 font-serif">
                        {activeItem.swap.score}/100
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 🥑 BENTO FEATURES GRID */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
            The CleanBite Advantage
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-serif text-emerald-950 tracking-tight">
            Built for total grocery transparency.
          </h2>
          <p className="text-base text-emerald-900/70">
            Big food corporations rely on confusing fine print. CleanBite turns the lights on.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Additive Radar */}
          <div className="p-8 rounded-3xl bg-white border border-emerald-900/10 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-2xl">
              🔬
            </div>
            <h3 className="text-xl font-bold font-serif text-emerald-950">Deep Additive Radar</h3>
            <p className="text-sm text-emerald-900/70 leading-relaxed">
              We track over 1,400 food additives, petroleum dyes, microplastics, and endocrine disruptors. Each flag is linked to independent peer-reviewed toxicology papers.
            </p>
          </div>

          {/* Card 2: Clean Swaps */}
          <div className="p-8 rounded-3xl bg-white border border-emerald-900/10 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl">
              🔄
            </div>
            <h3 className="text-xl font-bold font-serif text-emerald-950">Smart Clean Swaps</h3>
            <p className="text-sm text-emerald-900/70 leading-relaxed">
              We never just tell you a food is bad and leave you hanging. CleanBite instantly suggests 3 clean alternatives sitting right on the same grocery shelf.
            </p>
          </div>

          {/* Card 3: 100% Independent */}
          <div className="p-8 rounded-3xl bg-white border border-emerald-900/10 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl">
              🛡️
            </div>
            <h3 className="text-xl font-bold font-serif text-emerald-950">Zero Brand Bribes</h3>
            <p className="text-sm text-emerald-900/70 leading-relaxed">
              0 brand sponsorships. 0 paid product placements. No food manufacturer can buy their way to a higher score. Our revenue comes 100% from user subscriptions.
            </p>
          </div>

          {/* Card 4: Sub-200ms Camera */}
          <div className="p-8 rounded-3xl bg-white border border-emerald-900/10 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center text-2xl">
              ⚡
            </div>
            <h3 className="text-xl font-bold font-serif text-emerald-950">Sub-200ms Instant Scan</h3>
            <p className="text-sm text-emerald-900/70 leading-relaxed">
              Scan entire grocery carts in seconds. Supports offline mode so you can scan even in basement supermarkets with zero cell reception.
            </p>
          </div>

          {/* Card 5: Bio-Filters */}
          <div className="p-8 rounded-3xl bg-white border border-emerald-900/10 shadow-sm hover:shadow-md transition-all space-y-4 md:col-span-2 bg-gradient-to-br from-emerald-50 to-white">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl">
              🎯
            </div>
            <h3 className="text-xl font-bold font-serif text-emerald-950">Custom Bio & Allergy Filters</h3>
            <p className="text-sm text-emerald-900/70 leading-relaxed">
              Customize your personal blacklist: Seed Oil Free, Gluten Free, Keto, Vegan, No Artificial Sweeteners, or Low FODMAP. CleanBite alerts you the moment a prohibited ingredient appears.
            </p>
          </div>
        </div>
      </section>

      {/* 📋 HOW IT WORKS (3 SIMPLE STEPS) */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
            Effortless 3-Step Flow
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-serif text-emerald-950">
            How CleanBite works in your pocket
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-3 p-6 rounded-2xl bg-white border border-emerald-900/5">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-800 text-xl font-black flex items-center justify-center font-serif">
              1
            </div>
            <h4 className="text-lg font-bold text-emerald-950">Point & Scan</h4>
            <p className="text-xs text-emerald-900/70 leading-relaxed">
              Open the camera and aim at any product barcode or nutrition facts panel. No buttons required.
            </p>
          </div>

          <div className="text-center space-y-3 p-6 rounded-2xl bg-white border border-emerald-900/5">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-800 text-xl font-black flex items-center justify-center font-serif">
              2
            </div>
            <h4 className="text-lg font-bold text-emerald-950">Read the 0–100 Score</h4>
            <p className="text-xs text-emerald-900/70 leading-relaxed">
              Get an instant color-coded rating and plain-English explanations of any dangerous additives.
            </p>
          </div>

          <div className="text-center space-y-3 p-6 rounded-2xl bg-white border border-emerald-900/5">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-800 text-xl font-black flex items-center justify-center font-serif">
              3
            </div>
            <h4 className="text-lg font-bold text-emerald-950">Grab the Clean Swap</h4>
            <p className="text-xs text-emerald-900/70 leading-relaxed">
              Pick the recommended cleaner brand and walk out of the grocery store feeling proud and energized.
            </p>
          </div>
        </div>
      </section>

      {/* 💳 PRICING MATRIX (STRIPE CONNECTED) */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-serif text-emerald-950">
            Invest in your long-term health
          </h2>
          <p className="text-sm text-emerald-900/70">
            Start for free. Upgrade to unlock unlimited offline scans and custom bio-filters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Tier 1: Free */}
          <div className="p-8 rounded-3xl bg-white border border-emerald-900/10 space-y-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold font-serif text-emerald-950">Free Explorer</h3>
                <p className="text-xs text-emerald-900/60 mt-1">For casual weekly grocery trips.</p>
              </div>
              <div className="text-4xl font-black font-serif text-emerald-950">
                $0<span className="text-sm font-normal text-zinc-400">/forever</span>
              </div>
              <ul className="space-y-2.5 text-xs text-emerald-950">
                <li className="flex items-center gap-2">✓ 50 barcode scans / month</li>
                <li className="flex items-center gap-2">✓ 0–100 Health Score calculation</li>
                <li className="flex items-center gap-2">✓ Top 5 additive alerts</li>
                <li className="flex items-center gap-2 text-zinc-400">✗ Offline scanning</li>
                <li className="flex items-center gap-2 text-zinc-400">✗ Custom seed oil / allergen filters</li>
              </ul>
            </div>
            <button className="w-full py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-emerald-950 font-bold text-xs transition-colors">
              Get Started Free
            </button>
          </div>

          {/* Tier 2: Pro Foodie (Featured) */}
          <div className="p-8 rounded-3xl bg-emerald-900 text-white border-2 border-amber-400 space-y-6 flex flex-col justify-between shadow-2xl relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-emerald-950 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
              Most Popular
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold font-serif text-white">Pro Foodie</h3>
                <p className="text-xs text-emerald-200 mt-1">Complete protection for health enthusiasts.</p>
              </div>
              <div className="text-4xl font-black font-serif text-white">
                $4.99<span className="text-sm font-normal text-emerald-300">/month</span>
              </div>
              <p className="text-[11px] text-amber-300 font-semibold">Or $39/year (Save 35%)</p>
              <ul className="space-y-2.5 text-xs text-emerald-100">
                <li className="flex items-center gap-2">✓ <strong>Unlimited</strong> real-time camera scans</li>
                <li className="flex items-center gap-2">✓ <strong>Offline mode</strong> (scan in basement stores)</li>
                <li className="flex items-center gap-2">✓ Full 1,400+ chemical & dye radar</li>
                <li className="flex items-center gap-2">✓ Custom seed oil, gluten, and keto filters</li>
                <li className="flex items-center gap-2">✓ Instant clean swap recommendations</li>
              </ul>
            </div>
            <button className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]">
              Upgrade to Pro (7-Day Free Trial)
            </button>
          </div>

          {/* Tier 3: Family */}
          <div className="p-8 rounded-3xl bg-white border border-emerald-900/10 space-y-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold font-serif text-emerald-950">Family Kitchen</h3>
                <p className="text-xs text-emerald-900/60 mt-1">Shared nutrition for the whole household.</p>
              </div>
              <div className="text-4xl font-black font-serif text-emerald-950">
                $9.99<span className="text-sm font-normal text-zinc-400">/month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-emerald-950">
                <li className="flex items-center gap-2">✓ <strong>5 family accounts</strong> included</li>
                <li className="flex items-center gap-2">✓ Shared pantry health analysis</li>
                <li className="flex items-center gap-2">✓ Automated clean shopping lists</li>
                <li className="flex items-center gap-2">✓ All Pro Foodie features included</li>
              </ul>
            </div>
            <button className="w-full py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-emerald-950 font-bold text-xs transition-colors">
              Start Family Plan
            </button>
          </div>
        </div>
      </section>

      {/* ❓ FAQ SECTION */}
      <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-black font-serif text-emerald-950">Frequently Asked Questions</h2>
          <p className="text-sm text-emerald-900/70">Everything you need to know about our scoring methodology.</p>
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-emerald-900/10 space-y-2">
            <h4 className="font-bold text-sm text-emerald-950">How is the 0–100 health score calculated?</h4>
            <p className="text-xs text-emerald-900/70 leading-relaxed">
              Our algorithm assesses 3 core pillars: <strong>Nutritional Quality (60%)</strong> (sugar, saturated fats, fiber, protein), <strong>Hazardous Additives (30%)</strong> (presence of artificial colors, preservatives, endocrine disruptors), and <strong>Organic / Bio Certification (10%)</strong>.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-emerald-900/10 space-y-2">
            <h4 className="font-bold text-sm text-emerald-950">Can food manufacturers pay to improve their rating?</h4>
            <p className="text-xs text-emerald-900/70 leading-relaxed">
              <strong>Never.</strong> CleanBite operates on a strict 100% independent model. We do not accept brand sponsorships, advertising dollars, or manufacturer compensation of any kind.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-emerald-900/10 space-y-2">
            <h4 className="font-bold text-sm text-emerald-950">Does scanning work offline in supermarkets?</h4>
            <p className="text-xs text-emerald-900/70 leading-relaxed">
              Yes! Pro users can download the offline database (compressed 45MB package) allowing instant barcode decoding even in basement supermarket aisles with zero mobile signal.
            </p>
          </div>
        </div>
      </section>

      {/* 🥑 PLAYFUL FOOTER */}
      <footer className="bg-emerald-950 text-emerald-200/80 py-12 px-4 sm:px-6 lg:px-8 border-t border-emerald-900">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-xl">🥑</span>
            <span className="font-black text-white font-serif text-base">CleanBite</span>
            <span className="text-emerald-400">© 2026 Parabox Incubator. 100% Independent.</span>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <a href="#demo" className="hover:text-white transition-colors">Scanner</a>
            <a href="#features" className="hover:text-white transition-colors">Additive Radar</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#" className="hover:text-white transition-colors">Scientific Methodology</a>
            <a href="#" className="hover:text-white transition-colors">Privacy & Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
