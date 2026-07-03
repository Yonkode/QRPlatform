export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-gradient-signal text-white">
                <svg viewBox="0 0 21 21" className="size-4.5">
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
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate font-display leading-tight font-semibold">
                    QR<span className="text-gradient-signal">Platform</span>
                </span>
            </div>
        </>
    );
}