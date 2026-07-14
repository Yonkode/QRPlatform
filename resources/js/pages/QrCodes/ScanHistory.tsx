import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Smartphone, X } from 'lucide-react';
import type { FormEventHandler} from 'react';
import { useState } from 'react';
import { FinderFrame } from '@/components/finder-frame';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard } from '@/routes';

interface ScanRow {
    id: number;
    scanned_at: string;
    ip_address: string | null;
    country: string | null;
    city: string | null;
    device_type: string | null;
    os: string | null;
    browser: string | null;
}

interface Paginated<T> {
    data: T[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
    from: number | null;
    to: number | null;
    total: number;
}

interface ScanHistoryProps {
    qrCode: {
        id: number;
        label: string;
        type: string;
        scan_count: number;
        scan_limit: number | null;
        status: 'active' | 'paused' | 'limit_reached';
    };
    scans: Paginated<ScanRow>;
    availableCountries: string[];
    filters: {
        from?: string;
        to?: string;
        country?: string;
        ip?: string;
    };
}

export default function ScanHistory({
    qrCode,
    scans,
    availableCountries,
    filters,
}: ScanHistoryProps) {
    const [from, setFrom] = useState(filters.from ?? '');
    const [to, setTo] = useState(filters.to ?? '');
    const [country, setCountry] = useState(filters.country ?? '');
    const [ip, setIp] = useState(filters.ip ?? '');

    const hasActiveFilters = Boolean(
        filters.from || filters.to || filters.country || filters.ip,
    );

    const applyFilters: FormEventHandler = (e) => {
        e.preventDefault();
        router.get(
            `/qr-codes/${qrCode.id}/scans`,
            { from, to, country, ip },
            { preserveState: true, replace: true },
        );
    };

    const clearFilters = () => {
        setFrom('');
        setTo('');
        setCountry('');
        setIp('');
        router.get(
            `/qr-codes/${qrCode.id}/scans`,
            {},
            { preserveState: true, replace: true },
        );
    };

    return (
        <>
            <Head title={`Historique — ${qrCode.label}`} />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <Link
                        href="/qr-codes"
                        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="size-4" />
                        Mes QR codes
                    </Link>
                    <div className="mt-2 flex items-center justify-between">
                        <div>
                            <h1 className="font-display text-2xl font-semibold">
                                {qrCode.label}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {qrCode.scan_count} / {qrCode.scan_limit ?? '∞'}{' '}
                                scans — historique complet
                            </p>
                        </div>
                    </div>
                </div>

                <FinderFrame className="p-5">

                    <div className="mb-4 flex flex-wrap gap-2">
                        {[
                            { label: "Aujourd'hui", days: 0 },
                            { label: '7 derniers jours', days: 7 },
                            { label: '30 derniers jours', days: 30 },
                            { label: 'Cette année', days: 365 },
                        ].map((preset) => (
                            <button
                                key={preset.label}
                                type="button"
                                onClick={() => {
                                    const to = new Date().toISOString().slice(0, 10);
                                    const fromDate = new Date();
                                    fromDate.setDate(fromDate.getDate() - preset.days);
                                    const from = fromDate.toISOString().slice(0, 10);
                                    setFrom(from);
                                    setTo(to);
                                    router.get(
                                        `/qr-codes/${qrCode.id}/scans`,
                                        { from, to, country, ip },
                                        { preserveState: true, replace: true },
                                    );
                                }}
                                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:border-signal hover:text-signal"
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>

                    <form
                        onSubmit={applyFilters}
                        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
                    >
                        <div className="space-y-1.5">
                            <Label htmlFor="from">Du</Label>
                            <Input
                                id="from"
                                type="date"
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="to">Au</Label>
                            <Input
                                id="to"
                                type="date"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label>Pays</Label>
                            <Select
                                value={country || 'all'}
                                onValueChange={(v) =>
                                    setCountry(v === 'all' ? '' : v)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Tous les pays" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Tous les pays
                                    </SelectItem>
                                    {availableCountries.map((c) => (
                                        <SelectItem key={c} value={c}>
                                            {c}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="ip">Adresse IP</Label>
                            <Input
                                id="ip"
                                value={ip}
                                onChange={(e) => setIp(e.target.value)}
                                placeholder="Ex. 192.168."
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="invisible">Filtrer</Label>
                            <div className="flex gap-2">
                                <Button type="submit" className="flex-1">
                                    Filtrer
                                </Button>
                                {hasActiveFilters && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={clearFilters}
                                    >
                                        <X className="size-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </form>
                </FinderFrame>

                <FinderFrame className="overflow-hidden p-0">
                    {scans.data.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 p-12 text-center">
                            <Smartphone className="size-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                {hasActiveFilters
                                    ? 'Aucun scan ne correspond à ces filtres.'
                                    : "Ce QR code n'a pas encore été scanné."}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-border text-xs text-muted-foreground">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">
                                            Date
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Localisation
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Adresse IP
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Appareil
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {scans.data.map((scan) => (
                                        <tr key={scan.id}>
                                            <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">
                                                {new Date(
                                                    scan.scanned_at,
                                                ).toLocaleString('fr-FR')}
                                            </td>
                                            <td className="px-4 py-3">
                                                {scan.city || scan.country ? (
                                                    <span>
                                                        {[
                                                            scan.city,
                                                            scan.country,
                                                        ]
                                                            .filter(Boolean)
                                                            .join(', ')}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        Inconnue
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 font-mono text-xs">
                                                {scan.ip_address ?? '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant="outline">
                                                    {[
                                                        scan.device_type,
                                                        scan.os,
                                                        scan.browser,
                                                    ]
                                                        .filter(Boolean)
                                                        .join(' · ') ||
                                                        'Inconnu'}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {scans.total > 0 && (
                        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
                            <span>
                                {scans.from}–{scans.to} sur {scans.total}
                            </span>
                            <div className="flex gap-1">
                                {scans.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url ?? '#'}
                                        preserveState
                                        className={`rounded px-2 py-1 ${
                                            link.active
                                                ? 'bg-signal text-white'
                                                : link.url
                                                  ? 'hover:bg-muted'
                                                  : 'pointer-events-none opacity-40'
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </FinderFrame>
            </div>
        </>
    );
}

ScanHistory.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Mes QR codes', href: '/qr-codes' },
        { title: 'Historique des scans', href: '#' },
    ],
};
