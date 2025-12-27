'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useScroll, useTransform } from 'framer-motion';
import { Github, Mail, ArrowRight, Award, BookOpen, Briefcase, Building2, Code2, Cpu, GraduationCap, Network, RotateCcw, ShieldCheck, School, Wrench, X, CheckCircle2, XCircle, ChevronDown, Smartphone, Monitor, FileDown, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import TurnstileWidget from './TurnstileWidget';
import { Tooltip } from '@/components/Tooltip';

type TTT = 'X' | 'O' | null;

// Bump this when you replace images in `public/assets/images/*` and want the site
// to fetch the new bytes immediately (avoids Next/Image + browser caching).
const ASSET_REV = '3';

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

function DownloadMark({ size = 18 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      viewBox="0 -960 960 960"
      width={size}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M480-315.33 284.67-510.67l47.33-48L446.67-444v-356h66.66v356L628-558.67l47.33 48L480-315.33ZM226.67-160q-27 0-46.84-19.83Q160-199.67 160-226.67V-362h66.67v135.33h506.66V-362H800v135.33q0 27-19.83 46.84Q760.33-160 733.33-160H226.67Z" />
    </svg>
  );
}

function ClosedEye({ size = 18, ...props }: React.ComponentProps<'svg'> & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m15 18-.722-3.25" />
      <path d="M2 8a10.645 10.645 0 0 0 20 0" />
      <path d="m20 15-1.726-2.05" />
      <path d="m4 15 1.726-2.05" />
      <path d="m9 18 .722-3.25" />
    </svg>
  );
}

