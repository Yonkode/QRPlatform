import { Head, Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    LayoutDashboard,
    LogIn,
    QrCode,
    ShieldCheck,
    UserPlus,
} from 'lucide-react';
import { FinderFrame } from '@/components/finder-frame';
import { Button } from '@/components/ui/button';
import { dashboard, login, register } from '@/routes';

const FEATURES = [
    {
        icon: QrCode,
        title: 'Génère en quelques secondes',
        description:
            'Site web, WiFi, carte de visite ou document — choisis un type et obtiens ton code, statique ou dynamique.',
    },
    {
        icon: BarChart3,
        title: 'Suis chaque scan',
        description:
            "Date, appareil, localisation approximative : l'historique complet de qui a scanné, où et quand.",
    },
    {
        icon: ShieldCheck,
        title: 'Garde le contrôle',
        description:
            "Fixe une limite de scans, mets-la à jour à tout moment, et suis l'activité en toute traçabilité.",
    },
];

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Accueil" />

            <div className="flex min-h-screen flex-col bg-background text-foreground lg:h-screen lg:overflow-hidden">
                <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-8 pb-5 lg:pt-10">
                    <span className="font-display text-2xl font-semibold">
                        QR<span className="text-gradient-signal">Platform</span>
                    </span>

                    <nav className="flex items-center gap-2 sm:gap-3">
                        {auth.user ? (
                            <Button asChild>
                                <Link href={dashboard()}>
                                    <LayoutDashboard className="size-4" />
                                    Mon tableau de bord
                                </Link>
                            </Button>
                        ) : (
                            <>
                                <Button variant="ghost" asChild>
                                    <Link href={login()}>
                                        <LogIn className="size-4" />
                                        Se connecter
                                    </Link>
                                </Button>
                                <Button asChild>
                                    <Link href={register()}>
                                        <UserPlus className="size-4" />
                                        Créer un compte
                                    </Link>
                                </Button>
                            </>
                        )}
                    </nav>
                </header>

                <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-10 px-6 py-8 lg:py-0">
                    <div className="grid items-center gap-10 lg:grid-cols-2">
                        <div>
                            <h1 className="font-display text-4xl leading-tight font-semibold text-balance lg:text-5xl">
                                Créez vos QR codes.{' '}
                                <span className="text-gradient-signal">
                                    Suivez chaque scan.
                                </span>
                            </h1>
                            <p className="mt-4 max-w-md text-muted-foreground">
                                La plateforme pour générer des QR codes
                                dynamiques, fixer une limite de scans et
                                consulter l'historique complet des visites —
                                depuis un seul tableau de bord.
                            </p>
                            <div className="mt-7 flex gap-3">
                                <Button size="lg" asChild>
                                    <Link
                                        href={
                                            auth.user ? dashboard() : register()
                                        }
                                    >
                                        Commencer gratuitement
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="mx-auto w-full max-w-96">
                            <QrPreviewMark />
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-3">
                        {FEATURES.map((feature) => (
                            <FinderFrame key={feature.title} className="p-5">
                                <feature.icon className="size-5 text-signal" />
                                <h2 className="mt-3 font-display text-base font-semibold">
                                    {feature.title}
                                </h2>
                                <p className="mt-1.5 text-sm text-muted-foreground">
                                    {feature.description}
                                </p>
                            </FinderFrame>
                        ))}
                    </div>
                </main>
            </div>
        </>
    );
}

const QR_MATRIX = [
    '111111100001101111111',
    '100000101000101000001',
    '101110101110001011101',
    '101110101110001011101',
    '101110100100101011101',
    '100000100111001000001',
    '111111101010101111111',
    '000000001010000000000',
    '100000101011011001110',
    '100101011001110010011',
    '101101111100101100111',
    '110011000101111101001',
    '010001100111111010010',
    '000000001110100101100',
    '111111100001010010110',
    '100000100110001011111',
    '101110100101010011010',
    '101110100101111101100',
    '101110100011110000011',
    '100000100001111101001',
    '111111101000100001100',
];

const SIZE = 21;
const CELL = 100 / SIZE;

type Coord = [number, number];

