import React from 'react';
import { Tag } from '../types';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface TagBadgeProps {
    tag: Tag;
    onRemove?: () => void;
    className?: string;
    size?: 'sm' | 'md';
}

export function TagBadge({ tag, onRemove, className, size = 'md' }: TagBadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 rounded-full font-medium transition-all",
                size === 'sm' ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
                className
            )}
            style={{
                backgroundColor: `${tag.color}20`, // 20% opacity
                color: tag.color,
                border: `1px solid ${tag.color}40`
            }}
        >
            {tag.name}
            {onRemove && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
                >
                    <X className="w-3 h-3" />
                </button>
            )}
        </span>
    );
}
