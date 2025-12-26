'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useScroll, useTransform } from 'framer-motion';
import { Github, Mail, ArrowRight, Award, BookOpen, Briefcase, Building2, Code2, Cpu, GraduationCap, Network, RotateCcw, ShieldCheck, School, Wrench, X, CheckCircle2, XCircle, ChevronDown, Smartphone, Monitor } from 'lucide-react';
import Image from 'next/image';
import TurnstileWidget from './TurnstileWidget';

type TTT = 'X' | 'O' | null;

// Bump this when you replace images in `public/assets/images/*` and want the site
// to fetch the new bytes immediately (avoids Next/Image + browser caching).
const ASSET_REV = '1';

function LinkedInMark({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M20.447 20.452H17.21v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.0V9h3.112v1.561h.045c.434-.823 1.494-1.69 3.074-1.69 3.29 0 3.898 2.166 3.898 4.982v6.599zM5.337 7.433a1.804 1.804 0 1 1 0-3.608 1.804 1.804 0 0 1 0 3.608zM6.956 20.452H3.717V9h3.239v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.727v20.545C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.273V1.727C24 .774 23.2 0 22.222 0h.003z"
      />
    </svg>
  );
}

const tttLines: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function tttWinner(board: TTT[]): TTT | 'draw' | null {
  for (const [a, b, c] of tttLines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return board.every(Boolean) ? 'draw' : null;
}

// Check if a move would win immediately. (Removal happens after the full set: X + O)
function checkWinAfterMove(
  board: TTT[],
  moveIndex: number,
  player: 'X' | 'O',
  myMoves: number[]
): boolean {
  const nextBoard = [...board];
  nextBoard[moveIndex] = player;

  for (const [a, b, c] of tttLines) {
    if (nextBoard[a] === player && nextBoard[b] === player && nextBoard[c] === player) {
      return true;
    }
  }
  return false;
}

function tttBestMove(board: TTT[], xMoves: number[], oMoves: number[]): number | null {
  // If game is already won, no move needed
  if (tttWinner(board)) return null;

  const scoreFor = (winner: TTT | 'draw' | null) => (winner === 'O' ? 10 : winner === 'X' ? -10 : 0);

  // Minimax with limited depth for performance
  // State must include the move queues to simulate the "remove after full set" mechanic:
  // - X move: place X, no removal yet
  // - O move: place O, then remove oldest X and oldest O if they exceed 3 (end of set)
  const minimax = (
    currentBoard: TTT[],
    currentXMoves: number[],
    currentOMoves: number[],
    isMax: boolean,
    depth: number
  ): number => {
    const w = tttWinner(currentBoard);
    if (w) return scoreFor(w) - depth; // Penalize longer wins slightly
    if (depth > 3) return 0; // Depth limit to keep it fast

    const moves: number[] = [];
    for (let i = 0; i < 9; i++) if (!currentBoard[i]) moves.push(i);

    if (isMax) { // AI 'O' turn
      let best = -Infinity;
      for (const i of moves) {
        const nextBoard = [...currentBoard];
        const nextOMoves = [...currentOMoves];
        const nextXMoves = [...currentXMoves];

        nextBoard[i] = 'O';
        nextOMoves.push(i);
        // If O wins immediately, end before any removal.
        if (tttWinner(nextBoard) === 'O') {
          best = Math.max(best, scoreFor('O') - (depth + 1));
          continue;
        }

        // End of set: prune oldest pieces if they exceed 3
        if (nextXMoves.length > 3) {
          const removedX = nextXMoves.shift();
          if (removedX !== undefined) nextBoard[removedX] = null;
        }
        if (nextOMoves.length > 3) {
          const removedO = nextOMoves.shift();
          if (removedO !== undefined) nextBoard[removedO] = null;
        }

        best = Math.max(best, minimax(nextBoard, nextXMoves, nextOMoves, false, depth + 1));
      }
      return best;
    } else { // Player 'X' turn
      let best = Infinity;
      for (const i of moves) {
        const nextBoard = [...currentBoard];
        const nextXMoves = [...currentXMoves];

        nextBoard[i] = 'X';
        nextXMoves.push(i);
        // If X wins immediately, end before any removal.
        if (tttWinner(nextBoard) === 'X') {
          best = Math.min(best, scoreFor('X') - (depth + 1));
          continue;
        }

        // No pruning on X move; pruning happens after O moves (end of set)
        best = Math.min(best, minimax(nextBoard, nextXMoves, [...currentOMoves], true, depth + 1));
      }
      return best;
    }
  };

  let bestScore = -Infinity;
  let bestIdx: number | null = null;

  // 1. Try to win immediately (greedy) - wins are checked before any end-of-set pruning
  for (let i = 0; i < 9; i++) {
    if (board[i]) continue;
    if (checkWinAfterMove(board, i, 'O', oMoves)) return i;
  }

  // 2. Block immediate loss (greedy)
  for (let i = 0; i < 9; i++) {
    if (board[i]) continue;
    if (checkWinAfterMove(board, i, 'X', xMoves)) return i;
  }

  // 3. Minimax for strategic play
  for (let i = 0; i < 9; i++) {
    if (board[i]) continue;

    const nextBoard = [...board];
    const nextOMoves = [...oMoves];
    const nextXMoves = [...xMoves];

    nextBoard[i] = 'O';
    nextOMoves.push(i);
    // If O wins immediately, pick it.
    if (tttWinner(nextBoard) === 'O') return i;

    // End of set pruning for evaluation
    if (nextXMoves.length > 3) {
      const removedX = nextXMoves.shift();
      if (removedX !== undefined) nextBoard[removedX] = null;
    }
    if (nextOMoves.length > 3) {
      const removedO = nextOMoves.shift();
      if (removedO !== undefined) nextBoard[removedO] = null;
    }

    const s = minimax(nextBoard, nextXMoves, nextOMoves, false, 0);
    if (s > bestScore) {
      bestScore = s;
      bestIdx = i;
    }
  }

  // Fallback if minimax returns -Infinity (shouldn't happen with valid moves)
  if (bestIdx === null) {
    const available = [];
    for (let i = 0; i < 9; i++) if (!board[i]) available.push(i);
    if (available.length > 0) bestIdx = available[Math.floor(Math.random() * available.length)];
  }

  return bestIdx;
}

const TicTacToe = () => {
  const [board, setBoard] = useState<TTT[]>(() => Array(9).fill(null));
  const [xMoves, setXMoves] = useState<number[]>([]);
  const [oMoves, setOMoves] = useState<number[]>([]);
  const [turn, setTurn] = useState<'X' | 'O'>('X');
  const [busy, setBusy] = useState(false);
  const winner = useMemo(() => tttWinner(board), [board]);

  const winningLine = useMemo(() => {
    for (const [a, b, c] of tttLines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) return [a, b, c] as const;
    }
    return null;
  }, [board]);

  const reset = () => {
    setBoard(Array(9).fill(null));
    setXMoves([]);
    setOMoves([]);
    setTurn('X');
    setBusy(false);
  };

  // If someone wins (or it's a draw), briefly show the result then reset.
  useEffect(() => {
    if (!winner) return;
    setBusy(true);
    const t = setTimeout(() => reset(), 900);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winner]);

  const click = (i: number) => {
    if (busy || winner) return;
    if (turn !== 'X') return;
    if (board[i]) return;

    const nextBoard = [...board];
    const nextXMoves = [...xMoves];

    // Place X
    nextBoard[i] = 'X';
    nextXMoves.push(i);

    setBoard(nextBoard);
    setXMoves(nextXMoves);
    setTurn('O');
  };

  useEffect(() => {
    if (winner) return;
    if (turn !== 'O') return;
    setBusy(true);

    const t = setTimeout(() => {
      const i = tttBestMove(board, xMoves, oMoves);
      if (i !== null) {
        const nextBoard = [...board];
        const nextOMoves = [...oMoves];
        const nextXMoves = [...xMoves];

        // Place O
        nextBoard[i] = 'O';
        nextOMoves.push(i);

        // If O wins immediately, end the round before any end-of-set pruning.
        if (tttWinner(nextBoard) === 'O') {
          setBoard(nextBoard);
          setOMoves(nextOMoves);
          setTurn('X');
          setBusy(false);
          return;
        }

        // End of set: prune oldest X and O if they exceed 3
        if (nextXMoves.length > 3) {
          const removedX = nextXMoves.shift();
          if (removedX !== undefined) nextBoard[removedX] = null;
        }
        if (nextOMoves.length > 3) {
          const removedO = nextOMoves.shift();
          if (removedO !== undefined) nextBoard[removedO] = null;
        }

        setBoard(nextBoard);
        setXMoves(nextXMoves);
        setOMoves(nextOMoves);
      }
      setTurn('X');
      setBusy(false);
    }, 400); // Slightly longer delay for "thinking" feel
    return () => clearTimeout(t);
  }, [turn, board, xMoves, oMoves, winner]);

  return (
    <div className="w-full max-w-[320px] mx-auto sm:max-w-sm">
      <div className="relative rounded-lg sm:rounded-xl p-[1px] bg-gradient-to-br from-[#9DB2BF]/55 via-white/10 to-[#536D82]/40 shadow-[0_8px_30px_rgba(0,0,0,0.12)] sm:shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
        <div className="rounded-lg sm:rounded-xl overflow-hidden bg-[#0f1419]">
          {/* Top Bar */}
          <div className="px-2 py-1 sm:px-3 sm:py-2 flex items-center justify-between border-b border-white/10">
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-sm ${busy ? 'bg-amber-300' : winner ? 'bg-emerald-400' : 'bg-cyan-300'}`} />
                <div className="text-[9px] sm:text-xs font-semibold text-white/90 tracking-wide">Tic Tac Toe</div>
              </div>
              <div className="mt-0.5 hidden sm:block text-[10px] text-white/55">
                {busy
                  ? 'AI thinking…'
                  : winner
                    ? winner === 'draw'
                      ? 'Draw — resetting…'
                      : winner === 'X'
                        ? 'You win — resetting…'
                        : 'AI wins — resetting…'
                    : 'Your move (X).'}
              </div>
            </div>

            <button
              onClick={reset}
              className="shrink-0 inline-flex items-center justify-center gap-1 px-1.5 py-0.5 sm:px-2.5 sm:py-1.5 rounded border border-white/10 bg-white/5 text-[8px] sm:text-[10px] text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <RotateCcw size={12} className="sm:hidden" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>

          {/* Board */}
          <div className="p-1 sm:p-2">
            <div className="relative rounded-lg bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 p-0.5 sm:p-1.5">
              <div className="grid grid-cols-3 gap-0.5 sm:gap-1.5">
                {board.map((v, i) => {
                  const isWinCell = winningLine?.includes(i as any) ?? false;
                  const isEmpty = v === null;

                  // Visual cue for piece about to be removed (removal happens after the full set: X + O)
                  // - If it's X's turn and X has 3, the oldest X will be removed after O moves.
                  // - If it's O's turn and X already has 4, the oldest X will be removed after this O move.
                  // - If it's O's turn and O has 3, the oldest O will be removed after this O move.
                  const isOldestX =
                    (turn === 'X' && xMoves.length === 3 && xMoves[0] === i) ||
                    (turn === 'O' && xMoves.length > 3 && xMoves[0] === i);
                  const isOldestO = turn === 'O' && oMoves.length === 3 && oMoves[0] === i;
                  const isFading = (isOldestX || isOldestO);

                  return (
                    <button
                      key={i}
                      onClick={() => click(i)}
                      className={[
                        'relative aspect-square rounded-lg sm:rounded-2xl transition-all flex items-center justify-center',
                        'border border-white/10 bg-white/5',
                        !busy && isEmpty ? 'hover:bg-white/10 hover:border-white/20 hover:-translate-y-[1px]' : '',
                        isWinCell ? 'ring-2 ring-emerald-400/60 shadow-[0_0_24px_rgba(16,185,129,0.15)]' : '',
                        isFading ? 'opacity-50 border-dashed border-white/30' : '',
                      ].join(' ')}
                      aria-label={`Cell ${i + 1}`}
                    >
                      {/* Subtle inner highlight */}
                      <span className="absolute inset-0 rounded-lg sm:rounded-2xl pointer-events-none shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]" />

                      {v ? (
                        <motion.span
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className={[
                            'text-base sm:text-2xl md:text-3xl font-black leading-none select-none',
                            v === 'X' ? 'text-amber-300 drop-shadow-[0_6px_18px_rgba(251,191,36,0.20)]' : 'text-cyan-300 drop-shadow-[0_6px_18px_rgba(34,211,238,0.20)]',
                          ].join(' ')}
                        >
                          {v}
                        </motion.span>
                      ) : (
                        <span className="text-sm sm:text-xl font-black text-white/10 select-none">·</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Bottom legend */}
              <div className="mt-1 hidden sm:flex items-center justify-between text-[9px] sm:text-[10px] text-white/45">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-300" />
                    You (X)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-300" />
                    AI (O)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [workModalLock, setWorkModalLock] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState<{ src: string; alt: string; layoutId: string } | null>(null);
  const [contactBusy, setContactBusy] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const [contactSent, setContactSent] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [viewportType, setViewportType] = useState<'desktop' | 'mobile'>('desktop');
  const [viewportDropdownOpen, setViewportDropdownOpen] = useState(false);
  const [mobilePreviewUrl, setMobilePreviewUrl] = useState<string>('');
  const isInIframe = typeof window !== 'undefined' && window.self !== window.top;
  const { scrollY } = useScroll();
  const yTransform = useTransform(scrollY, [0, 300], [0, -50]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load viewport type from localStorage
  useEffect(() => {
    if (isInIframe) return;
    try {
      const saved = localStorage.getItem('cw_view_mode') as 'desktop' | 'mobile' | null;
      if (saved === 'mobile' || saved === 'desktop') {
        setViewportType(saved);
      }
    } catch {
      // ignore
    }
  }, [isInIframe]);

  // Save viewport type to localStorage
  useEffect(() => {
    if (isInIframe) return;
    try {
      localStorage.setItem('cw_view_mode', viewportType);
    } catch {
      // ignore
    }
  }, [viewportType, isInIframe]);

  // Set mobile preview URL when mobile mode is selected
  useEffect(() => {
    if (isInIframe) return;
    if (viewportType !== 'mobile') {
      setMobilePreviewUrl('');
      return;
    }
    setMobilePreviewUrl(window.location.href);
  }, [viewportType, isInIframe]);

  // Handle body overflow when mobile preview is active
  useEffect(() => {
    if (isInIframe) return;
    const prevOverflow = document.body.style.overflow;
    if (viewportType === 'mobile') {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [viewportType, isInIframe]);

  // Handle enlarged image modal - ESC key and body scroll lock
  useEffect(() => {
    if (!enlargedImage) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setEnlargedImage(null);
    };

    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleEsc);
    };
  }, [enlargedImage]);

  const openWorkCard = (idx: number) => {
    setExpandedCard(idx);
    setWorkModalLock(true);
  };

  const closeWorkCard = () => {
    setExpandedCard(null);
    // NOTE: we intentionally keep `workModalLock` true until the exit animation completes
    // (see AnimatePresence `onExitComplete`) to avoid layout "hiccups" while the shared
    // layout transition is still running.
  };

  useEffect(() => {
    if (!workModalLock) return;

    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;

    // Prevent layout "hiccup" when locking/unlocking scroll (scrollbar width reflow).
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeWorkCard();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [workModalLock]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const submitContact: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (contactBusy) return;
    setContactError(null);
    setContactSent(false);

    if (!turnstileToken) {
      setContactError('Please complete the captcha.');
      return;
    }

    const fd = new FormData(e.currentTarget);
    const fullname = String(fd.get('fullname') ?? '');
    const email = String(fd.get('email') ?? '');
    const message = String(fd.get('message') ?? '');

    setContactBusy(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ fullname, email, message, turnstileToken }),
      });
      const raw = await res.text();
      let json: { ok?: boolean; error?: string } | null = null;
      try {
        json = raw ? (JSON.parse(raw) as { ok?: boolean; error?: string }) : null;
      } catch {
        json = null;
      }

      const ok = res.ok && (json?.ok ?? true);
      if (!ok) {
        setContactError(json?.error || raw || `Request failed (${res.status}).`);
        setContactSent(false);
        return;
      }

      // Success - clear error and set success
      // Wrap in try-catch so errors in reset/token clearing don't trigger network error
      try {
        setContactError(null);
        setContactSent(true);
        e.currentTarget.reset();
        setTurnstileToken(null);
      } catch (resetErr) {
        // If reset fails, still show success since the message was sent
        setContactError(null);
        setContactSent(true);
      }
    } catch (err) {
      // Only catch actual network/fetch errors (before we get a response)
      if (err instanceof TypeError && (err.message.includes('fetch') || err.message.includes('network'))) {
        setContactError('Network error. Please try again.');
      } else {
        setContactError('An unexpected error occurred. Please try again.');
      }
      setContactSent(false);
    } finally {
      setContactBusy(false);
    }
  };

  type WorkExample = { title: string; description: string; imageSrc?: string };
  type WorkProject = { title: string; category: string; description: string; examples: WorkExample[] };

  const workProjects = useMemo(
    (): WorkProject[] => [
      {
        title: 'Network Infrastructure',
        category: 'NETWORK',
        description: 'Enterprise network design, implementation, and optimization',
        examples: [
          { title: 'Production Network Traffic and Client Visibility', description: 'This view represents a live production environment with sustained traffic volumes and a diverse client base across wired and wireless infrastructure. I manage end-to-end visibility into client behavior, bandwidth consumption, and application usage to ensure predictable performance and capacity planning. This network supports continuous utilization under load while maintaining stability, segmentation, and policy enforcement across devices and tenants.', imageSrc: `/assets/images/ni-p1.png?v=${ASSET_REV}` },
          { title: 'Enterprise Wireless Network Health and Optimization', description: 'This snapshot shows real-time wireless health metrics from a production enterprise WiFi deployment. I designed, deployed, and actively tune this environment to deliver fast client association, seamless roaming, strong signal quality, and low latency at scale. Ongoing monitoring and optimization ensure reliability for high-density usage while maintaining security, performance baselines, and operational headroom.', imageSrc: `/assets/images/ni-p2.png?v=${ASSET_REV}` },
          { title: 'Enterprise WiFi Network Design & Optimization', description: 'Designed and optimized enterprise-grade wireless networks for high-density environments. Conducted site surveys, configured AP placement, implemented advanced security policies, and optimized performance for seamless connectivity across multiple floors and buildings.', imageSrc: `/assets/images/ni-p3.png?v=${ASSET_REV}` },
        ],
      },
      {
        title: 'Website Development',
        category: 'WEB',
        description: 'Modern web applications built with React, Next.js, and TypeScript',
        examples: [
          { title: 'Portfolio Website', description: 'Built responsive portfolio site with custom animations and interactive components', imageSrc: '/assets/work/placeholder.svg' },
          { title: 'Client Dashboard', description: 'Developed internal dashboard for MSP client management and ticket tracking', imageSrc: '/assets/work/placeholder.svg' },
          { title: 'Network Monitoring UI', description: 'Created real-time network monitoring interface with live status updates', imageSrc: '/assets/work/placeholder.svg' },
        ],
      },
      {
        title: 'Automation & Scripting',
        category: 'AUTOMATION',
        description: 'PowerShell and API scripting to eliminate repetitive tasks',
        examples: [
          { title: 'User Provisioning Automation', description: 'Automated M365 user onboarding/offboarding, reducing manual work by 4 hours per week', imageSrc: '/assets/work/placeholder.svg' },
          { title: 'Network Config Generator', description: 'Built PowerShell tool to generate standardized switch/router configs from templates', imageSrc: '/assets/work/placeholder.svg' },
          { title: 'Backup Verification Scripts', description: 'Created automated backup verification system with email alerts and reporting', imageSrc: '/assets/work/placeholder.svg' },
        ],
      },
      {
        title: 'Security Solutions',
        category: 'SECURITY',
        description: 'Firewall policies, VPNs, and compliance-driven security controls',
        examples: [
          { title: 'FortiGate Policy Optimization', description: 'Redesigned firewall rulebase, reducing rules by 40% while improving security posture', imageSrc: '/assets/work/placeholder.svg' },
          { title: 'Site-to-Site VPN Deployment', description: 'Configured IPsec VPN tunnels for secure multi-site connectivity', imageSrc: '/assets/work/placeholder.svg' },
          { title: 'Security Audit & Remediation', description: 'Conducted security assessments and implemented remediation plans for PCI compliance', imageSrc: '/assets/work/placeholder.svg' },
        ],
      },
    ],
    []
  );

  const activeProject = expandedCard === null ? null : workProjects[expandedCard];

  // Prefetch screenshots for the expanded card so slow networks don't cause mid-animation pop-in.
  useEffect(() => {
    if (expandedCard === null) return;
    const p = workProjects[expandedCard];
    if (!p) return;
    if (typeof window === 'undefined') return;

    for (const ex of p.examples) {
      if (!ex.imageSrc) continue;
      const img = new window.Image();
      img.decoding = 'async';
      img.loading = 'eager';
      img.src = ex.imageSrc;
    }
  }, [expandedCard, workProjects]);

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#26374D] font-sans antialiased">
      {/* Fixed Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-[#FAFAFA]/95 backdrop-blur-sm transition-all duration-300 ${scrolled ? 'shadow-sm border-b border-[#9DB2BF]/30' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <Image
              src="/assets/images/logo.png"
              alt="Colby West"
              width={40}
              height={40}
              className="h-6 sm:h-8 w-auto"
              priority
            />
            <div className="flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 text-xs sm:text-sm font-medium uppercase tracking-wider">
              <button onClick={() => scrollToSection('work')} className="text-[#536D82] hover:text-[#26374D] transition-colors">Work</button>
              <button onClick={() => scrollToSection('about')} className="text-[#536D82] hover:text-[#26374D] transition-colors">About</button>
              <button onClick={() => scrollToSection('contact')} className="text-[#536D82] hover:text-[#26374D] transition-colors">Contact</button>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Viewport Preview Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setViewportDropdownOpen(!viewportDropdownOpen)}
                  className="text-[#26374D] hover:text-[#536D82] transition-colors p-1"
                  aria-label="Viewport Preview"
                >
                  <ChevronDown size={12} className={viewportDropdownOpen ? 'rotate-180' : ''} />
                </button>
                {viewportDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setViewportDropdownOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-1 bg-white border border-[#9DB2BF]/30 rounded shadow-lg z-50 min-w-[120px]">
                      <button
                        onClick={() => {
                          setViewportType('desktop');
                          setViewportDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-[#FAFAFA] transition-colors ${viewportType === 'desktop' ? 'bg-[#FAFAFA] text-[#26374D]' : 'text-[#536D82]'
                          }`}
                      >
                        <Monitor size={12} />
                        Desktop
                      </button>
                      <button
                        onClick={() => {
                          setViewportType('mobile');
                          setViewportDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-[#FAFAFA] transition-colors ${viewportType === 'mobile' ? 'bg-[#FAFAFA] text-[#26374D]' : 'text-[#536D82]'
                          }`}
                      >
                        <Smartphone size={12} />
                        Mobile
                      </button>
                    </div>
                  </>
                )}
              </div>
              <a href="https://github.com/colbywest5" target="_blank" rel="noopener noreferrer" className="text-[#26374D] hover:text-[#536D82] transition-colors" aria-label="GitHub">
                <Github size={16} className="sm:w-[18px] sm:h-[18px]" />
              </a>
              <a href="https://www.linkedin.com/in/colby-west5/" target="_blank" rel="noopener noreferrer" className="text-[#26374D] hover:text-[#536D82] transition-colors" aria-label="LinkedIn">
                <LinkedInMark size={16} />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16 sm:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full">
          <div className="grid grid-cols-12 gap-6 md:gap-8 items-center">
            {/* Left Column - Text */}
            <motion.div
              style={{ y: yTransform }}
              className="col-span-12 md:col-span-6 lg:col-span-7 space-y-6 md:space-y-8"
            >
              <div className="space-y-3 md:space-y-4">
                <div className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-[#536D82]">Colby West</div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.95] tracking-tight text-[#26374D] break-normal hyphens-none">
                  Network Engineering
                  <br />
                  <span className="text-[#536D82]">meets</span>
                  <br />
                  Web Development
                </h1>
              </div>
              <p className="text-base sm:text-lg md:text-xl text-[#536D82] leading-relaxed max-w-xl">
                Five years of hands-on experience building networks, securing systems, and crafting modern solutions.
              </p>
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 pt-2 sm:pt-4">
                <button
                  onClick={() => scrollToSection('work')}
                  className="group w-full max-w-[320px] sm:w-auto sm:max-w-none flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[#26374D] text-white font-medium text-xs sm:text-sm uppercase tracking-wider hover:bg-[#536D82] transition-colors"
                >
                  View Work
                  <ArrowRight size={14} className="sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="w-full max-w-[320px] sm:w-auto sm:max-w-none px-6 sm:px-8 py-3 sm:py-4 border-2 border-[#26374D] font-medium text-xs sm:text-sm uppercase tracking-wider hover:bg-[#26374D] hover:text-white transition-colors text-[#26374D]"
                >
                  Contact
                </button>
              </div>
            </motion.div>

            {/* Right Column - Game (small widget) */}
            <motion.div
              style={{ y: yTransform }}
              className="col-span-12 md:col-span-6 lg:col-span-5 flex justify-center md:justify-end"
            >
              <TicTacToe />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Work Section */}
      <section id="work" className="min-h-screen py-16 sm:py-24 md:py-32 bg-[#26374D] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-12 gap-6 md:gap-8 mb-12 sm:mb-16 md:mb-24">
            <div className="col-span-12 md:col-span-3">
              <div className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-white/70 mb-3 sm:mb-4">Selected Work</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white">Projects &<br />Case Studies</h2>
            </div>
            <div className="col-span-12 md:col-span-9">
              <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-2xl">
                A curated selection of work spanning network infrastructure, cloud architecture, and modern web applications.
              </p>
            </div>
          </div>

          <LayoutGroup id="work-cards">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {workProjects.map((project, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
                  transition={{ delay: idx * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.div
                    layoutId={`work-card-${idx}`}
                    transition={{ type: 'spring', stiffness: 520, damping: 60, mass: 0.95 }}
                    className="bg-white border border-[#9DB2BF]/30 rounded-lg overflow-hidden hover:shadow-lg transition-shadow will-change-transform"
                    role="button"
                    tabIndex={0}
                    onClick={() => openWorkCard(idx)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') openWorkCard(idx);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="p-8 sm:p-10 md:p-12">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="text-xs font-medium uppercase tracking-wider text-[#536D82] mb-2">{project.category}</div>
                          <h3 className="text-xl sm:text-2xl font-bold text-[#26374D] mb-3">{project.title}</h3>
                          <p className="text-sm sm:text-base text-[#536D82] leading-relaxed">{project.description}</p>
                        </div>
                        <div className="text-[#536D82] shrink-0">
                          <ArrowRight size={18} className="rotate-90" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            <AnimatePresence
              initial={false}
              onExitComplete={() => {
                // Only unlock scroll after the modal has fully finished exiting.
                setWorkModalLock(false);
              }}
            >
              {expandedCard !== null && activeProject && (
                <motion.div
                  className="fixed inset-0 z-[60]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  onClick={closeWorkCard}
                >
                  <motion.div
                    aria-hidden="true"
                    className="absolute inset-0 bg-black/40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  />

                  <div className="relative z-10 w-full h-full overflow-auto">
                    <div className="min-h-full flex items-start justify-center px-4 sm:px-6 md:px-8 py-10 md:py-16">
                      <motion.div
                        layoutId={`work-card-${expandedCard}`}
                        transition={{ type: 'spring', stiffness: 520, damping: 60, mass: 0.95 }}
                        className="w-full max-w-6xl bg-white border border-[#9DB2BF]/30 rounded-2xl overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.35)] will-change-transform"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="p-8 sm:p-10 md:p-12 border-b border-[#9DB2BF]/20">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="text-xs font-medium uppercase tracking-wider text-[#536D82] mb-2">{activeProject.category}</div>
                              <h3 className="text-2xl sm:text-3xl font-bold text-[#26374D] mb-3">{activeProject.title}</h3>
                              <p className="text-sm sm:text-base text-[#536D82] leading-relaxed max-w-3xl">{activeProject.description}</p>
                            </div>
                            <button
                              type="button"
                              onClick={closeWorkCard}
                              className="shrink-0 w-10 h-10 rounded-xl border border-[#9DB2BF]/30 bg-white hover:bg-[#FAFAFA] flex items-center justify-center text-[#536D82] transition-colors"
                              aria-label="Close"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </div>

                        <div className="p-8 sm:p-10 md:p-12">
                          <motion.div
                            initial="hidden"
                            animate="show"
                            variants={{
                              hidden: {},
                              show: { transition: { staggerChildren: 0.06, delayChildren: 0.4 } },
                            }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                          >
                            {activeProject.examples.map((example, exIdx) => (
                              <motion.div
                                key={exIdx}
                                variants={{
                                  hidden: { opacity: 0, y: 10 },
                                  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } },
                                }}
                                className="bg-[#FAFAFA] p-6 rounded-lg border border-[#9DB2BF]/20"
                              >
                                <motion.button
                                  type="button"
                                  layoutId={`work-image-${activeProject.title}-${exIdx}`}
                                  transition={{ type: 'spring', stiffness: 520, damping: 60, mass: 0.95 }}
                                  onClick={() =>
                                    example.imageSrc &&
                                    setEnlargedImage({
                                      src: example.imageSrc,
                                      alt: example.title,
                                      layoutId: `work-image-${activeProject.title}-${exIdx}`,
                                    })
                                  }
                                  className="relative w-full aspect-video rounded-xl mb-4 overflow-hidden cursor-pointer group focus:outline-none border border-[#9DB2BF]/20 bg-white"
                                >
                                  {/* Foreground image (shows full screenshot) */}
                                  <div className="absolute inset-0">
                                    <img
                                      src={example.imageSrc ?? '/assets/work/placeholder.svg'}
                                      alt={example.title}
                                      className="absolute inset-0 w-full h-full object-contain"
                                      loading="lazy"
                                      decoding="async"
                                    />
                                  </div>

                                  {/* Hover affordance */}
                                  <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                                  <div className="pointer-events-none absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="text-[11px] font-semibold tracking-wide text-white/90 bg-black/55 px-2.5 py-1 rounded-md">
                                      View
                                    </div>
                                  </div>
                                </motion.button>
                                <h4 className="text-sm font-bold text-[#26374D] mb-2">{example.title}</h4>
                                <p className="text-xs text-[#536D82] leading-relaxed">{example.description}</p>
                              </motion.div>
                            ))}
                          </motion.div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </LayoutGroup>

          {/* Enlarged Image Modal */}
          <AnimatePresence>
            {enlargedImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={() => setEnlargedImage(null)}
              >
                <motion.div
                  layoutId={enlargedImage.layoutId}
                  transition={{ type: 'spring', stiffness: 520, damping: 60, mass: 0.95 }}
                  className="relative w-[min(96vw,1200px)] aspect-video rounded-2xl overflow-hidden border border-white/15 bg-white shadow-[0_50px_160px_rgba(0,0,0,0.60)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Full image */}
                  <div className="absolute inset-0">
                    <img
                      src={enlargedImage.src}
                      alt={enlargedImage.alt}
                      className="absolute inset-0 w-full h-full object-contain"
                      loading="eager"
                      decoding="async"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setEnlargedImage(null)}
                    className="absolute top-3 right-3 text-white/90 hover:text-white transition-colors z-10 px-2 py-1 rounded-md bg-black/55 hover:bg-black/70 border border-white/10"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen py-16 sm:py-24 md:py-32 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-12 gap-6 md:gap-8">
            <div className="col-span-12 md:col-span-4">
              <div className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-[#536D82] mb-3 sm:mb-4">About</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-[#26374D]">Professional<br />Background</h2>
            </div>
            <div className="col-span-12 md:col-span-8">
              <div className="bg-white p-8 sm:p-12 border border-[#9DB2BF]/30 rounded-lg">
                <p className="text-sm sm:text-base text-[#536D82] leading-relaxed">
                  With a strong passion for technology and five years of hands-on experience in the IT industry, I am a dedicated,
                  self-taught professional committed to excellence. Through practical experience and continuous self-education, I’ve
                  built deep strength in network operations, security-minded infrastructure, and clear communication with technical and
                  non-technical stakeholders.
                </p>
              </div>
            </div>
          </div>

          {/* Resume + Skills + Timeline (same section as Professional Background) */}
          <div className="mt-10 sm:mt-14 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
            {/* Core Skills */}
            <div className="flex flex-col">
              <div className="bg-white p-8 sm:p-10 border border-[#9DB2BF]/30 rounded-lg flex flex-col">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-lg bg-[#26374D] text-white flex items-center justify-center shrink-0">
                    <Cpu size={18} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#26374D]">Skills</h3>
                </div>

                <div className="space-y-5 flex-1">
                  {[
                    {
                      icon: <Network size={14} />,
                      title: 'Network Architecture + Operations',
                      bullets: ['Routing/switching, segmentation (VLAN/VRF), QoS', 'WAN design + resiliency (IPsec, failover, multi-site)'],
                    },
                    {
                      icon: <ShieldCheck size={14} />,
                      title: 'Security Engineering (Pragmatic)',
                      bullets: ['Firewall policy, VPNs, segmentation, risk reduction', 'Compliance-driven controls (HIPAA/GLBA/PCI) + remediation'],
                    },
                    {
                      icon: <Building2 size={14} />,
                      title: 'High-Tempo MSP Delivery',
                      bullets: ['Escalations, incident response, RCA + change control', 'Vendor/ISP escalation, SLAs, multi-client priorities'],
                    },
                    {
                      icon: <Code2 size={14} />,
                      title: 'Automation + Standardization',
                      bullets: ['PowerShell automation + API scripting', 'Config templating, repeatable rollouts, runbooks'],
                    },
                    {
                      icon: <Briefcase size={14} />,
                      title: 'Technical Leadership',
                      bullets: ['Architecture decisions + tradeoffs (security vs uptime)', 'Clear comms with execs + engineers; training/support'],
                    },
                  ].map((s, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className="mt-0.5 w-8 h-8 rounded-lg bg-[#FAFAFA] border border-[#9DB2BF]/30 flex items-center justify-center text-[#536D82] shrink-0">
                        {s.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#26374D] mb-1">{s.title}</div>
                        <ul className="space-y-0.5">
                          {s.bullets.map((b) => (
                            <li key={b} className="text-xs text-[#536D82] leading-relaxed flex items-start gap-1.5">
                              <span className="mt-1.5 w-1 h-1 rounded-full bg-[#9DB2BF] shrink-0" />
                              <span className="text-balance break-words">{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-[#9DB2BF]/20">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#536D82] mb-3">Platforms & Tools</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Cisco',
                      'Meraki',
                      'Aruba',
                      'UniFi',
                      'FortiGate',
                      'Azure',
                      'Linux',
                      'PowerShell',
                      'Python',
                      'Wireshark',
                      'PRTG',
                      'Grafana',
                      'Git',
                      'Docker',
                      'VMware',
                      'Hyper-V',
                    ].map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1.5 bg-[#FAFAFA] border border-[#9DB2BF]/30 rounded-full text-xs text-[#536D82]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Career Journey Timeline */}
            <div className="flex flex-col">
              <div className="bg-white p-8 sm:p-10 border border-[#9DB2BF]/30 rounded-lg flex flex-col">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-lg bg-[#26374D] text-white flex items-center justify-center shrink-0">
                    <Briefcase size={18} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#26374D]">Career Journey</h3>
                </div>

                <div className="relative flex-1">
                  {/* Vertical line - positioned at exactly 20px from left (center of 40px icon) */}
                  <div className="absolute left-[20px] top-0 bottom-0 w-[1px] bg-[#9DB2BF]/40" />
                  {/* End-cap dot (centered on the line end) */}
                  <div className="absolute left-[20px] bottom-0 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-[#9DB2BF]/60" />

                  <div className="space-y-6">
                    {[
                      {
                        title: 'Network Engineer',
                        org: 'Covenant Technology, LLC · Spring Hill, TN',
                        date: 'Jul 2023 — Current',
                        icon: <Network size={14} />,
                        bullets: [
                          'Primary escalation point for complex network/security issues.',
                          'Designed and supported secure client environments, including healthcare orgs.',
                          'Collaborated with vendors/ISPs to resolve WAN and service-impacting incidents.',
                        ],
                      },
                      {
                        title: 'Help Desk',
                        org: 'First Farmers & Merchants Bank · Columbia, TN',
                        date: 'Jan 2023 — Jul 2023',
                        icon: <Building2 size={14} />,
                        bullets: [
                          'Diagnosed LAN/WAN + application issues with a downtime-first mindset.',
                          'Automated repetitive work with PowerShell to improve throughput.',
                          'Built documentation and improved the internal knowledge base.',
                        ],
                      },
                      {
                        title: 'IT Specialist',
                        org: 'Huskey Truss & Building Supply, Inc · Franklin, TN',
                        date: 'Jul 2022 — Dec 2022',
                        icon: <Wrench size={14} />,
                        bullets: [
                          'Supported 350+ internal users across systems and networking.',
                          'Built scripts to standardize routine operations and reduce manual effort.',
                          'Owned network equipment installation and ongoing maintenance.',
                        ],
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="relative pl-12">
                        {/* Icon centered ON the line */}
                        <div className="absolute left-[20px] top-0 w-10 h-10 -translate-x-1/2 rounded-full bg-white border-2 border-[#9DB2BF]/40 flex items-center justify-center text-[#536D82] shadow-sm z-10">
                          {item.icon}
                        </div>

                        <div className="min-w-0">
                          <div className="mb-2 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <div className="text-sm font-bold text-[#26374D] mb-0.5 min-w-0">{item.title}</div>
                              <div className="text-[10px] font-medium text-[#9DB2BF] uppercase tracking-wider whitespace-nowrap shrink-0 pt-[1px]">
                                {item.date}
                              </div>
                            </div>
                            <div className="text-xs text-[#536D82] leading-snug text-pretty">
                              {item.org}
                            </div>
                          </div>

                          <ul className="space-y-1 mt-2">
                            {item.bullets.map((b) => (
                              <li key={b} className="text-xs text-[#536D82] leading-relaxed flex items-start gap-1.5">
                                <span className="mt-1.5 w-1 h-1 rounded-full bg-[#9DB2BF] shrink-0" />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Education + Certifications (right column) */}
            <div className="flex flex-col">
              <div className="bg-white p-8 sm:p-10 border border-[#9DB2BF]/30 rounded-lg flex flex-col">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-lg bg-[#26374D] text-white flex items-center justify-center shrink-0">
                    <GraduationCap size={18} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#26374D]">Education</h3>
                </div>

                <div className="relative flex-1">
                  <div className="space-y-6">
                    {[
                      {
                        icon: <School size={14} />,
                        title: 'Associate of Science in Computer Science',
                        meta: 'Columbia State Community College ‎ ‎ ‎ ‎ ‎  Expected May 2027',
                      },
                      {
                        icon: <BookOpen size={14} />,
                        title: 'High School Diploma',
                        meta: 'Lawrence County High School ‎ ‎ ‎ ‎ ‎‎ ‎ ‎ ‎ ‎‎ ‎ ‎ ‎ ‎‎ ‎ ‎ ‎ ‎‎ ‎ ‎ ‎ ‎‎ ‎ ‎ ‎ ‎‎ ‎ ‎ ‎ ‎ May 2017',
                      },
                    ].map((e, idx) => (
                      <div key={idx} className="relative pl-12">
                        <div className="absolute left-[20px] top-0 w-10 h-10 -translate-x-1/2 rounded-full bg-white border-2 border-[#9DB2BF]/40 flex items-center justify-center text-[#536D82] shadow-sm z-10">
                          {e.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-[#26374D] leading-snug mb-0.5">{e.title}</div>
                          <div className="text-xs text-[#536D82] leading-relaxed">{e.meta}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[#9DB2BF]/20">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-[#26374D] text-white flex items-center justify-center shrink-0">
                      <Award size={18} />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#26374D]">Certifications</h3>
                  </div>

                  <div className="relative">
                    <div className="space-y-6">
                      {[
                        {
                          title: 'Unifi Full Stack Professional',
                          meta: 'Ubiquiti Networks',
                          icon: (
                            <img
                              src="https://logosandtypes.com/wp-content/uploads/2023/11/unifi.svg"
                              alt="UniFi"
                              className="w-4 h-4 object-contain"
                              loading="lazy"
                              decoding="async"
                            />
                          ),
                        },
                        {
                          title: 'Fiber Optic Fusion Splicing',
                          meta: 'Sumitomo Electric Lightwave',
                          icon: (
                            <img
                              src="/assets/images/Sumitomo-logo.png"
                              alt="Sumitomo Electric"
                              className="w-4 h-4 object-contain"
                              loading="lazy"
                              decoding="async"
                            />
                          ),
                        },
                      ].map((c, idx) => (
                        <div key={idx} className="relative pl-12">
                          <div className="absolute left-[20px] top-0 w-10 h-10 -translate-x-1/2 rounded-full bg-white border-2 border-[#9DB2BF]/40 flex items-center justify-center text-[#536D82] shadow-sm z-10">
                            {c.icon}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-[#26374D] leading-snug mb-0.5">{c.title}</div>
                            <div className="text-xs text-[#536D82] leading-relaxed">{c.meta}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen py-16 sm:py-24 md:py-32 bg-[#26374D] text-white relative overflow-hidden isolate">
        {/* Defensive backdrop (kept BEHIND content). */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[#26374D]" aria-hidden="true" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-12 gap-6 md:gap-8 mb-12 sm:mb-16 md:mb-24">
            <div className="col-span-12 md:col-span-5">
              <div className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-white/70 mb-3 sm:mb-4">Contact</div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 sm:mb-8 text-white">Let's Work<br />Together</h2>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-md">
                If you’re building something that touches networks, security, or modern web apps, I’m happy to jump in—architecture, implementation, or cleanup.
                Fast communication, clean execution.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-white/85">

                </div>

                <div className="flex flex-wrap gap-3 pt-1">
                  <a
                    href="https://github.com/colbywest5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs sm:text-sm font-semibold text-white/90 hover:bg-white/10 hover:border-white/25 transition-colors"
                    aria-label="GitHub Profile"
                  >
                    <Github size={16} />
                    GitHub
                  </a>
                  <a
                    href="https://www.linkedin.com/in/colby-west5/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs sm:text-sm font-semibold text-white/90 hover:bg-white/10 hover:border-white/25 transition-colors"
                    aria-label="LinkedIn Profile"
                  >
                    <LinkedInMark size={16} />
                    LinkedIn
                  </a>
                </div>

                <div className="text-xs text-white/60">
                  Links for quick context.
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-7 relative">
              <div className="rounded-2xl p-[1px] bg-gradient-to-br from-white/18 via-white/8 to-white/5 shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
                <form
                  onSubmit={submitContact}
                  className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6 sm:p-8 md:p-10"
                >
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="min-w-0">
                      <div className="text-sm sm:text-base font-semibold text-white/95">Send a message</div>
                    </div>
                  </div>

                  <div className="space-y-4 sm:space-y-5">
                    <div>
                      <label htmlFor="name" className="block text-[11px] font-semibold uppercase tracking-wider text-white/70 mb-2">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="fullname"
                        required
                        placeholder="Your name"
                        className="w-full px-4 py-3 rounded-xl border border-[#9DB2BF]/30 bg-white/[0.06] text-white placeholder:text-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] focus:outline-none focus:ring-2 focus:ring-cyan-200/25 focus:border-cyan-200/35 transition"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-[11px] font-semibold uppercase tracking-wider text-white/70 mb-2">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        placeholder="you@domain.com"
                        className="w-full px-4 py-3 rounded-xl border border-[#9DB2BF]/30 bg-white/[0.06] text-white placeholder:text-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] focus:outline-none focus:ring-2 focus:ring-cyan-200/25 focus:border-cyan-200/35 transition"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-[11px] font-semibold uppercase tracking-wider text-white/70 mb-2">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        required
                        placeholder="What are you working on?"
                        className="w-full px-4 py-3 rounded-xl border border-[#9DB2BF]/30 bg-white/[0.06] text-white placeholder:text-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] focus:outline-none focus:ring-2 focus:ring-cyan-200/25 focus:border-cyan-200/35 transition resize-none"
                      />
                    </div>

                    <div className="pt-1">
                      <TurnstileWidget
                        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                        onToken={setTurnstileToken}
                        theme="dark"
                      />
                    </div>

                    <AnimatePresence mode="wait">
                      {contactError ? (
                        <motion.div
                          key="error"
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          className="w-full flex items-center gap-2.5 text-xs sm:text-sm text-white/80 border border-white/15 bg-white/5 rounded-xl px-4 py-3"
                        >
                          <XCircle size={16} className="flex-shrink-0 text-rose-400" />
                          <span className="flex-1">{contactError}</span>
                        </motion.div>
                      ) : contactSent ? (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          className="relative w-full flex items-center gap-2.5 text-xs sm:text-sm text-white/90 border border-white/15 bg-white/5 rounded-xl px-4 py-3 overflow-hidden"
                        >
                          {/* Subtle shimmer */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                            initial={{ x: '-100%' }}
                            animate={{ x: '200%' }}
                            transition={{ duration: 2.5, delay: 0.2, ease: "easeInOut" }}
                          />
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.1 }}
                          >
                            <CheckCircle2 size={16} className="flex-shrink-0 text-emerald-400" />
                          </motion.div>
                          <span className="flex-1 font-semibold">Message sent.</span>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>

                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <button
                        type="submit"
                        disabled={contactBusy}
                        className="group w-full sm:w-auto px-8 sm:px-10 py-3.5 bg-white text-[#26374D] font-semibold text-xs sm:text-sm uppercase tracking-wider hover:bg-white/90 disabled:opacity-60 disabled:hover:bg-white transition-all rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                      >
                        {contactBusy ? 'Sending…' : 'Send Message'}
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Preview Overlay */}
      {!isInIframe && viewportType === 'mobile' && mobilePreviewUrl && (
        <div className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-[2px]">
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-[390px] max-w-[92vw] h-[844px] max-h-[92vh] rounded-[28px] bg-white shadow-[0_40px_140px_rgba(0,0,0,0.45)] overflow-hidden border border-white/20">
              <div className="h-10 bg-[#0f1419] text-white/80 flex items-center justify-between px-4 text-xs">
                <div className="flex items-center gap-2">
                  <Smartphone size={14} />
                  <span className="font-semibold tracking-wide">Mobile Preview</span>
                </div>
                <button
                  type="button"
                  onClick={() => setViewportType('desktop')}
                  className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/15 transition-colors"
                >
                  Exit
                </button>
              </div>
              <iframe
                title="Mobile preview"
                src={mobilePreviewUrl}
                className="w-full h-[calc(100%-40px)] bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#FAFAFA]/95 backdrop-blur-sm border-t border-[#9DB2BF]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 md:py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
            {/* Left Column */}
            <div className="text-xs sm:text-sm text-[#536D82] text-center sm:text-left">
              Network Engineer & Web Developer
            </div>
            {/* Center Column */}
            <div className="text-xs sm:text-sm text-[#536D82] text-center">
              © {new Date().getFullYear()} Colby West. All rights reserved.
            </div>
            {/* Right Column */}
            <div className="flex items-center justify-center sm:justify-end gap-3 sm:gap-4">
              <a
                href="https://github.com/colbywest5"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#26374D] hover:text-[#536D82] transition-colors"
                aria-label="GitHub"
              >
                <Github size={16} className="sm:w-[18px] sm:h-[18px]" />
              </a>
              <a
                href="https://www.linkedin.com/in/colby-west5/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#26374D] hover:text-[#536D82] transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedInMark size={16} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
