import { Head, useForm } from '@inertiajs/react';
import { Contact, Globe, MessageCircle, Wifi } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { FinderFrame } from '@/components/finder-frame';
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
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';

type QrType = 'website' | 'wifi' | 'vcard' | 'whatsapp';

const TYPES: { value: QrType; label: string; description: string; icon: typeof Globe }[] = [
    { value: 'website', label: 'Site web', description: 'Redirige vers une URL', icon: Globe },
    { value: 'wifi', label: 'Wi-Fi', description: 'Connexion à un réseau', icon: Wifi },
    { value: 'vcard', label: 'Carte de visite', description: 'Coordonnées de contact', icon: Contact },
    { value: 'whatsapp', label: 'WhatsApp', description: 'Ouvre une discussion', icon: MessageCircle },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        type: 'website' as QrType,
        label: '',
        scan_limit: '',
        // Site web
        url: '',
        // Wi-Fi
        ssid: '',
        wifi_password: '',
        encryption: 'WPA',
        // Carte de visite
        full_name: '',
        phone: '',
        email: '',
        company: '',
        // WhatsApp
        whatsapp_phone: '',
        message: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/qr-codes');
    };

    return (
        <>
            <Head title="Créer un QR code" />

            <div className="flex flex-1 flex-col items-center gap-6 p-4 md:p-6">
                <div className="w-full max-w-xl text-center">
                    <h1 className="font-display text-2xl font-semibold">
                        Créer un QR code
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Choisis un type puis complète les informations.
                    </p>
                </div>

                <div className="w-full max-w-xl">
                    <FinderFrame className="p-6">
                        <form onSubmit={submit} className="space-y-5">
                            <div className="space-y-2">
                                <Label>Type de QR code</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {TYPES.map((t) => {
                                        const Icon = t.icon;
                                        const active = data.type === t.value;
                                        return (
                                            <button
                                                key={t.value}
                                                type="button"
                                                onClick={() => setData('type', t.value)}
                                                className={cn(
                                                    'flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-colors',
                                                    active
                                                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                                        : 'border-border hover:bg-accent',
                                                )}
                                            >
                                                <Icon className="size-5" />
                                                <span className="text-sm font-medium">
                                                    {t.label}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {t.description}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                                {errors.type && (
                                    <p className="text-sm text-destructive">
                                        {errors.type}
                                    </p>
                                )}
                            </div>

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

                            {data.type === 'website' && (
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
                            )}

                            {data.type === 'wifi' && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="ssid">Nom du réseau (SSID)</Label>
                                        <Input
                                            id="ssid"
                                            value={data.ssid}
                                            onChange={(e) =>
                                                setData('ssid', e.target.value)
                                            }
                                            placeholder="Ex. Bureau-5G"
                                        />
                                        {errors.ssid && (
                                            <p className="text-sm text-destructive">
                                                {errors.ssid}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="encryption">Sécurité</Label>
                                        <Select
                                            value={data.encryption}
                                            onValueChange={(v) =>
                                                setData('encryption', v)
                                            }
                                        >
                                            <SelectTrigger id="encryption" className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="WPA">WPA / WPA2</SelectItem>
                                                <SelectItem value="WEP">WEP</SelectItem>
                                                <SelectItem value="nopass">Réseau ouvert</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.encryption && (
                                            <p className="text-sm text-destructive">
                                                {errors.encryption}
                                            </p>
                                        )}
                                    </div>

                                    {data.encryption !== 'nopass' && (
                                        <div className="space-y-2">
                                            <Label htmlFor="wifi_password">Mot de passe</Label>
                                            <Input
                                                id="wifi_password"
                                                value={data.wifi_password}
                                                onChange={(e) =>
                                                    setData('wifi_password', e.target.value)
                                                }
                                                placeholder="Mot de passe du réseau"
                                            />
                                            {errors.wifi_password && (
                                                <p className="text-sm text-destructive">
                                                    {errors.wifi_password}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}

                            {data.type === 'vcard' && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="full_name">Nom complet</Label>
                                        <Input
                                            id="full_name"
                                            value={data.full_name}
                                            onChange={(e) =>
                                                setData('full_name', e.target.value)
                                            }
                                            placeholder="Ex. Awa Koffi"
                                        />
                                        {errors.full_name && (
                                            <p className="text-sm text-destructive">
                                                {errors.full_name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="company">Entreprise (optionnel)</Label>
                                        <Input
                                            id="company"
                                            value={data.company}
                                            onChange={(e) =>
                                                setData('company', e.target.value)
                                            }
                                            placeholder="Ex. Acme SARL"
                                        />
                                        {errors.company && (
                                            <p className="text-sm text-destructive">
                                                {errors.company}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Téléphone (optionnel)</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData('phone', e.target.value)
                                            }
                                            placeholder="Ex. +229 01 23 45 67 89"
                                        />
                                        {errors.phone && (
                                            <p className="text-sm text-destructive">
                                                {errors.phone}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">E-mail (optionnel)</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData('email', e.target.value)
                                            }
                                            placeholder="Ex. awa@exemple.com"
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-destructive">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}

                            {data.type === 'whatsapp' && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="whatsapp_phone">
                                            Numéro WhatsApp
                                        </Label>
                                        <Input
                                            id="whatsapp_phone"
                                            type="tel"
                                            value={data.whatsapp_phone}
                                            onChange={(e) =>
                                                setData('whatsapp_phone', e.target.value)
                                            }
                                            placeholder="Ex. +229012345678"
                                        />
                                        {errors.whatsapp_phone && (
                                            <p className="text-sm text-destructive">
                                                {errors.whatsapp_phone}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message">
                                            Message pré-rempli (optionnel)
                                        </Label>
                                        <Input
                                            id="message"
                                            value={data.message}
                                            onChange={(e) =>
                                                setData('message', e.target.value)
                                            }
                                            placeholder="Ex. Bonjour, je vous contacte depuis..."
                                        />
                                        {errors.message && (
                                            <p className="text-sm text-destructive">
                                                {errors.message}
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}

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
