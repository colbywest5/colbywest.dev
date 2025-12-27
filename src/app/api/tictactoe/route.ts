import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to the data file. 
// In a real production environment (Vercel, etc.), writing to the filesystem at runtime 
// is often ephemeral or not allowed. However, for a local/VPS setup or persistent volume, this works.
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'tictactoe-stats.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface Stats {
    xWins: number;
    oWins: number;
    draws: number;
}

function getStats(): Stats {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            const initial: Stats = { xWins: 0, oWins: 0, draws: 0 };
            fs.writeFileSync(DATA_FILE, JSON.stringify(initial));
            return initial;
        }
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(data) as Stats;
    } catch (error) {
        console.error('Failed to read stats:', error);
        return { xWins: 0, oWins: 0, draws: 0 };
    }
}

function saveStats(stats: Stats) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(stats, null, 2));
    } catch (error) {
        console.error('Failed to save stats:', error);
    }
}

export async function GET() {
    const stats = getStats();
    return NextResponse.json(stats);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { winner } = body; // 'X' | 'O' | 'draw'

        if (!winner || !['X', 'O', 'draw'].includes(winner)) {
            return NextResponse.json({ error: 'Invalid winner' }, { status: 400 });
        }

        const stats = getStats();

        if (winner === 'X') stats.xWins++;
        else if (winner === 'O') stats.oWins++;
        else if (winner === 'draw') stats.draws++;

        saveStats(stats);

        return NextResponse.json(stats);
    } catch (error) {
        console.error('Error updating stats:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