/**
 * Tour complet : chaque segment est un vrai parcours (DFS) qui visite
 * TOUTES les dalles d'une zone connectée du QR code (les 28 zones du
 * code, des plus grandes aux cases isolées), sans jamais s'arrêter en
 * boucle sur les deux mêmes cases. Un saut en fondu n'a lieu qu'au
 * changement de zone (elles ne sont pas physiquement reliées).
 */
const FULL_TOUR: Coord[][] = [
    [
        [4, 11],
        [5, 11],
        [5, 10],
        [5, 9],
        [5, 10],
        [6, 10],
        [7, 10],
        [7, 9],
        [8, 9],
        [8, 8],
        [8, 7],
        [8, 6],
        [8, 7],
        [8, 8],
        [8, 9],
        [8, 10],
        [9, 10],
        [9, 11],
        [9, 12],
        [9, 13],
        [8, 13],
        [9, 13],
        [10, 13],
        [10, 12],
        [11, 12],
        [11, 11],
        [12, 11],
        [12, 10],
        [12, 9],
        [11, 9],
        [11, 8],
        [10, 8],
        [10, 7],
        [10, 6],
        [10, 5],
        [9, 5],
        [9, 4],
        [9, 3],
        [8, 3],
        [8, 2],
        [8, 1],
        [8, 2],
        [9, 2],
        [10, 2],
        [10, 3],
        [10, 2],
        [9, 2],
        [8, 2],
        [8, 3],
        [9, 3],
        [9, 4],
        [9, 5],
        [10, 5],
        [11, 5],
        [10, 5],
        [10, 6],
        [10, 7],
        [10, 8],
        [11, 8],
        [11, 9],
        [12, 9],
        [13, 9],
        [13, 8],
        [14, 8],
        [13, 8],
        [13, 9],
        [12, 9],
        [12, 10],
        [12, 11],
        [12, 12],
        [12, 13],
        [12, 12],
        [13, 12],
        [13, 11],
        [14, 11],
        [14, 10],
        [15, 10],
        [15, 11],
        [15, 10],
        [14, 10],
        [14, 11],
        [14, 12],
        [14, 11],
        [13, 11],
        [13, 12],
        [12, 12],
        [12, 11],
        [11, 11],
        [11, 12],
        [10, 12],
        [10, 13],
        [9, 13],
        [9, 12],
        [9, 11],
        [9, 10],
        [8, 10],
        [8, 9],
        [7, 9],
        [7, 10],
        [6, 10],
        [5, 10],
        [5, 11],
        [5, 12],
        [6, 12],
        [5, 12],
        [5, 11],
        [4, 11],
    ],
    [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
        [0, 4],
        [0, 5],
        [0, 6],
        [1, 6],
        [2, 6],
        [3, 6],
        [4, 6],
        [5, 6],
        [6, 6],
        [6, 5],
        [6, 4],
        [6, 3],
        [6, 2],
        [6, 1],
        [6, 0],
        [5, 0],
        [4, 0],
        [3, 0],
        [2, 0],
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
        [5, 0],
        [6, 0],
        [6, 1],
        [6, 2],
        [6, 3],
        [6, 4],
        [6, 5],
        [6, 6],
        [5, 6],
        [4, 6],
        [3, 6],
        [2, 6],
        [1, 6],
        [0, 6],
        [0, 5],
        [0, 4],
        [0, 3],
        [0, 2],
        [0, 1],
        [0, 0],
    ],
    [
        [14, 0],
        [14, 1],
        [14, 2],
        [14, 3],
        [14, 4],
        [14, 5],
        [14, 6],
        [15, 6],
        [16, 6],
        [17, 6],
        [18, 6],
        [19, 6],
        [20, 6],
        [20, 5],
        [20, 4],
        [20, 3],
        [20, 2],
        [20, 1],
        [20, 0],
        [19, 0],
        [18, 0],
        [17, 0],
        [16, 0],
        [15, 0],
        [16, 0],
        [17, 0],
        [18, 0],
        [19, 0],
        [20, 0],
        [20, 1],
        [20, 2],
        [20, 3],
        [20, 4],
        [20, 5],
        [20, 6],
        [19, 6],
        [18, 6],
        [17, 6],
        [16, 6],
        [15, 6],
        [14, 6],
        [14, 5],
        [14, 4],
        [14, 3],
        [14, 2],
        [14, 1],
        [14, 0],
    ],
    [
        [0, 14],
        [0, 15],
        [0, 16],
        [0, 17],
        [0, 18],
        [0, 19],
        [0, 20],
        [1, 20],
        [2, 20],
        [3, 20],
        [4, 20],
        [5, 20],
        [6, 20],
        [6, 19],
        [6, 18],
        [6, 17],
        [6, 16],
        [6, 15],
        [6, 14],
        [5, 14],
        [4, 14],
        [3, 14],
        [2, 14],
        [1, 14],
        [2, 14],
        [3, 14],
        [4, 14],
        [5, 14],
        [6, 14],
        [6, 15],
        [6, 16],
        [6, 17],
        [6, 18],
        [6, 19],
        [6, 20],
        [5, 20],
        [4, 20],
        [3, 20],
        [2, 20],
        [1, 20],
        [0, 20],
        [0, 19],
        [0, 18],
        [0, 17],
        [0, 16],
        [0, 15],
        [0, 14],
    ],
    [
        [10, 18],
        [11, 18],
        [11, 17],
        [11, 16],
        [11, 17],
        [12, 17],
        [12, 18],
        [12, 19],
        [11, 19],
        [12, 19],
        [12, 20],
        [12, 19],
        [13, 19],
        [13, 18],
        [13, 17],
        [13, 16],
        [13, 17],
        [14, 17],
        [15, 17],
        [14, 17],
        [13, 17],
        [13, 18],
        [13, 19],
        [14, 19],
        [15, 19],
        [14, 19],
        [13, 19],
        [12, 19],
        [12, 18],
        [12, 17],
        [11, 17],
        [11, 18],
        [10, 18],
    ],
    [
        [16, 14],
        [16, 15],
        [16, 16],
        [17, 16],
        [17, 15],
        [18, 15],
        [18, 14],
        [18, 13],
        [17, 13],
        [18, 13],
        [18, 14],
        [19, 14],
        [19, 15],
        [19, 16],
        [19, 15],
        [20, 15],
        [19, 15],
        [19, 14],
        [18, 14],
        [18, 15],
        [17, 15],
        [17, 16],
        [17, 17],
        [18, 17],
        [17, 17],
        [17, 16],
        [16, 16],
        [16, 15],
        [16, 14],
    ],
    [
        [2, 2],
        [2, 3],
        [2, 4],
        [3, 4],
        [3, 3],
        [3, 2],
        [4, 2],
        [4, 3],
        [4, 4],
        [4, 3],
        [4, 2],
        [3, 2],
        [3, 3],
        [3, 4],
        [2, 4],
        [2, 3],
        [2, 2],
    ],
    [
        [16, 2],
        [16, 3],
        [16, 4],
        [17, 4],
        [17, 3],
        [17, 2],
        [18, 2],
        [18, 3],
        [18, 4],
        [18, 3],
        [18, 2],
        [17, 2],
        [17, 3],
        [17, 4],
        [16, 4],
        [16, 3],
        [16, 2],
    ],
    [
        [17, 8],
        [18, 8],
        [19, 8],
        [19, 9],
        [19, 10],
        [18, 10],
        [19, 10],
        [20, 10],
        [20, 9],
        [20, 10],
        [20, 11],
        [20, 10],
        [19, 10],
        [19, 9],
        [19, 8],
        [18, 8],
        [17, 8],
    ],
    [
        [2, 16],
        [2, 17],
        [2, 18],
        [3, 18],
        [3, 17],
        [3, 16],
        [4, 16],
        [4, 17],
        [4, 18],
        [4, 17],
        [4, 16],
        [3, 16],
        [3, 17],
        [3, 18],
        [2, 18],
        [2, 17],
        [2, 16],
    ],
    [
        [0, 8],
        [0, 9],
        [0, 10],
        [0, 11],
        [1, 11],
        [1, 12],
        [1, 11],
        [0, 11],
        [0, 10],
        [0, 9],
        [0, 8],
    ],
    [
        [9, 15],
        [9, 16],
        [9, 17],
        [9, 16],
        [9, 15],
        [10, 15],
        [9, 15],
    ],
    [
        [11, 0],
        [12, 0],
        [12, 1],
        [12, 0],
        [11, 0],
    ],
    [
        [2, 10],
        [3, 10],
        [3, 9],
        [3, 10],
        [2, 10],
    ],
    [
        [19, 18],
        [20, 18],
        [20, 19],
        [20, 18],
        [19, 18],
    ],
    [
        [17, 19],
        [17, 20],
        [18, 20],
        [17, 20],
        [17, 19],
    ],
    [[12, 4]],
    [[12, 6]],
    [[6, 8]],
    [[16, 9]],
    [[17, 11]],
    [[16, 12]],
    [[19, 12]],
    [[15, 13]],
    [[11, 14]],
    [[13, 14]],
    [[14, 15]],
    [[8, 20]],
];

