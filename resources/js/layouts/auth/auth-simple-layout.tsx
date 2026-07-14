import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="mb-1 flex size-10 items-center justify-center rounded-md bg-gradient-signal text-white">
                                <svg viewBox="0 0 21 21" className="size-5">
                                    <rect x="1" y="1" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
                                    <rect x="3.5" y="3.5" width="2" height="2" fill="currentColor" />
                                    <rect x="13" y="1" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
                                    <rect x="15.5" y="3.5" width="2" height="2" fill="currentColor" />
                                    <rect x="1" y="13" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
                                    <rect x="3.5" y="15.5" width="2" height="2" fill="currentColor" />
                                    <rect x="13" y="13" width="2" height="2" fill="currentColor" />
                                    <rect x="16" y="13" width="2" height="2" fill="currentColor" />
                                    <rect x="13" y="16" width="2" height="2" fill="currentColor" />
                                    <rect x="18" y="16" width="2" height="2" fill="currentColor" />
                                    <rect x="16" y="18" width="2" height="2" fill="currentColor" />
                                </svg>
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="font-display text-xl font-medium">{title}</h1>
                            <p className="text-center text-sm text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}