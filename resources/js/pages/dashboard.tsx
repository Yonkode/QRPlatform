import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    Plus,
    QrCode as QrCodeIcon,
    ScanLine,
    TrendingUp,
} from 'lucide-react';
import { FinderFrame } from '@/components/finder-frame';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';

interface QrCodeSummary {
    id: number;
    label: string;
    type: string;
    scan_count: number;
    scan_limit: number | null;
    status: 'active' | 'paused' | 'limit_reached';
    created_at: string;
}

interface DashboardProps {
    stats: {
        totalQrCodes: number;
        totalScans: number;
        scansLast30Days: number;
        nearingLimit: number;
    };
    recentQrCodes: QrCodeSummary[];
    scansTrend: Array<{ date: string; scans: number }>;
}

const STATUS_LABEL: Record<QrCodeSummary['status'], string> = {
    active: 'Actif',
    paused: 'En pause',
    limit_reached: 'Quota atteint',
};

export default function Dashboard({
    stats,
    recentQrCodes,
    scansTrend,
}: DashboardProps) {
    return (
        <>
            <Head title="Tableau de bord" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-display text-2xl font-semibold">
                            Tableau de bord
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Vue d'ensemble de tes QR codes et de leur activité.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/qr-codes/create">
                            <Plus className="size-4" />
                            Nouveau QR code
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        icon={QrCodeIcon}
                        label="QR codes créés"
                        value={stats.totalQrCodes}
                    />
                    <StatCard
                        icon={ScanLine}
                        label="Scans au total"
                        value={stats.totalScans}
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Scans (30 derniers jours)"
                        value={stats.scansLast30Days}
                    />
                    <StatCard
                        icon={AlertTriangle}
                        label="Proches de leur limite"
                        value={stats.nearingLimit}
                        tone={stats.nearingLimit > 0 ? 'warn' : 'default'}
                    />
                </div>

                <div className="grid gap-4 lg:grid-cols-5">
                    <FinderFrame className="p-5 lg:col-span-2">
                        <h2 className="font-display text-sm font-semibold">
                            Scans — 7 derniers jours
                        </h2>
                        <ScansSparkline data={scansTrend} />
                    </FinderFrame>

                    <FinderFrame className="p-5 lg:col-span-3">
                        <div className="flex items-center justify-between">
                            <h2 className="font-display text-sm font-semibold">
                                Derniers QR codes
                            </h2>
                            <Link
                                href="/qr-codes"
                                className="text-xs text-signal hover:underline"
                            >
                                Voir tout
                            </Link>
                        </div>

                        {recentQrCodes.length === 0 ? (
                            <div className="mt-6 flex flex-col items-center gap-3 py-8 text-center">
                                <QrCodeIcon className="size-8 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                    Tu n'as pas encore créé de QR code.
                                </p>
                                <Button size="sm" asChild>
                                    <Link href="/qr-codes/create">Créer mon premier QR code</Link>
                                </Button>
                            </div>
                        ) : (
                            <ul className="mt-4 divide-y divide-border">
                                {recentQrCodes.map((qr) => (
                                    <li key={qr.id}>
                                        <Link
                                            href={`/qr-codes/${qr.id}/scans`}
                                            className="-mx-2 flex items-center justify-between gap-3 rounded-md px-2 py-3 hover:bg-muted/50"
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium">{qr.label}</p>
                                                <p className="text-xs text-muted-foreground capitalize">{qr.type}</p>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-3">
                                                <span className="font-mono text-xs text-muted-foreground">
                                                    {qr.scan_count} / {qr.scan_limit ?? '∞'}
                                                </span>
                                                <StatusBadge status={qr.status} />
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </FinderFrame>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};

function StatCard({
    icon: Icon,
    label,
    value,
    tone = 'default',
}: {
    icon: typeof QrCodeIcon;
    label: string;
    value: number;
    tone?: 'default' | 'warn';
}) {
    return (
        <FinderFrame className="p-5">
            <Icon
                className={`size-5 ${tone === 'warn' && value > 0 ? 'text-warn' : 'text-signal'}`}
            />
            <p className="mt-3 font-display text-2xl font-semibold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
        </FinderFrame>
    );
}

function StatusBadge({ status }: { status: QrCodeSummary['status'] }) {
    if (status === 'limit_reached') {
        return <Badge variant="destructive">{STATUS_LABEL[status]}</Badge>;
    }

    if (status === 'paused') {
        return <Badge variant="secondary">{STATUS_LABEL[status]}</Badge>;
    }

    return (
        <Badge variant="outline" className="border-scan/40 text-scan">
            {STATUS_LABEL[status]}
        </Badge>
    );
}

function ScansSparkline({
    data,
}: {
    data: Array<{ date: string; scans: number }>;
}) {
    const max = Math.max(1, ...data.map((d) => d.scans));

    return (
        <div className="mt-4 flex h-32 items-end gap-2">
            {data.map((point) => (
                <div
                    key={point.date}
                    className="flex flex-1 flex-col items-center gap-1.5"
                >
                    <div
                        className="bg-gradient-signal w-full rounded-t"
                        style={{
                            height: `${Math.max(4, (point.scans / max) * 96)}px`,
                        }}
                        title={`${point.scans} scan${point.scans > 1 ? 's' : ''}`}
                    />
                    <span className="text-[10px] text-muted-foreground">
                        {point.date}
                    </span>
                </div>
            ))}
        </div>
    );
}
