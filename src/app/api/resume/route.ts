import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Simple in-memory rate limiter using a Map
// Key: IP address, Value: { count: number, startTime: number }
const rateLimitMap = new Map<string, { count: number; startTime: number }>();

const RATE_LIMIT = 10; // Max downloads
const TIME_WINDOW = 60 * 60 * 1000; // 1 hour in millseconds

export async function GET(request: NextRequest) {
    // 1. Get IP address
    // In generic Node/Next, req.ip works. In Docker/Proxy, might need 'x-forwarded-for'.
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    // 2. Check Rate Limit
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (record) {
        if (now - record.startTime < TIME_WINDOW) {
            if (record.count >= RATE_LIMIT) {
                return new NextResponse('Too Many Requests', { status: 429 });
            }
            record.count++;
        } else {
            // Reset window
            rateLimitMap.set(ip, { count: 1, startTime: now });
        }
    } else {
        rateLimitMap.set(ip, { count: 1, startTime: now });
    }

    // 3. Serve File
    try {
        const filePath = path.join(process.cwd(), 'private', 'resume.pdf');

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return new NextResponse('Resume not found on server.', { status: 404 });
        }

        const fileBuffer = fs.readFileSync(filePath);

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="Colby_West_Resume.pdf"',
            },
        });
    } catch (error) {
        console.error('Error serving resume:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
