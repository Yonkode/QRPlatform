import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface FinderFrameProps {
    children: ReactNode;
    /** Affiche la ligne de scan animée au montage (pour les aperçus de QR code). */
    scanLine?: boolean;
    className?: string;
}

/**
 * Enveloppe une carte avec le motif signature de la plateforme :
 * des coins de repérage inspirés des marqueurs de position d'un QR code,
 * qui s'allument en dégradé au survol — comme un scanner qui se cale
 * sur le code.
 */
export function FinderFrame({ children, scanLine = false, className }: FinderFrameProps) {
    return (
        <div
            className={cn(
                'finder-frame rounded-xl border border-border bg-card',
                scanLine && 'scan-line overflow-hidden',
                className,
            )}
        >
            {children}
        </div>
    );
}