import React from 'react';

interface CardProps {
    children: React.ReactNode;
    /** Apply festive glow effect */
    festive?: boolean;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Reusable Card component with glass morphism styling
 * Replaces repeated "glass soft-card rounded-3xl" patterns
 */
export default function Card({ children, festive = false, className = '' }: CardProps) {
    return (
        <div
            className={`glass soft-card rounded-3xl ${festive ? 'festive-glow' : ''} ${className}`}
        >
            {children}
        </div>
    );
}
