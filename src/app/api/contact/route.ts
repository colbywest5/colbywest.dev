import { NextRequest, NextResponse } from 'next/server';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mojakpbz';
const TURNSTILE_VERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function POST(req: Request) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: 'TURNSTILE_SECRET_KEY is not configured.' },
      { status: 500 }
    );
  }

  let body: { fullname?: string; email?: string; message?: string; turnstileToken?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON.' }, { status: 400 });
  }

  const { fullname, email, message, turnstileToken } = body;
  if (!fullname || !email || !message) {
    return NextResponse.json({ ok: false, error: 'Missing required fields.' }, { status: 400 });
  }

  // Security: Enforce length limits to prevent payload attacks
  if (fullname.length > 100) return NextResponse.json({ ok: false, error: 'Name too long.' }, { status: 400 });
  if (email.length > 100) return NextResponse.json({ ok: false, error: 'Email too long.' }, { status: 400 });
  if (message.length > 5000) return NextResponse.json({ ok: false, error: 'Message too long.' }, { status: 400 });

  if (!turnstileToken) {
    return NextResponse.json({ ok: false, error: 'Captcha required.' }, { status: 400 });
  }

  // Verify Turnstile
  const verifyForm = new URLSearchParams();
  verifyForm.set('secret', secret);
  verifyForm.set('response', turnstileToken);

  const verifyRes = await fetch(TURNSTILE_VERIFY, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: verifyForm.toString(),
  });

  if (!verifyRes.ok) {
    return NextResponse.json({ ok: false, error: 'Captcha verification failed.' }, { status: 502 });
  }

  const verifyJson = (await verifyRes.json()) as { success?: boolean };
  if (!verifyJson.success) {
    return NextResponse.json({ ok: false, error: 'Captcha rejected.' }, { status: 400 });
  }

  // Forward to Formspree
  const forwardForm = new URLSearchParams();
  forwardForm.set('fullname', fullname);
  forwardForm.set('email', email);
  forwardForm.set('message', message);

  const forwardRes = await fetch(FORMSPREE_ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', accept: 'application/json' },
    body: forwardForm.toString(),
  });

  if (!forwardRes.ok) {
    const details = await forwardRes.text().catch(() => '');
    const msg =
      process.env.NODE_ENV === 'development'
        ? `Message service error (${forwardRes.status}). ${details}`.slice(0, 400)
        : 'Message service error.';
    return NextResponse.json({ ok: false, error: msg }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}


