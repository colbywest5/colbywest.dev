'use client';

import { useEffect } from 'react';

/**
 * Dev-only filter to silence noisy Next.js "sync dynamic APIs" warnings that can be triggered
 * by React DevTools / element inspectors enumerating props during hover/inspect.
 */
export default function ConsoleNoiseFilter() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const ignore = (args: unknown[]) => {
      const text = args
        .map((a) => {
          if (typeof a === 'string') return a;
          try {
            return JSON.stringify(a);
          } catch {
            return String(a);
          }
        })
        .join(' ');

      return (
        text.includes('params are being enumerated') ||
        text.includes('searchParams') && text.includes('is a Promise') ||
        text.includes('The keys of `searchParams` were accessed directly') ||
        text.includes('`params` is a Promise and must be unwrapped with `React.use()`')
      );
    };

    const origError = console.error;
    const origWarn = console.warn;

    console.error = (...args: any[]) => {
      if (ignore(args)) return;
      origError(...args);
    };

    console.warn = (...args: any[]) => {
      if (ignore(args)) return;
      origWarn(...args);
    };

    return () => {
      console.error = origError;
      console.warn = origWarn;
    };
  }, []);

  return null;
}


