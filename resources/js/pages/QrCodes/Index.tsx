import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ExternalLink,
    Gauge,
    Plus,
    QrCode as QrCodeIcon,
    Trash2,
    X,
} from 'lucide-react';
import type { FormEventHandler} from 'react';
import { useState } from 'react';
import { FinderFrame } from '@/components/finder-frame';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dashboard } from '@/routes';

interface QrCodeItem {
    id: number;
    label: string;
    type: string;
    slug: string;
    scan_count: number;
    scan_limit: number | null;
    status: 'active' | 'paused' | 'limit_reached';
}

const STATUS_LABEL: Record<QrCodeItem['status'], string> = {
    active: 'Actif',
    paused: 'En pause',
    limit_reached: 'Quota atteint',
};

export default function Index({ qrCodes }: { qrCodes: QrCodeItem[] }) {
    const [toDelete, setToDelete] = useState<QrCodeItem | null>(null);
    const [toEditQuota, setToEditQuota] = useState<QrCodeItem | null>(null);
    const [selected, setSelected] = useState<Set<number>>(new Set());
    const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const toggleSelected = (id: number) => {
        setSelected((prev) => {
            const next = new Set(prev);

            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }

            return next;
        });
    };

    const toggleSelectAll = () => {
        setSelected((prev) =>
            prev.size === qrCodes.length
                ? new Set()
                : new Set(qrCodes.map((q) => q.id)),
        );
    };

    const confirmDelete = () => {
        if (!toDelete) {
return;
}

        setDeleting(true);
        router.delete(`/qr-codes/${toDelete.id}`, {
            onFinish: () => {
                setDeleting(false);
                setToDelete(null);
            },
        });
    };

    const confirmBulkDelete = () => {
        setDeleting(true);
        router.delete('/qr-codes/bulk-destroy', {
            data: { ids: Array.from(selected) },
            onFinish: () => {
                setDeleting(false);
                setBulkDialogOpen(false);
                setSelected(new Set());
            },
        });
    };

    return (
        <>
            <Head title="Mes QR codes" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-display text-2xl font-semibold">
                            Mes QR codes
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {qrCodes.length} QR code
                            {qrCodes.length > 1 ? 's' : ''} créé
                            {qrCodes.length > 1 ? 's' : ''}.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/qr-codes/create">
                            <Plus className="size-4" />
                            Nouveau QR code
                        </Link>
                    </Button>
                </div>

                {qrCodes.length === 0 ? (
                    <FinderFrame className="flex flex-col items-center gap-3 p-12 text-center">
                        <QrCodeIcon className="size-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                            Aucun QR code créé pour le moment.
                        </p>
                        <Button size="sm" asChild>
                            <Link href="/qr-codes/create">
                                Créer mon premier QR code
                            </Link>
                        </Button>
                    </FinderFrame>
                ) : (
                    <>
                        <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Checkbox
                                    checked={selected.size === qrCodes.length}
                                    onCheckedChange={toggleSelectAll}
                                />
                                Tout sélectionner
                            </label>

                            {selected.size > 0 && (
                                <div className="ml-auto flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">
                                        {selected.size} sélectionné
                                        {selected.size > 1 ? 's' : ''}
                                    </span>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => setBulkDialogOpen(true)}
                                    >
                                        <Trash2 className="size-4" />
                                        Supprimer
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setSelected(new Set())}
                                    >
                                        <X className="size-4" />
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {qrCodes.map((qr) => (
                                <FinderFrame
                                    key={qr.id}
                                    className="flex gap-4 p-4"
                                >
                                    <div className="flex shrink-0 flex-col items-center gap-2">
                                        <Checkbox
                                            checked={selected.has(qr.id)}
                                            onCheckedChange={() =>
                                                toggleSelected(qr.id)
                                            }
                                        />
                                        <img
                                            src={`/qr-codes/${qr.id}/image`}
                                            alt={`QR code ${qr.label}`}
                                            className="size-20 rounded-md border border-border bg-white p-1"
                                        />
                                    </div>
                                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                                        <div>
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="truncate text-sm font-medium">
                                                    {qr.label}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setToDelete(qr)
                                                    }
                                                    className="shrink-0 text-muted-foreground hover:text-destructive"
                                                    aria-label={`Supprimer ${qr.label}`}
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </div>
                                            <p className="text-xs text-muted-foreground capitalize">
                                                {qr.type}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setToEditQuota(qr)
                                                }
                                                className="mt-1 inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-signal"
                                            >
                                                <Gauge className="size-3" />
                                                {qr.scan_count} /{' '}
                                                {qr.scan_limit ?? '∞'} scans
                                            </button>
                                        </div>
                                        <div className="mt-2 flex items-center justify-between gap-2">
                                            <StatusBadge status={qr.status} />
                                            <Link
                                                href={`/qr-codes/${qr.id}/scans`}
                                                className="inline-flex items-center gap-1 text-xs text-signal hover:underline"
                                            >
                                                Historique{' '}
                                                <ExternalLink className="size-3" />
                                            </Link>
                                        </div>
                                    </div>
                                </FinderFrame>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <Dialog
                open={toDelete !== null}
                onOpenChange={(open) => !open && setToDelete(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Supprimer ce QR code ?</DialogTitle>
                        <DialogDescription>
                            « {toDelete?.label} » sera définitivement supprimé,
                            ainsi que tout son historique de scans. Cette action
                            est irréversible.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() => setToDelete(null)}
                            disabled={deleting}
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={deleting}
                        >
                            {deleting
                                ? 'Suppression...'
                                : 'Supprimer définitivement'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Supprimer {selected.size} QR code
                            {selected.size > 1 ? 's' : ''} ?
                        </DialogTitle>
                        <DialogDescription>
                            Ces QR codes et tout leur historique de scans seront
                            définitivement supprimés. Cette action est
                            irréversible.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() => setBulkDialogOpen(false)}
                            disabled={deleting}
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmBulkDelete}
                            disabled={deleting}
                        >
                            {deleting
                                ? 'Suppression...'
                                : 'Supprimer définitivement'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <QuotaDialog
                qrCode={toEditQuota}
                onClose={() => setToEditQuota(null)}
            />
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Mes QR codes', href: '/qr-codes' },
    ],
};

function StatusBadge({ status }: { status: QrCodeItem['status'] }) {
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

function QuotaDialog({
    qrCode,
    onClose,
}: {
    qrCode: QrCodeItem | null;
    onClose: () => void;
}) {
    const { data, setData, patch, processing, errors, reset } = useForm({
        scan_limit: '',
        reason: '',
    });

    const open = qrCode !== null;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!qrCode) {
return;
}

        patch(`/qr-codes/${qrCode.id}/quota`, {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                if (!next) {
                    reset();
                    onClose();
                }
            }}
        >
            <DialogContent>
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>Modifier le quota</DialogTitle>
                        <DialogDescription>
                            « {qrCode?.label} » — actuellement{' '}
                            {qrCode?.scan_count} / {qrCode?.scan_limit ?? '∞'}{' '}
                            scans.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="scan_limit">
                                Nouvelle limite de scans
                            </Label>
                            <Input
                                id="scan_limit"
                                type="number"
                                min={0}
                                value={data.scan_limit}
                                onChange={(e) =>
                                    setData('scan_limit', e.target.value)
                                }
                                placeholder="Laisser vide pour illimité"
                            />
                            {errors.scan_limit && (
                                <p className="text-sm text-destructive">
                                    {errors.scan_limit}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reason">Motif (optionnel)</Label>
                            <Input
                                id="reason"
                                value={data.reason}
                                onChange={(e) =>
                                    setData('reason', e.target.value)
                                }
                                placeholder="Ex. Campagne prolongée"
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            disabled={processing}
                        >
                            Annuler
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Mise à jour...' : 'Mettre à jour'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
