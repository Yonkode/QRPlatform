import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface QrCodeItem {
    id: number;
    label: string;
    type: string;
    slug: string;
    scan_count: number;
    scan_limit: number | null;
    status: string;
}

export default function Index({ qrCodes }: { qrCodes: QrCodeItem[] }) {
    return (
        <AppLayout>
            <Head title="Mes QR Codes" />

            <div className="max-w-3xl mx-auto py-8 px-4">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold">Mes QR Codes</h1>
                    <Link href="/qr-codes/create">
                        <Button>Nouveau QR Code</Button>
                    </Link>
                </div>

                {qrCodes.length === 0 ? (
                    <p className="text-muted-foreground">Aucun QR Code créé pour le moment.</p>
                ) : (
                    <div className="space-y-3">
                        {qrCodes.map((qr) => (
                            <div key={qr.id} className="border rounded-lg p-4 flex items-center gap-4">
                                <img
                                    src={`/qr-codes/${qr.id}/image`}
                                    alt={`QR Code ${qr.label}`}
                                    className="w-20 h-20 border rounded"
                                />
                                <div className="flex-1">
                                    <p className="font-medium">{qr.label}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {qr.type} · {qr.scan_count} / {qr.scan_limit ?? '∞'} scans · {qr.status}
                                    </p>
                                </div>
                                <a href={`/r/${qr.slug}`} target="_blank" className="text-sm text-blue-600 underline">
                                    Voir le lien
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
