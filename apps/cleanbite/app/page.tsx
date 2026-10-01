'use client';

/* Hallmark · macrostructure: split-studio · theme: hum · pre-emit critique: P5 H5 E5 S5 R5 V5 */

import React, { useState } from 'react';

interface FoodSpecimen {
  id: string;
  name: string;
  brandType: 'Ultra-Processed Brand' | 'Clean Whole Brand';
  upc: string;
  score: number;
  grade: 'Bad' | 'Poor' | 'Good' | 'Optimal';
  gradeColor: string;
  gradeBg: string;
  nutrition: {
    sugarGrams: number;
    sugarPct: string;
    satFatGrams: number;
    sodiumMg: number;
    fiberGrams: number;
    proteinGrams: number;
  };
  flaggedAdditives: {
    code: string;
    name: string;
    category: string;
    toxicityLevel: 'High' | 'Moderate' | 'Low';
    mechanism: string;
    regulatoryStatus: string;
  }[];
  swapAlternative?: {
    name: string;
    brand: string;
    score: number;
    scoreDelta: number;
    whyBetter: string[];
  };
}

const SPECIMENS: FoodSpecimen[] = [
  {
    id: 'cereal',
    name: 'Frosted Rainbow Marshmallow Puffs',
    brandType: 'Ultra-Processed Brand',
    upc: '0 38000 19820 4',
    score: 14,
    grade: 'Bad',
    gradeColor: '#B91C1C',
    gradeBg: '#FEF2F2',
    nutrition: {
      sugarGrams: 36,
      sugarPct: '72% of daily limit',
      satFatGrams: 4.5,
      sodiumMg: 420,
      fiberGrams: 0.5,
      proteinGrams: 1.0,
    },
    flaggedAdditives: [
      {
        code: 'E129 / Red 40',
        name: 'Allura Red AC',
        category: 'Petroleum Dye',
        toxicityLevel: 'High',
        mechanism: 'Binds with zinc ions in gut epithelium; correlated with neurobehavioral hyperactivity in adolescent cohorts.',
        regulatoryStatus: 'Requires warning label in EU; unrestricted in US.',
      },
      {
        code: 'E321',
        name: 'Butylated Hydroxytoluene (BHT)',
        category: 'Synthetic Preservative',
        toxicityLevel: 'High',
        mechanism: 'Endocrine disruptor showing thyroid and hepatic enzyme alteration in longitudinal rodent bioassays.',
        regulatoryStatus: 'Banned in infant foods; flagged by EFSA.',
      },
      {
        code: 'INS 955',
        name: 'Sucralose & HFCS Blend',
        category: 'Refined Sweetener',
        toxicityLevel: 'Moderate',
        mechanism: 'Alters gut microbiome biodiversity by depleting beneficial Bifidobacteria and Akkermansia muciniphila.',
        regulatoryStatus: 'GRAS under 1958 standard; under re-evaluation.',
      },
    ],
    swapAlternative: {
      name: 'Organic Sprouted Ancient Grain & Berry Crunch',
      brand: 'One Degree Organic',
      score: 91,
      scoreDelta: 77,
      whyBetter: [
        'Sweetened purely with whole dates & freeze-dried raspberries (6g sugar)',
        '0 synthetic petroleum dyes or chemical preservatives',
        '7g prebiotic fiber supporting microbiome diversity',
      ],
    },
  },
  {
    id: 'soda',
    name: 'Electric Citrus Energy Elixir',
    brandType: 'Ultra-Processed Brand',
    upc: '0 49000 03810 1',
    score: 22,
    grade: 'Bad',
    gradeColor: '#B91C1C',
    gradeBg: '#FEF2F2',
    nutrition: {
      sugarGrams: 48,
      sugarPct: '96% of daily limit',
      satFatGrams: 0,
      sodiumMg: 110,
      fiberGrams: 0,
      proteinGrams: 0,
    },
    flaggedAdditives: [
      {
        code: 'E211',
        name: 'Sodium Benzoate',
        category: 'Antimicrobial Preservative',
        toxicityLevel: 'High',
        mechanism: 'When combined with ascorbic acid (Vit C) in acidic liquid, catalyzes into benzene, a known Class 1 human carcinogen.',
        regulatoryStatus: 'Strict threshold limits; phased out by premium clean brands.',
      },
      {
        code: 'E102 / Yellow 5',
        name: 'Tartrazine',
        category: 'Synthetic Azo Dye',
        toxicityLevel: 'High',
        mechanism: 'Induces oxidative stress and cellular inflammation in intestinal barrier tissues.',
        regulatoryStatus: 'Requires statutory EU label: "May have an adverse effect on activity and attention in children."',
      },
    ],
    swapAlternative: {
      name: 'Cold-Pressed Yuzu & Ginger Botanical Tonic',
      brand: 'Sound Botanicals',
      score: 95,
      scoreDelta: 73,
      whyBetter: [
        'Brewed with organic white tea & sparkling spring water (0g sugar)',
        '0 artificial colorants, synthetic sweeteners, or sodium benzoate',
        'Natural adaptogens with organic ginger extract',
      ],
    },
  },
  {
    id: 'peanut-butter',
    name: 'Commercial Extra-Creamy Spread',
    brandType: 'Ultra-Processed Brand',
    upc: '0 51500 24177 3',
    score: 39,
    grade: 'Poor',
    gradeColor: '#D97706',
    gradeBg: '#FFFBEB',
    nutrition: {
      sugarGrams: 7,
      sugarPct: '14% of daily limit',
      satFatGrams: 6.0,
      sodiumMg: 180,
      fiberGrams: 2.0,
      proteinGrams: 6.0,
    },
    flaggedAdditives: [
      {
        code: 'GRAS-OIL',
        name: 'Fully Hydrogenated Soybean & Rapeseed Oil',
        category: 'Industrial Hardened Fat',
        toxicityLevel: 'High',
        mechanism: 'Industrial interesterification alters fatty acid stereochemistry, elevating systemic vascular inflammation markers (CRP).',
        regulatoryStatus: 'Permitted as texture stabilizer; avoids trans-fat disclosure under 0.5g rounding loophole.',
      },
      {
        code: 'E471',
        name: 'Mono- and Diglycerides of Fatty Acids',
        category: 'Synthetic Emulsifier',
        toxicityLevel: 'Moderate',
        mechanism: 'Detergent-like action degrades the protective intestinal mucus layer, facilitating bacterial translocation.',
        regulatoryStatus: 'Currently under review by European Food Safety Authority (EFSA).',
      },
    ],
    swapAlternative: {
      name: 'Organic Single-Origin Valencia Peanut Butter',
      brand: 'Santa Cruz Organic',
      score: 94,
      scoreDelta: 55,
      whyBetter: [
        '100% dry-roasted organic Valencia peanuts + pinch of sea salt',
        '0 industrial hydrogenated seed oils or chemical emulsifiers',
        'Natural oil separation indicating zero synthetic texturizers',
      ],
    },
  },
];

