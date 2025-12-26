'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface TooltipProps {
    content: string;
    placement?: 'top' | 'bottom';
    children: React.ReactNode;
}

export const Tooltip = ({ content, placement = 'top', children }: TooltipProps) => {
    const [isVisible, setIsVisible] = useState(false);

    const isTop = placement === 'top';

    return (
        <div
            className="relative flex items-center justify-center"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            onFocus={() => setIsVisible(true)}
            onBlur={() => setIsVisible(false)}
        >
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: isTop ? 5 : -5, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: isTop ? 5 : -5, scale: 0.9 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className={`absolute ${isTop ? 'bottom-full mb-2' : 'top-full mt-2'} px-2.5 py-1 text-xs font-semibold text-white bg-gray-900 rounded shadow-lg whitespace-nowrap z-50 pointer-events-none`}
                    >
                        {content}
                        {/* Arrow */}
                        <div
                            className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45 ${isTop ? 'top-full -mt-1' : 'bottom-full -mb-1'}`}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            {children}
        </div>
    );
};
