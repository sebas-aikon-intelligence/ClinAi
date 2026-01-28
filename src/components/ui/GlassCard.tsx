import React from 'react';
import { LiquidCard } from './LiquidCard';

interface GlassCardProps extends React.ComponentProps<typeof LiquidCard> {
    variant?: 'default' | 'hover' | 'interactive';
}

/**
 * @deprecated Use LiquidCard directly for new components.
 * This adapter ensures backward compatibility while upgrading UI to Liquid Glass.
 */
export function GlassCard({
    children,
    className,
    variant,
    ...props
}: GlassCardProps) {
    // Map existing variants to simple LiquidCard usage
    // LiquidCard has built-in hover states that replace 'hover'/'interactive' variants
    return (
        <LiquidCard
            className={className}
            {...props}
        >
            {children}
        </LiquidCard>
    );
}