function buildWalkKeyframes(
    name: string,
    segments: Coord[][],
): string {
    type Checkpoint = { x: number; y: number; jump: boolean };

    const checkpoints: Checkpoint[] = [];
    segments.forEach((seg, si) => {
        seg.forEach(([x, y], pi) => {
            checkpoints.push({ x, y, jump: pi === 0 && si > 0 });
        });
    });
    checkpoints.push({ ...checkpoints[0], jump: true });

    const n = checkpoints.length - 1;
    const slot = 100 / n;
    const stops: string[] = [];

    const pct = (cp: Checkpoint) => ({
        left: ((cp.x + 0.5) * CELL).toFixed(3),
        top: ((cp.y + 0.5) * CELL).toFixed(3),
    });

    const start = pct(checkpoints[0]);
    stops.push(`0% { left: ${start.left}%; top: ${start.top}%; opacity: 1; }`);

    for (let i = 1; i < checkpoints.length; i++) {
        const cp = checkpoints[i];
        const end = i * slot;
        const p = pct(cp);

        if (cp.jump) {
            const prevPos = pct(checkpoints[i - 1]);
            const fadeOut = (end - slot * 0.6).toFixed(2);
            const swap = (end - slot * 0.3).toFixed(2);
            stops.push(
                `${fadeOut}% { left: ${prevPos.left}%; top: ${prevPos.top}%; opacity: 0; }`,
            );
            stops.push(
                `${swap}% { left: ${p.left}%; top: ${p.top}%; opacity: 0; }`,
            );
            stops.push(
                `${end.toFixed(2)}% { left: ${p.left}%; top: ${p.top}%; opacity: 1; }`,
            );
        } else {
            stops.push(
                `${end.toFixed(2)}% { left: ${p.left}%; top: ${p.top}%; opacity: 1; }`,
            );
        }
    }

    return `@keyframes ${name} { ${stops.join(' ')} }`;
}