// Custom Icons for TTT
function IconGlobal({ size = 18, ...props }: React.ComponentProps<'svg'> & { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} fill="currentColor" {...props}>
      <path d="M480-80q-83.33 0-156.33-31.5-73-31.5-127.17-85.67-54.17-54.16-85.33-127.5Q80-398 80-481.33 80-565 111.17-637.5q31.16-72.5 85.33-126.67 54.17-54.16 127.17-85Q396.67-880 480-880q83.67 0 156.5 30.83 72.83 30.84 127 85Q817.67-710 848.83-637.5 880-565 880-481.33q0 83.33-31.17 156.66-31.16 73.34-85.33 127.5-54.17 54.17-127 85.67T480-80Zm0-66q32-36 54-80t36-101.33H390.67Q404-272.67 426-227.67T480-146Zm-91.33-13.33q-22.67-36.34-39.17-77.5Q333-278 322-327.33H182.67q35 64 82.83 103.33t123.17 64.67ZM572-160q66.67-21.33 119.5-64.33t85.83-103H638.67Q627-278.67 610.83-237.5 594.67-196.33 572-160ZM158-394h151.33q-3-24.67-3.83-45.5-.83-20.83-.83-41.83 0-23.67 1.16-43.17Q307-544 310-566.67H158q-6.33 22.67-8.83 41.84-2.5 19.16-2.5 43.5 0 24.33 2.5 44.5 2.5 20.16 8.83 42.83Zm219.33 0h206q3.67-27.33 4.84-46.83 1.16-19.5 1.16-40.5 0-20.34-1.16-39.17-1.17-18.83-4.84-46.17h-206q-3.66 27.34-4.83 46.17-1.17 18.83-1.17 39.17 0 21 1.17 40.5t4.83 46.83ZM650-394h152q6.33-22.67 8.83-42.83 2.5-20.17 2.5-44.5 0-24.34-2.5-43.5-2.5-19.17-8.83-41.84H650.67q3 30 4.16 48.84Q656-499 656-481.33q0 21.66-1.5 41.16-1.5 19.5-4.5 46.17Zm-12-239.33h139.33Q745.67-696 692.83-739q-52.83-43-121.5-61.67Q594-765 610.17-724.5 626.33-684 638-633.33Zm-247.33 0h180q-11.34-50-35-96-23.67-46-55.67-83.34-30 30-51 72.34-21 42.33-38.33 107Zm-208 0h140Q333-682 348.83-722.17 364.67-762.33 388-800q-68.67 18.67-120.5 61t-84.83 105.67Z" />
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

  // Scoring
  const [sessionScore, setSessionScore] = useState({ x: 0, o: 0, d: 0 });
  const [globalStats, setGlobalStats] = useState({ xWins: 0, oWins: 0, draws: 0 });
  const [showGlobal, setShowGlobal] = useState(false);
  const processedWin = useRef<TTT | 'draw' | null>(null);

  const winner = useMemo(() => tttWinner(board), [board]);

  const winningLine = useMemo(() => {
    for (const [a, b, c] of tttLines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) return [a, b, c] as const;
    }
    return null;
  }, [board]);

  // Load Global Stats
  useEffect(() => {
    fetch('/api/tictactoe')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.xWins === 'number') setGlobalStats(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const reset = () => {
    setBoard(Array(9).fill(null));
    setXMoves([]);
    setOMoves([]);
    setTurn('X');
    setBusy(false);
    processedWin.current = null;
  };

  // Handle Win/Loss/Draw
  useEffect(() => {
    if (!winner) return;

    // Only process if this specific win hasn't been handled
    if (processedWin.current !== winner) {
      processedWin.current = winner;

      // Session
      setSessionScore((prev) => ({
        x: winner === 'X' ? prev.x + 1 : prev.x,
        o: winner === 'O' ? prev.o + 1 : prev.o,
        d: winner === 'draw' ? prev.d + 1 : prev.d,
      }));

      // Global
      fetch('/api/tictactoe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winner }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && typeof data.xWins === 'number') setGlobalStats(data);
        })
        .catch((err) => console.error(err));
    }

    setBusy(true);
    // Longer delay to see the result/score update
    const t = setTimeout(() => reset(), 2000);
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

              {/* Scoreboard */}
              <div className="mt-2 grid grid-cols-3 items-center text-[10px] font-medium select-none text-white/80">
                <div className="flex items-center justify-start gap-2">
                  {/* Dynamic Label: "User" (Session) vs "Users" (Global) */}
                  <span className="text-amber-300 font-bold flex items-center">
                    User
                    <motion.span
                      initial={false}
                      animate={{ width: showGlobal ? 'auto' : 0, opacity: showGlobal ? 1 : 0 }}
                      style={{ overflow: 'hidden', display: 'inline-block' }}
                    >
                      s
                    </motion.span>
                  </span>
                  <span className="bg-white/10 px-1.5 py-0.5 rounded text-white min-w-[20px] text-center">
                    {showGlobal ? globalStats.xWins : sessionScore.x}
                  </span>
                </div>

                <div className="text-white/30 tracking-widest text-[8px] uppercase text-center">
                  {winner ? (winner === 'draw' ? 'DRAW' : 'WINNER') : 'VS'}
                </div>

                <div className="flex items-center justify-end gap-2">
                  <span className="bg-white/10 px-1.5 py-0.5 rounded text-white min-w-[20px] text-center">
                    {showGlobal ? globalStats.oWins : sessionScore.o}
                  </span>
                  {/* Dynamic Label: Always "AI" per request */}
                  <span className="text-cyan-300 font-bold">AI</span>
                </div>
              </div>

              {/* Global Toggle - Chip Style */}
              <div className="mt-2.5 flex justify-center w-full">
                <button
                  onClick={() => setShowGlobal(!showGlobal)}
                  className="inline-flex items-center justify-center gap-1.5 px-2 py-1 rounded border border-white/10 bg-white/5 text-[9px] text-white/70 hover:bg-white/10 hover:text-white transition-colors uppercase tracking-wider group"
                >
                  {/* Text: "Session Stats" vs "Global Stats" */}
                  {showGlobal ? 'Global Stats' : 'Session Stats'}

                  {/* Icon: Always use Global Icon, colored if active */}
                  <IconGlobal
                    size={12}
                    className={`transition-all ${showGlobal ? 'text-amber-300 opacity-100' : 'text-white opacity-40 group-hover:opacity-80'}`}
                  />
                </button>
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

  // Check for mobile device to disable heavy layout transitions
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update fixed elements padding when scroll is locked
  useEffect(() => {
    if (!workModalLock) {
      document.documentElement.style.removeProperty('--scrollbar-padding');
      return;
    }

    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;

    // Prevent layout "hiccup" when locking/unlocking scroll (scrollbar width reflow).
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.documentElement.style.setProperty('--scrollbar-padding', `${scrollbarWidth}px`);
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeWorkCard();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
      document.documentElement.style.removeProperty('--scrollbar-padding');
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [workModalLock]);
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
        description: 'Designing and operating production networks that scale, segment, and recover under real load.',
        examples: [
          { title: 'Production Network Traffic and Client Visibility', description: 'This view represents a live production environment with sustained traffic volumes and a diverse client base across wired and wireless infrastructure. I manage end-to-end visibility into client behavior, bandwidth consumption, and application usage to ensure predictable performance and capacity planning. This network supports continuous utilization under load while maintaining stability, segmentation, and policy enforcement across devices and tenants.', imageSrc: `/assets/images/ni-p1.png?v=${ASSET_REV}` },
          { title: 'Enterprise Wireless Network Health and Optimization', description: 'This snapshot shows real-time wireless health metrics from a production enterprise WiFi deployment. I designed, deployed, and actively tune this environment to deliver fast client association, seamless roaming, strong signal quality, and low latency at scale. Ongoing monitoring and optimization ensure reliability for high-density usage while maintaining security, performance baselines, and operational headroom.', imageSrc: `/assets/images/ni-p2.png?v=${ASSET_REV}` },
          { title: 'Centralized Management of Large Scale Production Networks', description: 'This snapshot represents a subset of the production networks I actively manage and operate. From a centralized control plane, I oversee dozens of live environments supporting thousands of client connections, with consistent uptime, traffic flow, and policy enforcement. This view highlights standardized network architecture, continuous monitoring, and the ability to scale operations without sacrificing stability or visibility.', imageSrc: `/assets/images/ni-p3.png?v=${ASSET_REV}` },
        ],
      },
      {
        title: 'Website Development',
        category: 'WEB',
        description: 'Building real-world web applications with production constraints, not demo assumptions.',
        examples: [
          { title: 'Enterprise Consolidated Billing Platform', description: 'An in-progress enterprise billing platform designed to centralize vendor spend, invoices, and financial visibility across multiple services. The system includes real-time dashboards, spend analysis, and an AI-assisted advisor layer to surface cost anomalies, optimization opportunities, and usage trends. Built with scalability and extensibility in mind, this project focuses on turning fragmented billing data into actionable operational insight.', imageSrc: `/assets/images/wd-p1.jpg?v=${ASSET_REV}` },
          { title: 'B2B Partner Portal and Referral Platform', description: 'A live, production B2B web application built to support business partnerships at scale. The platform includes an analytics dashboard, referral lifecycle management, integrated support workflows, internal communication tools, role-based access control, and administrative oversight. Designed and implemented as a full end-to-end system, this application supports real users, real workflows, and ongoing operational use in production.', imageSrc: `/assets/images/wd-p2.png?v=${ASSET_REV}` },
          { title: 'Real Time Network Monitoring and Operations Platform', description: 'A live, internally developed monitoring platform used to operate and maintain production client networks. The interface shown contains censored and anonymized data to protect customer privacy and adhere to security and confidentiality requirements. The system aggregates ICMP, SNMP, NetFlow, and API based telemetry into a centralized view with real time health status, alerts, notifications, and historical metrics. While still under active development, this platform is already deployed in production and serves as a core operational tool for 24/7 monitoring and network visibility across dozens of sites.', imageSrc: `/assets/images/wd-p3.png?v=${ASSET_REV}` },
        ],
      },
      {
        title: 'Systems Thinking and Architecture',
        category: 'ARCHITECTURE',
        description: 'Making deliberate architectural decisions that reduce fragility and long-term operational cost.',
        examples: [
          { title: 'Intentional Network Topology and Segmentation', description: 'A live production network visualized end to end, showing deliberate segmentation across core routing, distribution, and access layers. Devices and services are grouped by function, not convenience, making dependencies explicit and reducing blast radius as the environment scales.', imageSrc: `/assets/images/sta-p1.png?v=${ASSET_REV}` },
          { title: 'Architecture Designed for Observability', description: 'Real-time visibility into multiple production sites with consistent latency, zero packet loss, and predictable performance. This view reflects architectural decisions that prioritize stability, monitoring, and early detection rather than reactive troubleshooting.', imageSrc: `/assets/images/sta-p2.png?v=${ASSET_REV}` },
          { title: 'Layer 3 Segmentation and Intent-Based Design', description: 'A production Layer 3 design illustrating intentional network segmentation by function rather than device. VLANs, subnets, routing, and policy are organized to isolate traffic domains, support external integrations, and maintain predictable behavior as the environment grows. Sensitive identifiers are intentionally censored to preserve security and privacy.', imageSrc: `/assets/images/sta-p3.png?v=${ASSET_REV}` },
        ],
      },
      {
        title: 'Operational Reliability',
        category: 'SECURITY',
        description: 'Operating imperfect systems in production and keeping them reliable anyway.',
        examples: [
          { title: 'High-Availability WAN and Failover Strategy', description: 'Production internet connectivity designed with explicit primary and secondary uplinks, continuous health validation, and automatic failover. Uptime and latency are monitored at the gateway level to ensure predictable behavior during provider degradation without manual intervention.', imageSrc: `/assets/images/or-p1.png?v=${ASSET_REV}` },
          { title: 'Reliability Through Imperfect Systems', description: 'Multi-site production monitoring that distinguishes between unavoidable degradation and actionable failure. Cellular failover links and unstable last-mile circuits are expected sources of packet loss and latency variance, yet uptime is preserved through redundancy, prioritization, and informed response rather than reactive intervention.', imageSrc: `/assets/images/or-p2.png?v=${ASSET_REV}` },
          { title: 'Signal-Driven Wireless Performance Analysis', description: 'Wireless health evaluated using per-band utilization and packet loss metrics to distinguish environmental constraints from actionable issues. This approach avoids reactive tuning and instead prioritizes remediation based on measurable impact and user experience, with degraded domains identified explicitly rather than hidden.', imageSrc: `/assets/images/or-p3.png?v=${ASSET_REV}` },
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
      <nav
        className={`fixed top-0 left-0 right-0 z-50 bg-[#FAFAFA]/95 backdrop-blur-sm transition-all duration-300 ${scrolled ? 'shadow-sm border-b border-[#9DB2BF]/30' : ''}`}
        style={{ paddingRight: 'var(--scrollbar-padding)' }}
      >
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
            <div className="flex items-center gap-2 sm:gap-3 pr-2">
              {/* Viewport Preview Dropdown (Disabled per user request) */}
              {/* <div className="relative">
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
              </div> */}
              <Tooltip content="GitHub" placement="bottom">
                <a href="https://github.com/colbywest5" target="_blank" rel="noopener noreferrer" className="text-[#26374D] hover:text-[#536D82] transition-colors p-1" aria-label="GitHub">
                  <Github size={16} className="sm:w-[18px] sm:h-[18px]" />
                </a>
              </Tooltip>
              <Tooltip content="LinkedIn" placement="bottom">
                <a href="https://www.linkedin.com/in/colby-west5/" target="_blank" rel="noopener noreferrer" className="text-[#26374D] hover:text-[#536D82] transition-colors p-1" aria-label="LinkedIn">
                  <LinkedInMark size={16} />
                </a>
              </Tooltip>
              <Tooltip content="Download Resume" placement="bottom">
                <a href="/api/resume" target="_blank" rel="noopener noreferrer" className="text-[#26374D] hover:text-[#536D82] transition-colors p-1" aria-label="Download Resume">
                  <DownloadMark size={22} />
                </a>
              </Tooltip>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16 sm:pt-20">
        {/* Subtle Background Effect - Force Render */}
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center overflow-hidden">
          <div
            className="relative w-[1400px] h-[1400px] translate-x-[20%] translate-y-[10%] sm:translate-x-[25%] sm:translate-y-[5%]"
            style={{ opacity: 0.08 }}
          >
            {/* Base Gradient: Deep Blue -> White/Light -> Deep Blue/Black */}
            <div
              className="absolute inset-0 blur-[80px]"
              style={{
                background: 'conic-gradient(from 225deg at 50% 50%, #020617 0deg, #1e3a8a 100deg, #e2e8f0 180deg, #1e3a8a 260deg, #020617 360deg)'
              }}
            />
            {/* Dot Matrix Overlay */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(#1e293b 2px, transparent 2px)',
                backgroundSize: '24px 24px',
                maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
                WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)'
              }}
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full relative z-10">
          <div className="grid grid-cols-12 gap-6 md:gap-8 items-center">
            {/* Left Column - Text */}
            <motion.div
              style={{ y: yTransform }}
              className="col-span-12 md:col-span-6 lg:col-span-7 space-y-6 md:space-y-8"
            >
              <div className="space-y-3 md:space-y-4">
                <div className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-[#536D82] font-mono">Colby West</div>
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
                    {...(!isMobile ? { layoutId: `work-card-${idx}` } : {})}
                    {...(!isMobile ? { layout: true } : {})}
                    transition={{ type: 'spring', stiffness: 220, damping: 25, mass: 1 }}
                    className="group bg-white border border-[#9DB2BF]/30 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
                    role="button"
                    tabIndex={0}
                    onClick={() => openWorkCard(idx)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') openWorkCard(idx);
                    }}
                    style={{ cursor: 'pointer', borderRadius: '1rem' }}
                  >
                    <div className="p-8 sm:p-10 md:p-12">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="text-xs font-medium uppercase tracking-wider text-[#536D82] mb-2">{project.category}</div>
                          <h3 className="text-xl sm:text-2xl font-bold text-[#26374D] mb-3">{project.title}</h3>
                          <p className="text-sm sm:text-base text-[#536D82] leading-relaxed">{project.description}</p>
                        </div>
                        <div className="text-[#536D82] shrink-0 relative w-[18px] h-[18px]">
                          <ClosedEye size={18} className="absolute inset-0 opacity-100 group-hover:opacity-0 transition-opacity duration-300" />
                          <Eye size={18} className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                        {...(!isMobile ? { layoutId: `work-card-${expandedCard}` } : {})}
                        transition={{ type: 'spring', stiffness: 220, damping: 25, mass: 1 }}
                        className="w-full max-w-6xl bg-white border border-[#9DB2BF]/30 rounded-2xl overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.35)]"
                        onClick={(e) => e.stopPropagation()}
                        style={{ borderRadius: '1rem' }}
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
      </section >

      {/* About Section */}
      < section id="about" className="min-h-screen py-16 sm:py-24 md:py-32 bg-[#FAFAFA]" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-12 gap-6 md:gap-8">
            <div className="col-span-12 md:col-span-4">
              <div className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-[#536D82] mb-3 sm:mb-4">About</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-[#26374D]">Professional<br />Background</h2>
            </div>
            <div className="col-span-12 md:col-span-8">
              <div className="bg-white p-8 sm:p-12 border border-[#9DB2BF]/30 rounded-lg">
                <p className="text-sm sm:text-base text-[#536D82] leading-relaxed">
                  I operate and build production systems with a focus on reliability, security, and long-term maintainability. My background spans network operations, security-focused infrastructure, and hands-on troubleshooting in environments where uptime matters and failures are visible. I prioritize clear architecture, predictable behavior, and communication that works across technical and non-technical teams.
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
                      title: 'Network Architecture and Operations',
                      bullets: [
                        'Enterprise LAN and WAN design, segmentation, QoS, and multi-site resiliency.',
                        'Production experience operating and scaling high-availability networks.',
                      ],
                    },
                    {
                      icon: <ShieldCheck size={14} />,
                      title: 'Security and Risk Engineering',
                      bullets: [
                        'Firewall policy, VPNs, and pragmatic security controls.',
                        'Hands-on compliance work across HIPAA, GLBA, and PCI DSS environments.',
                      ],
                    },
                    {
                      icon: <Building2 size={14} />,
                      title: 'Production Operations',
                      bullets: [
                        'Incident response, escalations, and root cause analysis in high-tempo environments.',
                        'Strong change control and SLA driven execution across multiple clients.',
                      ],
                    },
                    {
                      icon: <Code2 size={14} />,
                      title: 'Automation and Standardization',
                      bullets: [
                        'PowerShell and API automation to reduce manual effort.',
                        'Repeatable deployments, configuration standards, and runbooks.',
                      ],
                    },
                    {
                      icon: <Briefcase size={14} />,
                      title: 'Technical Leadership',
                      bullets: [
                        'Clear technical decision making and documentation.',
                        'Effective communication with engineers, leadership, and end users.',
                      ],
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

                <div className="mt-8 pt-8 border-t border-[#9DB2BF]/20">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#536D82] mb-4">Platforms & Ecosystems</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Cisco',
                      'Meraki',
                      'Aruba',
                      'UniFi',
                      'Peplink (InControl 2)',
                      'FortiGate',
                      'Huntress',
                      'ThreatLocker',
                      'Identity & Access (MFA)',
                      'Microsoft 365 (Identity, Security, Admin)',
                      'Linux',
                      'VMware',
                      'Hyper-V',
                      'Azure',
                      'ConnectWise ScreenConnect',
                      'RMM & PSA Platforms',
                      'Pax8',
                      'Telecommunications',
                    ].map((item) => (
                      <span
                        key={item}
                        className="px-2.5 py-1 bg-[#FAFAFA] border border-[#9DB2BF]/30 rounded text-xs font-medium text-[#536D82] hover:bg-white hover:border-[#9DB2BF]/50 transition-colors cursor-default"
                      >
                        {item}
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
                If you’re working on networks, security, or modern web applications, I’m happy to collaborate. I bring experience designing systems, implementing solutions, and cleaning up environments that need attention.
                <br></br><br></br>Clear communication and thoughtful execution come standard.
              </p>

              <div className="mt-6 space-y-3">
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
                  <a
                    href="/api/resume"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs sm:text-sm font-semibold text-white/90 hover:bg-white/10 hover:border-white/25 transition-colors"
                    aria-label="Download Resume"
                  >
                    <DownloadMark size={20} />
                    Resume
                  </a>
                </div>
              </div>

              <div className="text-xs text-white/60 mt-4">
                Links for quick context.
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
        </div >
      </section >

      {/* Mobile Preview Overlay */}
      {
        !isInIframe && viewportType === 'mobile' && mobilePreviewUrl && (
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
        )
      }

      {/* Footer */}
      <footer className="bg-[#FAFAFA]/95 backdrop-blur-sm border-t border-[#9DB2BF]/30 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 md:py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4 text-[10px] sm:text-xs">
            {/* Left Column */}
            <div className="text-[#536D82] text-center sm:text-left">
              © {new Date().getFullYear()} Colby West. All rights reserved.
            </div>
            {/* Center Column */}
            <div className="text-[#536D82] text-center">
              Developed with ❤︎ by Colby West
            </div>
            {/* Right Column */}
            <div className="flex items-center justify-center sm:justify-end gap-3 sm:gap-4">
              <Tooltip content="GitHub">
                <a
                  href="https://github.com/colbywest5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#26374D] hover:text-[#536D82] transition-colors"
                  aria-label="GitHub"
                >
                  <Github size={16} className="sm:w-[18px] sm:h-[18px]" />
                </a>
              </Tooltip>
              <Tooltip content="LinkedIn">
                <a
                  href="https://www.linkedin.com/in/colby-west5/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#26374D] hover:text-[#536D82] transition-colors"
                  aria-label="LinkedIn"
                >
                  <LinkedInMark size={16} />
                </a>
              </Tooltip>
              <Tooltip content="Download Resume">
                <a
                  href="/api/resume"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#26374D] hover:text-[#536D82] transition-colors"
                  aria-label="Download Resume"
                >
                  <DownloadMark size={22} />
                </a>
              </Tooltip>
            </div>
          </div>
        </div>
      </footer>
    </main >
  );
}
