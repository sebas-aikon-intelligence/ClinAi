"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface LiquidCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    intensity?: 'low' | 'medium' | 'high'; // Kept for backward compatibility, though liquid style is opinionated
}

export const LiquidCard: React.FC<LiquidCardProps> = ({
    children,
    className,
    intensity = 'medium',
    ...props
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={cn(
                "liquid-card relative overflow-hidden p-6 md:p-8", // added default padding
                className
            )}
            {...props}
        >
            {/* Specular Highlight / Shine effect */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50" />

            {/* Content */}
            <div className="relative z-10 h-full">
                {children}
            </div>

            {/* Subtle inner glow for depth */}
            <div className="absolute inset-0 rounded-[2rem] shadow-inner-light pointer-events-none" />
        </motion.div>
    );
};
