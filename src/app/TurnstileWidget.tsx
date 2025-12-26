'use client';

import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          theme?: 'light' | 'dark' | 'auto';
          callback?: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export default function TurnstileWidget({
  siteKey,
  onToken,
  theme = 'dark',
}: {
  siteKey: string | undefined;
  onToken: (token: string | null) => void;
  theme?: 'light' | 'dark' | 'auto';
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!siteKey) return;
    if (!hostRef.current) return;

    let cancelled = false;

    const tryRender = () => {
      if (cancelled) return;
      if (!hostRef.current) return;
      if (!window.turnstile?.render) {
        // Wait until the script loads
        requestAnimationFrame(tryRender);
        return;
      }

      // Clear any prior widget
      if (widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
        widgetIdRef.current = null;
      }

      widgetIdRef.current = window.turnstile.render(hostRef.current, {
        sitekey: siteKey,
        theme,
        callback: (t) => onToken(t),
        'expired-callback': () => onToken(null),
        'error-callback': () => onToken(null),
      });
    };

    tryRender();

    return () => {
      cancelled = true;
      if (widgetIdRef.current) {
        try {
          window.turnstile?.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, theme, onToken]);

  if (!siteKey) {
    return (
      <div className="text-xs text-white/60">
        CAPTCHA not configured. Set <span className="font-semibold">NEXT_PUBLIC_TURNSTILE_SITE_KEY</span>.
      </div>
    );
  }

  return <div ref={hostRef} className="min-h-[65px]" />;
}