export default function CleanBiteCraftPage() {
  const [activeSpecimen, setActiveSpecimen] = useState<FoodSpecimen>(SPECIMENS[0]);
  const [selectedAdditive, setSelectedAdditive] = useState<number | null>(0);
  const [isSimulatingScan, setIsSimulatingScan] = useState(false);

  const handleSelect = (spec: FoodSpecimen) => {
    setIsSimulatingScan(true);
    setTimeout(() => {
      setActiveSpecimen(spec);
      setSelectedAdditive(0);
      setIsSimulatingScan(false);
    }, 280);
  };

  return (
    <div className="min-h-screen text-[#18221B] selection:bg-[#E7F3EC] selection:text-[#1E6B47] flex flex-col">
      
      {/* 🧭 N5 FLOATING FROSTED PILL NAVIGATION */}
      <div className="sticky top-4 z-50 px-4 max-w-5xl mx-auto w-full">
        <header className="bg-white/85 backdrop-blur-md border border-[rgba(24,34,27,0.12)] rounded-full px-5 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🥑</span>
            <div className="flex items-center gap-2">
              <span className="font-serif font-black tracking-tight text-lg text-[#18221B]">CleanBite</span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#E7F3EC] text-[#1E6B47] font-bold border border-[#1E6B47]/20">
                100% Unbiased
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#4A574E]">
            <a href="#studio" className="hover:text-[#18221B] transition-colors">Interactive Scanner</a>
            <a href="#methodology" className="hover:text-[#18221B] transition-colors">Chemical Radar</a>
            <a href="#independence" className="hover:text-[#18221B] transition-colors">Trust Manifesto</a>
            <a href="#pricing" className="hover:text-[#18221B] transition-colors">Subscriptions</a>
          </nav>

          <a
            href="#studio"
            className="text-xs font-bold px-4 py-2 rounded-full bg-[#18221B] text-white hover:bg-[#1E6B47] transition-all shadow-sm"
          >
            Launch Web Scanner
          </a>
        </header>
      </div>

      {/* 🏛️ MACROSTRUCTURE 15: SPLIT STUDIO HERO DIPTYCH */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 space-y-24">
        
        {/* HERO DIPTYCH ROW */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pt-4">
          
          {/* LEFT: EDITORIAL NARRATIVE & PROBLEM DISCLOSURE */}
          <div className="lg:col-span-5 space-y-6 pt-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0ECE1] border border-[rgba(24,34,27,0.12)] text-[11px] font-mono font-medium text-[#4A574E]">
              <span className="w-2 h-2 rounded-full bg-[#1E6B47]" />
              TOXICOLOGY & INGREDIENT INTELLIGENCE
            </div>

            <h1 className="text-4xl sm:text-5xl font-serif font-black tracking-tight text-[#18221B] leading-[1.08]">
              Your grocery cart is filled with corporate fine print.
            </h1>

            <p className="text-base text-[#4A574E] leading-relaxed font-normal">
              Food conglomerates spend billions reformulating ultra-processed foods to hide industrial emulsifiers, neurotoxic dyes, and endocrine disruptors behind clean-label buzzwords.
            </p>

            <div className="p-4 rounded-2xl bg-white border border-[rgba(24,34,27,0.12)] space-y-2.5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#7A8A7F] font-mono">The CleanBite Promise</p>
              <p className="text-xs text-[#18221B] leading-relaxed">
                CleanBite runs every UPC barcode against independent peer-reviewed toxicology databases (EFSA, WHO, IARC). <strong>Zero brand sponsors. Zero paid endorsements. 100% scientific objectivity.</strong>
              </p>
            </div>

            {/* Specimen Switcher Buttons */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-mono font-semibold text-[#7A8A7F] uppercase tracking-wider">
                Select a grocery item to dissect:
              </p>
              <div className="grid grid-cols-3 gap-2">
                {SPECIMENS.map((spec) => {
                  const isSelected = spec.id === activeSpecimen.id;
                  return (
                    <button
                      key={spec.id}
                      onClick={() => handleSelect(spec)}
                      className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                        isSelected
                          ? 'bg-white border-[#18221B] shadow-sm ring-2 ring-[#18221B]/10 font-bold'
                          : 'bg-[#F0ECE1]/60 border-transparent hover:bg-white text-[#4A574E]'
                      }`}
                    >
                      <span className="block truncate">{spec.name.split(' ')[0]} {spec.name.split(' ')[1]}</span>
                      <span className="block text-[10px] text-[#7A8A7F] font-mono font-normal">Score: {spec.score}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: THE LIVE INGREDIENT LABORATORY (RECEIPT CARD + CHEMICAL MEMO) */}
          <div id="studio" className="lg:col-span-7 space-y-4">
            
            {/* TACTILE RECEIPT CARD */}
            <div className="receipt-serrated p-6 sm:p-8 rounded-2xl space-y-6">
              
              {/* Receipt Header */}
              <div className="flex items-start justify-between border-b border-dashed border-[rgba(24,34,27,0.15)] pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="ink-stamp px-2 py-0.5 text-[10px] font-bold rounded">
                      LAB DISSECTION SLIP
                    </span>
                    <span className="text-[11px] font-mono text-[#7A8A7F]">UPC: {activeSpecimen.upc}</span>
                  </div>
                  <h3 className="text-2xl font-serif font-black mt-2 text-[#18221B]">
                    {activeSpecimen.name}
                  </h3>
                  <p className="text-xs text-[#7A8A7F]">{activeSpecimen.brandType}</p>
                </div>

                {/* Score Stamp */}
                <div
                  className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-serif shrink-0 shadow-inner"
                  style={{ backgroundColor: activeSpecimen.gradeBg, color: activeSpecimen.gradeColor }}
                >
                  <span className="text-2xl font-black leading-none">{activeSpecimen.score}</span>
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold">
                    {activeSpecimen.grade}
                  </span>
                </div>
              </div>

              {/* Monospace Nutrition Breakdown Panel */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-[#7A8A7F] border-b border-[rgba(24,34,27,0.08)] pb-1">
                  <span>METABOLIC PROFILE</span>
                  <span>QUANTITY / SERVING</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono pt-1">
                  <div className="p-2 rounded bg-[#FAF8F5] border border-[rgba(24,34,27,0.06)]">
                    <span className="text-[10px] text-[#7A8A7F] block">Added Sugar</span>
                    <span className="font-bold text-[#B91C1C]">{activeSpecimen.nutrition.sugarGrams}g</span>
                    <span className="text-[9px] text-[#7A8A7F] block">{activeSpecimen.nutrition.sugarPct}</span>
                  </div>
                  <div className="p-2 rounded bg-[#FAF8F5] border border-[rgba(24,34,27,0.06)]">
                    <span className="text-[10px] text-[#7A8A7F] block">Saturated Fat</span>
                    <span className="font-bold text-[#B91C1C]">{activeSpecimen.nutrition.satFatGrams}g</span>
                    <span className="text-[9px] text-[#7A8A7F] block">Industrial oils</span>
                  </div>
                  <div className="p-2 rounded bg-[#FAF8F5] border border-[rgba(24,34,27,0.06)]">
                    <span className="text-[10px] text-[#7A8A7F] block">Sodium</span>
                    <span className="font-bold text-[#18221B]">{activeSpecimen.nutrition.sodiumMg}mg</span>
                    <span className="text-[9px] text-[#7A8A7F] block">Refined salt</span>
                  </div>
                  <div className="p-2 rounded bg-[#FAF8F5] border border-[rgba(24,34,27,0.06)]">
                    <span className="text-[10px] text-[#7A8A7F] block">Gut Fiber</span>
                    <span className="font-bold text-[#18221B]">{activeSpecimen.nutrition.fiberGrams}g</span>
                    <span className="text-[9px] text-[#7A8A7F] block">Depleted grain</span>
                  </div>
                </div>
              </div>

              {/* Interactive Flagged Chemical Additives List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-[#7A8A7F]">
                    Detected Chemical Additives ({activeSpecimen.flaggedAdditives.length})
                  </span>
                  <span className="text-[10px] text-[#7A8A7F] font-mono">Click to read toxicology memo</span>
                </div>

                <div className="space-y-2">
                  {activeSpecimen.flaggedAdditives.map((add, idx) => {
                    const isSelected = selectedAdditive === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedAdditive(idx)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#FEF2F2] border-[#B91C1C]/40 ring-1 ring-[#B91C1C]/20'
                            : 'bg-white border-[rgba(24,34,27,0.1)] hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#B91C1C]" />
                            <span className="font-bold font-mono text-[#18221B]">{add.code}</span>
                            <span className="font-semibold text-[#4A574E]">— {add.name}</span>
                          </div>
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white border font-bold text-[#B91C1C]">
                            {add.toxicityLevel} Risk
                          </span>
                        </div>

                        {isSelected && (
                          <div className="mt-2.5 pt-2.5 border-t border-[rgba(185,28,28,0.15)] text-[11px] space-y-1 text-[#7F1D1D]">
                            <p><strong>Mechanism:</strong> {add.mechanism}</p>
                            <p className="text-[10px] font-mono opacity-80"><strong>Regulatory Status:</strong> {add.regulatoryStatus}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SMART CLEAN SWAP RECOMMENDATION */}
              {activeSpecimen.swapAlternative && (
                <div className="p-4 rounded-xl bg-[#E7F3EC] border border-[#1E6B47]/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#1E6B47] tracking-wider bg-white/80 px-2 py-0.5 rounded-full border border-[#1E6B47]/20">
                      ✓ Lab Recommended Clean Swap
                    </span>
                    <span className="text-xs font-mono font-bold text-[#1E6B47]">
                      +{activeSpecimen.swapAlternative.scoreDelta} PTS HEALTHIER
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-base font-serif font-black text-[#18221B]">
                        {activeSpecimen.swapAlternative.name}
                      </h4>
                      <p className="text-xs text-[#4A574E] font-medium">{activeSpecimen.swapAlternative.brand}</p>
                      
                      <ul className="mt-2 space-y-1 text-xs text-[#1E6B47]">
                        {activeSpecimen.swapAlternative.whyBetter.map((point, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-1.5">
                            <span className="text-[10px] font-bold">✓</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="w-14 h-14 rounded-xl bg-[#1E6B47] text-white flex flex-col items-center justify-center font-serif shrink-0">
                      <span className="text-xl font-black">{activeSpecimen.swapAlternative.score}</span>
                      <span className="text-[8px] font-mono tracking-widest uppercase">Optimal</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 🔬 ASYMMETRIC METHODOLOGY & PROOF BENTO */}
        <section id="methodology" className="space-y-8 pt-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-[11px] font-mono uppercase font-bold text-[#1E6B47] bg-[#E7F3EC] px-2.5 py-1 rounded-full border border-[#1E6B47]/20">
              The CleanBite Scoring Algorithm
            </span>
            <h2 className="text-3xl font-serif font-black tracking-tight text-[#18221B]">
              Three strict pillars. Zero marketing fluff.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Pillar 1: Nutritional Balance (60%) */}
            <div className="md:col-span-7 p-6 sm:p-8 rounded-2xl bg-white border border-[rgba(24,34,27,0.12)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#7A8A7F]">PILLAR 01 · 60% WEIGHT</span>
                <span className="text-xs font-mono font-bold text-[#1E6B47]">WHO / Nutri-Score 2026 Model</span>
              </div>
              <h3 className="text-xl font-serif font-black text-[#18221B]">
                Macro-Nutrient Quality Matrix
              </h3>
              <p className="text-xs text-[#4A574E] leading-relaxed">
                Evaluates sugar density, saturated fatty acid ratios, sodium concentrations, dietary fiber, and natural bioavailable protein per 100g. Foods penalized exponentially for free added sugars and chemical preservation oils.
              </p>
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[rgba(24,34,27,0.06)] text-[11px] font-mono text-[#4A574E] space-y-1">
                <p>• Zero credit given for synthetic fortified vitamins in ultra-processed matrices.</p>
                <p>• Heavy deduction for sugar concentrations exceeding 15g per 100g solid food.</p>
              </div>
            </div>

            {/* Pillar 2: Additive Risk (30%) */}
            <div className="md:col-span-5 p-6 sm:p-8 rounded-2xl bg-white border border-[rgba(24,34,27,0.12)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#7A8A7F]">PILLAR 02 · 30% WEIGHT</span>
                <span className="text-xs font-mono font-bold text-[#B91C1C]">1,400+ Chemical Compounds</span>
              </div>
              <h3 className="text-xl font-serif font-black text-[#18221B]">
                Independent Toxicology Radar
              </h3>
              <p className="text-xs text-[#4A574E] leading-relaxed">
                Every additive is cross-referenced against peer-reviewed studies on endocrine disruption, microbiome degradation, mucosal barrier leakage, and genotoxicity.
              </p>
              <div className="text-[11px] font-mono text-[#B91C1C] bg-[#FEF2F2] p-2.5 rounded-lg border border-[#B91C1C]/20">
                Automatic score ceiling of 30/100 if any Class 1 flagged preservative is detected.
              </div>
            </div>

            {/* Pillar 3: Organic & Whole Ingredient Status (10%) */}
            <div className="md:col-span-5 p-6 sm:p-8 rounded-2xl bg-white border border-[rgba(24,34,27,0.12)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#7A8A7F]">PILLAR 03 · 10% WEIGHT</span>
                <span className="text-xs font-mono font-bold text-[#1E6B47]">Agricultural Integrity</span>
              </div>
              <h3 className="text-xl font-serif font-black text-[#18221B]">
                Glyphosate & Pesticide Clearance
              </h3>
              <p className="text-xs text-[#4A574E] leading-relaxed">
                Rewards certified biodynamic and USDA/EU organic production methods that eliminate synthetic agricultural fungicides and desiccant chemicals.
              </p>
            </div>

            {/* Pillar 4: The Independence Pledge */}
            <div id="independence" className="md:col-span-7 p-6 sm:p-8 rounded-2xl bg-[#18221B] text-white space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#E5A93C]">TRUST & INTEGRITY CHARTER</span>
                <span className="text-xs font-mono font-bold text-white/80">100% INDEPENDENT</span>
              </div>
              <h3 className="text-xl font-serif font-black text-white">
                Why food brands cannot buy their way into CleanBite
              </h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Unlike grocery apps funded by CPG conglomerates and targeted ad networks, CleanBite takes zero brand dollars. We do not sell user data, run sponsored banner ads, or accept manufacturer compensation for score adjustments.
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs font-mono text-[#E5A93C]">
                <span>✓ 0 Sponsored Rankings</span>
                <span>✓ 0 Brand Placement Bribes</span>
                <span>✓ 100% Subscriber Funded</span>
              </div>
            </div>
          </div>
        </section>

        {/* 💳 TRANSPARENT SUBSCRIPTIONS */}
        <section id="pricing" className="space-y-8 pt-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[11px] font-mono uppercase font-bold text-[#1E6B47] bg-[#E7F3EC] px-2.5 py-1 rounded-full border border-[#1E6B47]/20">
              Clear & Simple Pricing
            </span>
            <h2 className="text-3xl font-serif font-black tracking-tight text-[#18221B]">
              Support independent food transparency
            </h2>
            <p className="text-xs text-[#4A574E]">
              Zero advertisements. Your subscription directly funds our independent laboratory chemical research.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
            
            {/* Free */}
            <div className="p-6 rounded-2xl bg-white border border-[rgba(24,34,27,0.12)] space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[10px] font-mono uppercase font-bold text-[#7A8A7F]">Tier 01</span>
                <h3 className="text-lg font-serif font-black text-[#18221B]">Free Explorer</h3>
                <div className="text-3xl font-serif font-black text-[#18221B]">$0 <span className="text-xs font-normal font-mono text-[#7A8A7F]">/ mo</span></div>
                <ul className="space-y-2 text-xs text-[#4A574E] pt-2">
                  <li className="flex items-center gap-2">✓ 50 real-time barcode scans / month</li>
                  <li className="flex items-center gap-2">✓ 0–100 CleanBite Score calculations</li>
                  <li className="flex items-center gap-2">✓ Top 5 hazardous additive warnings</li>
                </ul>
              </div>
              <button className="w-full py-2.5 rounded-xl bg-[#FAF8F5] border border-[rgba(24,34,27,0.15)] text-xs font-bold text-[#18221B] hover:bg-white transition-colors">
                Start Free
              </button>
            </div>

            {/* Pro (Highlighted) */}
            <div className="p-6 rounded-2xl bg-white border-2 border-[#18221B] space-y-5 flex flex-col justify-between shadow-xl relative">
              <div className="absolute -top-3 right-6 bg-[#18221B] text-white text-[9px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full">
                Most Popular
              </div>
              <div className="space-y-3">
                <span className="text-[10px] font-mono uppercase font-bold text-[#1E6B47]">Tier 02 · Full Protection</span>
                <h3 className="text-lg font-serif font-black text-[#18221B]">Pro Member</h3>
                <div className="text-3xl font-serif font-black text-[#18221B]">$4.99 <span className="text-xs font-normal font-mono text-[#7A8A7F]">/ mo</span></div>
                <p className="text-[10px] font-mono text-[#1E6B47] font-bold">Or $39 billed annually (Save 35%)</p>
                <ul className="space-y-2 text-xs text-[#18221B] pt-2">
                  <li className="flex items-center gap-2">✓ <strong>Unlimited</strong> real-time camera scans</li>
                  <li className="flex items-center gap-2">✓ <strong>Offline Database Mode</strong> (basement markets)</li>
                  <li className="flex items-center gap-2">✓ Full 1,400+ chemical & dye radar</li>
                  <li className="flex items-center gap-2">✓ Custom seed oil, gluten & allergen filters</li>
                  <li className="flex items-center gap-2">✓ Instant verified clean swaps</li>
                </ul>
              </div>
              <button className="w-full py-2.5 rounded-xl bg-[#18221B] text-white text-xs font-bold hover:bg-[#1E6B47] transition-all shadow-sm">
                Start 7-Day Free Trial
              </button>
            </div>

            {/* Family */}
            <div className="p-6 rounded-2xl bg-white border border-[rgba(24,34,27,0.12)] space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[10px] font-mono uppercase font-bold text-[#7A8A7F]">Tier 03</span>
                <h3 className="text-lg font-serif font-black text-[#18221B]">Household Pantry</h3>
                <div className="text-3xl font-serif font-black text-[#18221B]">$9.99 <span className="text-xs font-normal font-mono text-[#7A8A7F]">/ mo</span></div>
                <ul className="space-y-2 text-xs text-[#4A574E] pt-2">
                  <li className="flex items-center gap-2">✓ <strong>5 separate family seats</strong></li>
                  <li className="flex items-center gap-2">✓ Shared household pantry audit</li>
                  <li className="flex items-center gap-2">✓ Automated clean shopping lists</li>
                  <li className="flex items-center gap-2">✓ All Pro Member features included</li>
                </ul>
              </div>
              <button className="w-full py-2.5 rounded-xl bg-[#FAF8F5] border border-[rgba(24,34,27,0.15)] text-xs font-bold text-[#18221B] hover:bg-white transition-colors">
                Start Household Plan
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 🏛️ FT4 DENSE COLOPHON FOOTER */}
      <footer className="border-t border-[rgba(24,34,27,0.12)] bg-[#F0ECE1] py-12 px-4 sm:px-6 lg:px-8 text-xs text-[#4A574E]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🥑</span>
              <span className="font-serif font-black text-base text-[#18221B]">CleanBite Colophon</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#7A8A7F] max-w-sm">
              CleanBite is an independent consumer nutrition intelligence project. We analyze food and cosmetic ingredients strictly against published toxicology scientific literature (EFSA, WHO, IARC, PubMed).
            </p>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 font-mono text-[11px]">
            <div className="space-y-1.5">
              <p className="font-bold text-[#18221B] uppercase">Databases</p>
              <p>WHO IARC Monographs</p>
              <p>EFSA Food Additive DB</p>
              <p>OpenFoodFacts API</p>
              <p>PubMed Toxicology</p>
            </div>
            <div className="space-y-1.5">
              <p className="font-bold text-[#18221B] uppercase">Standards</p>
              <p>Nutri-Score 2026</p>
              <p>NOVA Processing Levels</p>
              <p>Zero Brand Bribes</p>
              <p>Independent Audit</p>
            </div>
            <div className="space-y-1.5">
              <p className="font-bold text-[#18221B] uppercase">Incubator</p>
              <p>Parabox.so</p>
              <p>Hallmark Craft Engine</p>
              <p>Privacy & Terms</p>
              <p>© 2026 CleanBite</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
