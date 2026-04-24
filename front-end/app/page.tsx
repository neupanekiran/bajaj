'use client';

import { useState, useRef } from 'react';
import axios from 'axios';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import dynamic from 'next/dynamic';

// Dynamically import TreeGraph to avoid SSR issues with ReactFlow
const TreeGraph = dynamic(() => import('@/component/TreeGraph'), { ssr: false });

// ─── Types ─────────────────────────────────────────────────
interface Hierarchy {
  root: string;
  tree: Record<string, unknown>;
  depth?: number;
  has_cycle?: boolean;
}

interface ApiResponse {
  user_id: string;
  email_id: string;
  college_roll_number: string;
  hierarchies: Hierarchy[];
  invalid_entries: string[];
  duplicate_edges: string[];
  summary: {
    total_trees: number;
    total_cycles: number;
    largest_tree_root: string;
  };
}

export default function Home() {
  const [input, setInput] = useState('A->B, A->C, B->D, C->E\\nE->F, X->Y, Y->Z\\nZ->X, G->H, G->H');
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (response && resultRef.current) {
      const cards = resultRef.current.querySelectorAll('.result-card');
      gsap.fromTo(cards,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, { scope: resultRef, dependencies: [response] });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    const dataArray = input.split(/[\\n,]/).map(s => s.trim()).filter(Boolean);

    try {
      const res = await axios.post('https://kiranprasadneupane-bfhl.vercel.app/bfhl', { data: dataArray });
      setResponse(res.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Failed to connect to the server.');
      } else {
        setError('Unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen text-white bg-[#09090b] selection:bg-[#c84b45] selection:text-white pb-24" ref={containerRef}>
      
      {/* ── HEADER ────────────────────────────────────── */}
      <header className="px-6 py-6 border-b border-[#2a2a2f] flex items-center gap-3">
        {/* Pixel logo icon */}
        <div className="flex flex-col gap-[2px]">
          <div className="flex gap-[2px]">
            <div className="w-[4px] h-[4px] bg-white rounded-full"></div>
            <div className="w-[4px] h-[4px] bg-transparent"></div>
            <div className="w-[4px] h-[4px] bg-white rounded-full"></div>
          </div>
          <div className="flex gap-[2px]">
            <div className="w-[4px] h-[4px] bg-white rounded-full"></div>
            <div className="w-[4px] h-[4px] bg-[#c84b45] rounded-full"></div>
            <div className="w-[4px] h-[4px] bg-white rounded-full"></div>
          </div>
        </div>
        <span className="pixel-logo text-xs md:text-sm tracking-widest">Graph.sys</span>
      </header>

      {/* ── HERO SECTION ─────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <span className="inline-block mono-heading text-[#c84b45] font-bold text-sm tracking-widest uppercase mb-6">
          Graph Analyzer
        </span>
        
        <h1 className="mono-heading text-5xl md:text-7xl font-bold tracking-tight mb-8 text-[#f4f4f5]">
          Welcome to <br /> Graph.sys
        </h1>
        
        <p className="mono-heading text-[#a1a1aa] text-lg md:text-xl max-w-2xl mx-auto mb-16 leading-relaxed">
          Easy, plug-and-play directed graph engine where you can visualize your own hierarchies and detect cycles.
        </p>

        {/* ── INPUT FORM ────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
          <div className="relative group">
            {/* Subtle glow behind input */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#c84b45]/20 to-[#c84b45]/0 rounded-[24px] blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
            <div className="relative bg-[#151518] rounded-[24px] p-6 border border-[#2a2a2f] group-focus-within:border-[#c84b45]/50 transition-colors">
               <div className="flex items-center justify-between mb-4">
                 <label htmlFor="graph-input" className="mono-heading text-[#a1a1aa] text-sm">Design your graph edges</label>
                 <span className="text-[#52525b] text-xs mono-heading">// comma or newline separated</span>
               </div>
               <textarea
                id="graph-input"
                className="w-full bg-transparent text-[#e4e4e7] p-2 placeholder-[#52525b] focus:outline-none resize-y min-h-[120px] text-lg leading-relaxed mono-heading"
                placeholder="A->B, B->C..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                spellCheck={false}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#c84b45] hover:bg-[#b5403a] text-white mono-heading font-bold text-lg px-12 py-5 rounded-full transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_40px_rgba(200,75,69,0.2)] hover:shadow-[0_0_60px_rgba(200,75,69,0.3)]"
          >
            {loading ? 'Processing...' : 'Run Analysis'}
          </button>
        </form>
      </section>

      {/* ── RESULTS ───────────────────────────────────── */}
      {error && (
        <div className="max-w-3xl mx-auto px-6 mb-12">
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-6 mono-heading text-center">
            {error}
          </div>
        </div>
      )}

      {response && (
        <section ref={resultRef} className="max-w-5xl mx-auto px-6 space-y-8">
          
          <div className="flex items-center justify-center gap-4 mb-12">
             <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#c84b45]/50"></div>
             <span className="mono-heading text-[#c84b45] text-sm tracking-widest font-bold">ANALYSIS COMPLETE</span>
             <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#c84b45]/50"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* User Identity Card */}
            <div className="result-card bg-[#151518] rounded-[32px] p-8 border border-[#2a2a2f] hover:border-[#c84b45]/30 transition-colors">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-10 h-10 rounded-2xl bg-[#c84b45]/10 flex items-center justify-center text-[#c84b45]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                 </div>
                 <h3 className="mono-heading text-xl font-bold">User Identity</h3>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-center border-b border-[#2a2a2f] pb-4">
                   <span className="text-[#a1a1aa] mono-heading text-sm">USER_ID</span>
                   <span className="text-white font-medium">{response.user_id}</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-[#2a2a2f] pb-4">
                   <span className="text-[#a1a1aa] mono-heading text-sm">EMAIL</span>
                   <span className="text-white font-medium">{response.email_id}</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-[#a1a1aa] mono-heading text-sm">ROLL_NO</span>
                   <span className="text-white font-medium">{response.college_roll_number}</span>
                 </div>
              </div>
            </div>

            {/* Graph Stats Card */}
            <div className="result-card bg-[#151518] rounded-[32px] p-8 border border-[#2a2a2f] hover:border-[#c84b45]/30 transition-colors">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-10 h-10 rounded-2xl bg-[#c84b45]/10 flex items-center justify-center text-[#c84b45]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                 </div>
                 <h3 className="mono-heading text-xl font-bold">Graph Stats</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#09090b] rounded-2xl p-4 text-center border border-[#2a2a2f]">
                  <div className="text-3xl font-bold mono-heading mb-1 text-white">{response.summary.total_trees}</div>
                  <div className="text-xs text-[#a1a1aa] mono-heading uppercase tracking-wider">Trees</div>
                </div>
                <div className="bg-[#09090b] rounded-2xl p-4 text-center border border-[#2a2a2f]">
                  <div className="text-3xl font-bold mono-heading mb-1 text-white">{response.summary.total_cycles}</div>
                  <div className="text-xs text-[#a1a1aa] mono-heading uppercase tracking-wider">Cycles</div>
                </div>
                <div className="bg-[#09090b] rounded-2xl p-4 text-center border border-[#2a2a2f]">
                  <div className="text-3xl font-bold mono-heading mb-1 text-[#c84b45]">{response.summary.largest_tree_root || '—'}</div>
                  <div className="text-xs text-[#a1a1aa] mono-heading uppercase tracking-wider text-nowrap hidden md:block">Max Root</div>
                  <div className="text-xs text-[#a1a1aa] mono-heading uppercase tracking-wider block md:hidden">Root</div>
                </div>
              </div>
            </div>
          </div>

          {/* Invalid & Duplicate Info */}
          {(response.invalid_entries.length > 0 || response.duplicate_edges.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {response.invalid_entries.length > 0 && (
                 <div className="result-card bg-[#151518] rounded-[24px] p-6 border border-[#2a2a2f]">
                    <div className="text-[#a1a1aa] mono-heading text-xs uppercase tracking-widest mb-4">Invalid Entries</div>
                    <div className="flex flex-wrap gap-2">
                      {response.invalid_entries.map((item, i) => (
                        <span key={i} className="bg-[#2a2a2f] text-white px-3 py-1 rounded-full text-sm font-medium">{item}</span>
                      ))}
                    </div>
                 </div>
              )}
              {response.duplicate_edges.length > 0 && (
                 <div className="result-card bg-[#151518] rounded-[24px] p-6 border border-[#2a2a2f]">
                    <div className="text-[#a1a1aa] mono-heading text-xs uppercase tracking-widest mb-4">Duplicate Edges</div>
                    <div className="flex flex-wrap gap-2">
                       {response.duplicate_edges.map((item, i) => (
                         <span key={i} className="bg-[#09090b] border border-[#2a2a2f] text-[#c84b45] px-3 py-1 rounded-full text-sm font-medium mono-heading">{item}</span>
                       ))}
                    </div>
                 </div>
              )}
            </div>
          )}

          {/* Hierarchies visualizer */}
          <div className="py-12">
             <h3 className="mono-heading text-2xl font-bold mb-8 text-center">Visualizations</h3>
             <div className="space-y-12">
               {response.hierarchies.map((h, i) => (
                 <div key={i} className="result-card bg-[#151518] rounded-[32px] overflow-hidden border border-[#2a2a2f] hover:border-[#c84b45]/30 transition-colors shadow-2xl">
                    <div className="p-6 border-b border-[#2a2a2f] flex justify-between items-center bg-[#1a1a20]">
                       <div className="flex items-center gap-4">
                         <span className="bg-[#09090b] text-[#c84b45] mono-heading text-sm px-3 py-1 rounded-lg border border-[#2a2a2f] font-bold">#{i + 1}</span>
                         <h4 className="mono-heading text-xl font-bold">Root: {h.root}</h4>
                       </div>
                       <div>
                         {h.has_cycle ? (
                           <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-1.5 rounded-full text-sm font-bold mono-heading">CYCLE</span>
                         ) : (
                           <span className="bg-white/5 text-white border border-white/10 px-4 py-1.5 rounded-full text-sm font-medium mono-heading">Depth: {h.depth}</span>
                         )}
                       </div>
                    </div>
                    <div className="h-[400px] w-full bg-[#09090b]">
                       <TreeGraph hierarchy={h} />
                    </div>
                 </div>
               ))}
             </div>
          </div>
        </section>
      )}

    </main>
  );
}