const TOUR_DURATION = 46; // secondes pour parcourir TOUT le QR code une fois
const POINT_COUNT = 4;
const singleKeyframes = buildWalkKeyframes('walk-tour', FULL_TOUR);

function QrPreviewMark() {
    return (
        <div className="relative aspect-square w-full">
            <style dangerouslySetInnerHTML={{ __html: singleKeyframes }} />

            <svg viewBox="0 0 21 21" className="h-full w-full text-signal">
                {QR_MATRIX.map((row, y) =>
                    row
                        .split('')
                        .map((cell, x) =>
                            cell === '1' ? (
                                <circle
                                    key={`${x}-${y}`}
                                    cx={x + 0.5}
                                    cy={y + 0.5}
                                    r={0.4}
                                    fill="currentColor"
                                />
                            ) : null,
                        ),
                )}
            </svg>

            {Array.from({ length: POINT_COUNT }, (_, i) => (
                <WalkDot key={i} delay={-(i / POINT_COUNT) * TOUR_DURATION} />
            ))}
        </div>
    );
}

function WalkDot({ delay }: { delay: number }) {
    return (
        <div
            className="absolute rounded-full bg-scan"
            style={{
                width: `${CELL * 0.68}%`,
                height: `${CELL * 0.68}%`,
                transform: 'translate(-50%, -50%)',
                boxShadow:
                    '0 0 4px 1px var(--scan), 0 0 10px 2px color-mix(in srgb, var(--scan) 60%, transparent)',
                animation: `walk-tour ${TOUR_DURATION}s linear infinite`,
                animationDelay: `${delay}s`,
            }}
        />
    );
}
