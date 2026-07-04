import { Head, useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import { FinderFrame } from '@/components/finder-frame';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dashboard } from '@/routes';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        label: '',
        url: '',
        scan_limit: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/qr-codes');
    };

    return (
        <>
            <Head title="Créer un QR code" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="font-display text-2xl font-semibold">
                        Créer un QR code
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Type : Site web
                    </p>
                </div>

                <div className="max-w-xl">
                    <FinderFrame className="p-6">
                        <form onSubmit={submit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="label">Nom du QR code</Label>
                                <Input
                                    id="label"
                                    value={data.label}
                                    onChange={(e) =>
                                        setData('label', e.target.value)
                                    }
                                    placeholder="Ex. Carte de visite stand salon"
                                />
                                {errors.label && (
                                    <p className="text-sm text-destructive">
                                        {errors.label}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="url">URL du site</Label>
                                <Input
                                    id="url"
                                    type="url"
                                    value={data.url}
                                    onChange={(e) =>
                                        setData('url', e.target.value)
                                    }
                                    placeholder="https://exemple.com"
                                />
                                {errors.url && (
                                    <p className="text-sm text-destructive">
                                        {errors.url}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="scan_limit">
                                    Limite de scans (optionnel)
                                </Label>
                                <Input
                                    id="scan_limit"
                                    type="number"
                                    min={1}
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

                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full"
                            >
                                Créer le QR code
                            </Button>
                        </form>
                    </FinderFrame>
                </div>
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Mes QR codes', href: '/qr-codes' },
        { title: 'Nouveau', href: '/qr-codes/create' },
    ],
};
