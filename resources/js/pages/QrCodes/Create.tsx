import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormEventHandler } from 'react';

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
        <AppLayout>
            <Head title="Créer un QR Code" />

            <div className="max-w-xl mx-auto py-8 px-4">
                <h1 className="text-2xl font-semibold mb-6">Créer un QR Code — Site internet</h1>

                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <Label htmlFor="label">Nom du QR Code</Label>
                        <Input
                            id="label"
                            value={data.label}
                            onChange={(e) => setData('label', e.target.value)}
                            placeholder="Ex. Carte de visite stand salon"
                        />
                        {errors.label && (
                            <p className="text-sm text-red-600 mt-1">{errors.label}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="url">URL du site</Label>
                        <Input
                            id="url"
                            type="url"
                            value={data.url}
                            onChange={(e) => setData('url', e.target.value)}
                            placeholder="https://exemple.com"
                        />
                        {errors.url && (
                            <p className="text-sm text-red-600 mt-1">{errors.url}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="scan_limit">Limite de scans (optionnel)</Label>
                        <Input
                            id="scan_limit"
                            type="number"
                            min={1}
                            value={data.scan_limit}
                            onChange={(e) => setData('scan_limit', e.target.value)}
                            placeholder="Laisser vide pour illimité"
                        />
                        {errors.scan_limit && (
                            <p className="text-sm text-red-600 mt-1">{errors.scan_limit}</p>
                        )}
                    </div>

                    <Button type="submit" disabled={processing}>
                        Créer le QR Code
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
