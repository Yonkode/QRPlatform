import { Head, useForm } from '@inertiajs/react';
import {
    AtSign,
    Building2,
    ChevronDown,
    Contact,
    Facebook,
    FileText,
    Globe,
    Images,
    Instagram,
    Link2,
    MessageCircle,
    Music,
    Plus,
    Smartphone,
    Tag,
    Trash2,
    Upload,
    Utensils,
    Video,
    Wifi,
} from 'lucide-react';
import type { ChangeEvent, FormEventHandler } from 'react';
import { useState } from 'react';
import { FinderFrame } from '@/components/finder-frame';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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

type QrType =
    | 'website'
    | 'wifi'
    | 'vcard'
    | 'whatsapp'
    | 'coupon'
    | 'business'
    | 'app'
    | 'facebook'
    | 'instagram'
    | 'social'
    | 'pdf'
    | 'images'
    | 'video'
    | 'mp3'
    | 'menu'
    | 'link_list';

const TYPES: { value: QrType; label: string; description: string; icon: typeof Globe }[] = [
    { value: 'website', label: 'Site web', description: 'Redirige vers une URL', icon: Globe },
    { value: 'wifi', label: 'Wi-Fi', description: 'Connexion à un réseau', icon: Wifi },
    { value: 'vcard', label: 'Carte de visite', description: 'Coordonnées de contact', icon: Contact },
    { value: 'whatsapp', label: 'WhatsApp', description: 'Ouvre une discussion', icon: MessageCircle },
    { value: 'coupon', label: 'Coupon', description: 'Code promo à afficher', icon: Tag },
    { value: 'business', label: 'Business', description: 'Fiche établissement', icon: Building2 },
    { value: 'app', label: 'Application', description: 'Lien App Store / Play Store', icon: Smartphone },
    { value: 'facebook', label: 'Facebook', description: 'Lien vers une page', icon: Facebook },
    { value: 'instagram', label: 'Instagram', description: 'Lien vers un profil', icon: Instagram },
    { value: 'social', label: 'Réseau social', description: 'Lien vers un profil', icon: AtSign },
    { value: 'pdf', label: 'PDF', description: 'Document à consulter', icon: FileText },
    { value: 'images', label: 'Images', description: 'Galerie de photos', icon: Images },
    { value: 'video', label: 'Vidéo', description: 'Fichier vidéo à lire', icon: Video },
    { value: 'mp3', label: 'Audio', description: 'Fichier audio à écouter', icon: Music },
    { value: 'menu', label: 'Menu', description: 'Carte de restaurant', icon: Utensils },
    { value: 'link_list', label: 'Liste de liens', description: 'Style Linktree', icon: Link2 },
];

const CATEGORIES: { title: string; types: QrType[] }[] = [
    { title: 'Liens & réseaux', types: ['website', 'app', 'facebook', 'instagram', 'social'] },
    { title: 'Contact', types: ['vcard', 'whatsapp', 'business'] },
    { title: 'Fichiers', types: ['pdf', 'images', 'video', 'mp3'] },
    { title: 'Contenu', types: ['wifi', 'coupon', 'menu', 'link_list'] },
];

interface MenuItem {
    name: string;
    price: string;
}

interface LinkItem {
    label: string;
    url: string;
}

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<{
        type: QrType;
        label: string;
        scan_limit: string;
        // Site web
        url: string;
        // Wi-Fi
        ssid: string;
        wifi_password: string;
        encryption: string;
        // Carte de visite
        full_name: string;
        phone: string;
        email: string;
        company: string;
        // WhatsApp
        whatsapp_phone: string;
        message: string;
        // Coupon
        coupon_title: string;
        coupon_code: string;
        discount: string;
        coupon_description: string;
        expires_at: string;
        // Business
        business_name: string;
        business_description: string;
        business_phone: string;
        business_email: string;
        address: string;
        business_website: string;
        hours: string;
        // Redirections simples
        app_url: string;
        facebook_url: string;
        instagram_url: string;
        social_url: string;
        // Fichiers
        pdf_file: File | null;
        images: File[];
        video_file: File | null;
        mp3_file: File | null;
        // Menu
        menu_title: string;
        menu_description: string;
        items: MenuItem[];
        // Liste de liens
        link_list_title: string;
        link_list_bio: string;
        links: LinkItem[];
    }>({
        type: 'website',
        label: '',
        scan_limit: '',
        url: '',
        ssid: '',
        wifi_password: '',
        encryption: 'WPA',
        full_name: '',
        phone: '',
        email: '',
        company: '',
        whatsapp_phone: '',
        message: '',
        coupon_title: '',
        coupon_code: '',
        discount: '',
        coupon_description: '',
        expires_at: '',
        business_name: '',
        business_description: '',
        business_phone: '',
        business_email: '',
        address: '',
        business_website: '',
        hours: '',
        app_url: '',
        facebook_url: '',
        instagram_url: '',
        social_url: '',
        pdf_file: null,
        images: [],
        video_file: null,
        mp3_file: null,
        menu_title: '',
        menu_description: '',
        items: [{ name: '', price: '' }],
        link_list_title: '',
        link_list_bio: '',
        links: [{ label: '', url: '' }],
    });

    const [typePickerOpen, setTypePickerOpen] = useState(false);
    const selectedType = TYPES.find((t) => t.value === data.type) ?? TYPES[0];
    const SelectedIcon = selectedType.icon;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/qr-codes', { forceFormData: true });
    };

    const handleSingleFile = (field: 'pdf_file' | 'video_file' | 'mp3_file') => (
        e: ChangeEvent<HTMLInputElement>,
    ) => {
        setData(field, e.target.files?.[0] ?? null);
    };

    const handleMultiFiles = (e: ChangeEvent<HTMLInputElement>) => {
        setData('images', e.target.files ? Array.from(e.target.files) : []);
    };

    const updateItem = (index: number, field: keyof MenuItem, value: string) => {
        const next = [...data.items];
        next[index] = { ...next[index], [field]: value };
        setData('items', next);
    };

    const addItem = () => setData('items', [...data.items, { name: '', price: '' }]);
    const removeItem = (index: number) =>
        setData('items', data.items.filter((_, i) => i !== index));

    const updateLink = (index: number, field: keyof LinkItem, value: string) => {
        const next = [...data.links];
        next[index] = { ...next[index], [field]: value };
        setData('links', next);
    };

    const addLink = () => setData('links', [...data.links, { label: '', url: '' }]);
    const removeLink = (index: number) =>
        setData('links', data.links.filter((_, i) => i !== index));

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
                                <button
                                    type="button"
                                    onClick={() => setTypePickerOpen(true)}
                                    className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-accent"
                                >
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                                        <SelectedIcon className="size-5" />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block text-sm font-medium">
                                            {selectedType.label}
                                        </span>
                                        <span className="block truncate text-xs text-muted-foreground">
                                            {selectedType.description}
                                        </span>
                                    </span>
                                    <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                                </button>
                                {errors.type && (
                                    <p className="text-sm text-destructive">{errors.type}</p>
                                )}
                            </div>

                            <Dialog open={typePickerOpen} onOpenChange={setTypePickerOpen}>
                                <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
                                    <DialogHeader>
                                        <DialogTitle>Choisir un type de QR code</DialogTitle>
                                        <DialogDescription>
                                            16 types disponibles, classés par catégorie.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="space-y-5">
                                        {CATEGORIES.map((category) => (
                                            <div key={category.title} className="space-y-2">
                                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                    {category.title}
                                                </p>
                                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                                    {category.types.map((value) => {
                                                        const t = TYPES.find(
                                                            (x) => x.value === value,
                                                        )!;
                                                        const Icon = t.icon;
                                                        const active = data.type === value;
                                                        return (
                                                            <button
                                                                key={value}
                                                                type="button"
                                                                onClick={() => {
                                                                    setData('type', value);
                                                                    setTypePickerOpen(false);
                                                                }}
                                                                className={cn(
                                                                    'flex flex-col items-start gap-1 rounded-lg border p-2.5 text-left transition-colors',
                                                                    active
                                                                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                                                        : 'border-border hover:bg-accent',
                                                                )}
                                                            >
                                                                <Icon className="size-4" />
                                                                <span className="text-xs font-medium">
                                                                    {t.label}
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <div className="space-y-2">
                                <Label htmlFor="label">Nom du QR code</Label>
                                <Input
                                    id="label"
                                    value={data.label}
                                    onChange={(e) => setData('label', e.target.value)}
                                    placeholder="Ex. Carte de visite stand salon"
                                />
                                {errors.label && (
                                    <p className="text-sm text-destructive">{errors.label}</p>
                                )}
                            </div>

                            {data.type === 'website' && (
                                <div className="space-y-2">
                                    <Label htmlFor="url">URL du site</Label>
                                    <Input
                                        id="url"
                                        type="url"
                                        value={data.url}
                                        onChange={(e) => setData('url', e.target.value)}
                                        placeholder="https://exemple.com"
                                    />
                                    {errors.url && (
                                        <p className="text-sm text-destructive">{errors.url}</p>
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
                                            onChange={(e) => setData('ssid', e.target.value)}
                                            placeholder="Ex. Bureau-5G"
                                        />
                                        {errors.ssid && (
                                            <p className="text-sm text-destructive">{errors.ssid}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="encryption">Sécurité</Label>
                                        <Select
                                            value={data.encryption}
                                            onValueChange={(v) => setData('encryption', v)}
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
                                            onChange={(e) => setData('full_name', e.target.value)}
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
                                            onChange={(e) => setData('company', e.target.value)}
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
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder="Ex. +229 01 23 45 67 89"
                                        />
                                        {errors.phone && (
                                            <p className="text-sm text-destructive">{errors.phone}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">E-mail (optionnel)</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="Ex. awa@exemple.com"
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-destructive">{errors.email}</p>
                                        )}
                                    </div>
                                </>
                            )}

                            {data.type === 'whatsapp' && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="whatsapp_phone">Numéro WhatsApp</Label>
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
                                        <Label htmlFor="message">Message pré-rempli (optionnel)</Label>
                                        <Input
                                            id="message"
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
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

                            {data.type === 'coupon' && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="coupon_title">Titre de l'offre</Label>
                                        <Input
                                            id="coupon_title"
                                            value={data.coupon_title}
                                            onChange={(e) =>
                                                setData('coupon_title', e.target.value)
                                            }
                                            placeholder="Ex. Réduction de rentrée"
                                        />
                                        {errors.coupon_title && (
                                            <p className="text-sm text-destructive">
                                                {errors.coupon_title}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="coupon_code">Code promo</Label>
                                        <Input
                                            id="coupon_code"
                                            value={data.coupon_code}
                                            onChange={(e) => setData('coupon_code', e.target.value)}
                                            placeholder="Ex. RENTREE20"
                                        />
                                        {errors.coupon_code && (
                                            <p className="text-sm text-destructive">
                                                {errors.coupon_code}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="discount">Remise (optionnel)</Label>
                                        <Input
                                            id="discount"
                                            value={data.discount}
                                            onChange={(e) => setData('discount', e.target.value)}
                                            placeholder="Ex. -20% ou 5000 FCFA"
                                        />
                                        {errors.discount && (
                                            <p className="text-sm text-destructive">
                                                {errors.discount}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="coupon_description">
                                            Description (optionnel)
                                        </Label>
                                        <Input
                                            id="coupon_description"
                                            value={data.coupon_description}
                                            onChange={(e) =>
                                                setData('coupon_description', e.target.value)
                                            }
                                            placeholder="Ex. Valable en boutique uniquement"
                                        />
                                        {errors.coupon_description && (
                                            <p className="text-sm text-destructive">
                                                {errors.coupon_description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="expires_at">
                                            Date d'expiration (optionnel)
                                        </Label>
                                        <Input
                                            id="expires_at"
                                            type="date"
                                            value={data.expires_at}
                                            onChange={(e) => setData('expires_at', e.target.value)}
                                        />
                                        {errors.expires_at && (
                                            <p className="text-sm text-destructive">
                                                {errors.expires_at}
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}

                            {data.type === 'business' && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="business_name">Nom de l'établissement</Label>
                                        <Input
                                            id="business_name"
                                            value={data.business_name}
                                            onChange={(e) =>
                                                setData('business_name', e.target.value)
                                            }
                                            placeholder="Ex. Boulangerie du Centre"
                                        />
                                        {errors.business_name && (
                                            <p className="text-sm text-destructive">
                                                {errors.business_name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="business_description">
                                            Description (optionnel)
                                        </Label>
                                        <Input
                                            id="business_description"
                                            value={data.business_description}
                                            onChange={(e) =>
                                                setData('business_description', e.target.value)
                                            }
                                            placeholder="Ex. Pain et pâtisseries artisanales"
                                        />
                                        {errors.business_description && (
                                            <p className="text-sm text-destructive">
                                                {errors.business_description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address">Adresse (optionnel)</Label>
                                        <Input
                                            id="address"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            placeholder="Ex. 12 rue des Cocotiers, Cotonou"
                                        />
                                        {errors.address && (
                                            <p className="text-sm text-destructive">
                                                {errors.address}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="hours">Horaires (optionnel)</Label>
                                        <Input
                                            id="hours"
                                            value={data.hours}
                                            onChange={(e) => setData('hours', e.target.value)}
                                            placeholder="Ex. Lun-Sam 8h-19h"
                                        />
                                        {errors.hours && (
                                            <p className="text-sm text-destructive">{errors.hours}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="business_phone">Téléphone (optionnel)</Label>
                                        <Input
                                            id="business_phone"
                                            type="tel"
                                            value={data.business_phone}
                                            onChange={(e) =>
                                                setData('business_phone', e.target.value)
                                            }
                                            placeholder="Ex. +229 01 23 45 67 89"
                                        />
                                        {errors.business_phone && (
                                            <p className="text-sm text-destructive">
                                                {errors.business_phone}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="business_email">E-mail (optionnel)</Label>
                                        <Input
                                            id="business_email"
                                            type="email"
                                            value={data.business_email}
                                            onChange={(e) =>
                                                setData('business_email', e.target.value)
                                            }
                                            placeholder="Ex. contact@exemple.com"
                                        />
                                        {errors.business_email && (
                                            <p className="text-sm text-destructive">
                                                {errors.business_email}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="business_website">Site web (optionnel)</Label>
                                        <Input
                                            id="business_website"
                                            type="url"
                                            value={data.business_website}
                                            onChange={(e) =>
                                                setData('business_website', e.target.value)
                                            }
                                            placeholder="https://exemple.com"
                                        />
                                        {errors.business_website && (
                                            <p className="text-sm text-destructive">
                                                {errors.business_website}
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}

                            {data.type === 'app' && (
                                <div className="space-y-2">
                                    <Label htmlFor="app_url">Lien de l'application</Label>
                                    <Input
                                        id="app_url"
                                        type="url"
                                        value={data.app_url}
                                        onChange={(e) => setData('app_url', e.target.value)}
                                        placeholder="https://play.google.com/store/apps/..."
                                    />
                                    {errors.app_url && (
                                        <p className="text-sm text-destructive">{errors.app_url}</p>
                                    )}
                                </div>
                            )}

                            {data.type === 'facebook' && (
                                <div className="space-y-2">
                                    <Label htmlFor="facebook_url">Lien de la page Facebook</Label>
                                    <Input
                                        id="facebook_url"
                                        type="url"
                                        value={data.facebook_url}
                                        onChange={(e) => setData('facebook_url', e.target.value)}
                                        placeholder="https://facebook.com/mapage"
                                    />
                                    {errors.facebook_url && (
                                        <p className="text-sm text-destructive">
                                            {errors.facebook_url}
                                        </p>
                                    )}
                                </div>
                            )}

                            {data.type === 'instagram' && (
                                <div className="space-y-2">
                                    <Label htmlFor="instagram_url">Lien du profil Instagram</Label>
                                    <Input
                                        id="instagram_url"
                                        type="url"
                                        value={data.instagram_url}
                                        onChange={(e) => setData('instagram_url', e.target.value)}
                                        placeholder="https://instagram.com/moncompte"
                                    />
                                    {errors.instagram_url && (
                                        <p className="text-sm text-destructive">
                                            {errors.instagram_url}
                                        </p>
                                    )}
                                </div>
                            )}

                            {data.type === 'social' && (
                                <div className="space-y-2">
                                    <Label htmlFor="social_url">Lien du profil</Label>
                                    <Input
                                        id="social_url"
                                        type="url"
                                        value={data.social_url}
                                        onChange={(e) => setData('social_url', e.target.value)}
                                        placeholder="https://tiktok.com/@moncompte"
                                    />
                                    {errors.social_url && (
                                        <p className="text-sm text-destructive">
                                            {errors.social_url}
                                        </p>
                                    )}
                                </div>
                            )}

                            {data.type === 'pdf' && (
                                <div className="space-y-2">
                                    <Label htmlFor="pdf_file">Fichier PDF</Label>
                                    <Input
                                        id="pdf_file"
                                        type="file"
                                        accept="application/pdf"
                                        onChange={handleSingleFile('pdf_file')}
                                        className="cursor-pointer file:cursor-pointer"
                                    />
                                    <p className="text-xs text-muted-foreground">10 Mo maximum.</p>
                                    {errors.pdf_file && (
                                        <p className="text-sm text-destructive">{errors.pdf_file}</p>
                                    )}
                                </div>
                            )}

                            {data.type === 'images' && (
                                <div className="space-y-2">
                                    <Label htmlFor="images">Photos (jusqu'à 10)</Label>
                                    <Input
                                        id="images"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleMultiFiles}
                                        className="cursor-pointer file:cursor-pointer"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {data.images.length > 0
                                            ? `${data.images.length} image(s) sélectionnée(s) · 5 Mo max/image`
                                            : '5 Mo maximum par image.'}
                                    </p>
                                    {errors.images && (
                                        <p className="text-sm text-destructive">{errors.images}</p>
                                    )}
                                </div>
                            )}

                            {data.type === 'video' && (
                                <div className="space-y-2">
                                    <Label htmlFor="video_file">Fichier vidéo</Label>
                                    <Input
                                        id="video_file"
                                        type="file"
                                        accept="video/mp4,video/quicktime,video/webm"
                                        onChange={handleSingleFile('video_file')}
                                        className="cursor-pointer file:cursor-pointer"
                                    />
                                    <p className="text-xs text-muted-foreground">50 Mo maximum.</p>
                                    {errors.video_file && (
                                        <p className="text-sm text-destructive">
                                            {errors.video_file}
                                        </p>
                                    )}
                                </div>
                            )}

                            {data.type === 'mp3' && (
                                <div className="space-y-2">
                                    <Label htmlFor="mp3_file">Fichier audio</Label>
                                    <Input
                                        id="mp3_file"
                                        type="file"
                                        accept="audio/mpeg,audio/wav,audio/ogg,audio/mp4"
                                        onChange={handleSingleFile('mp3_file')}
                                        className="cursor-pointer file:cursor-pointer"
                                    />
                                    <p className="text-xs text-muted-foreground">20 Mo maximum.</p>
                                    {errors.mp3_file && (
                                        <p className="text-sm text-destructive">{errors.mp3_file}</p>
                                    )}
                                </div>
                            )}

                            {data.type === 'menu' && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="menu_title">Nom du menu</Label>
                                        <Input
                                            id="menu_title"
                                            value={data.menu_title}
                                            onChange={(e) => setData('menu_title', e.target.value)}
                                            placeholder="Ex. Carte du restaurant"
                                        />
                                        {errors.menu_title && (
                                            <p className="text-sm text-destructive">
                                                {errors.menu_title}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="menu_description">
                                            Description (optionnel)
                                        </Label>
                                        <Input
                                            id="menu_description"
                                            value={data.menu_description}
                                            onChange={(e) =>
                                                setData('menu_description', e.target.value)
                                            }
                                            placeholder="Ex. Cuisine locale, produits frais"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Plats</Label>
                                        <div className="space-y-2">
                                            {data.items.map((item, index) => (
                                                <div key={index} className="flex gap-2">
                                                    <Input
                                                        value={item.name}
                                                        onChange={(e) =>
                                                            updateItem(index, 'name', e.target.value)
                                                        }
                                                        placeholder="Ex. Poulet braisé"
                                                        className="flex-1"
                                                    />
                                                    <Input
                                                        value={item.price}
                                                        onChange={(e) =>
                                                            updateItem(index, 'price', e.target.value)
                                                        }
                                                        placeholder="Prix"
                                                        className="w-24"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => removeItem(index)}
                                                        disabled={data.items.length === 1}
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={addItem}
                                            className="w-full"
                                        >
                                            <Plus className="size-4" /> Ajouter un plat
                                        </Button>
                                        {errors.items && (
                                            <p className="text-sm text-destructive">{errors.items}</p>
                                        )}
                                    </div>
                                </>
                            )}

                            {data.type === 'link_list' && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="link_list_title">Titre</Label>
                                        <Input
                                            id="link_list_title"
                                            value={data.link_list_title}
                                            onChange={(e) =>
                                                setData('link_list_title', e.target.value)
                                            }
                                            placeholder="Ex. Retrouvez-moi partout"
                                        />
                                        {errors.link_list_title && (
                                            <p className="text-sm text-destructive">
                                                {errors.link_list_title}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="link_list_bio">Bio (optionnel)</Label>
                                        <Input
                                            id="link_list_bio"
                                            value={data.link_list_bio}
                                            onChange={(e) =>
                                                setData('link_list_bio', e.target.value)
                                            }
                                            placeholder="Ex. Créateur de contenu"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Liens</Label>
                                        <div className="space-y-2">
                                            {data.links.map((link, index) => (
                                                <div key={index} className="flex gap-2">
                                                    <Input
                                                        value={link.label}
                                                        onChange={(e) =>
                                                            updateLink(index, 'label', e.target.value)
                                                        }
                                                        placeholder="Ex. Ma chaîne YouTube"
                                                        className="flex-1"
                                                    />
                                                    <Input
                                                        value={link.url}
                                                        onChange={(e) =>
                                                            updateLink(index, 'url', e.target.value)
                                                        }
                                                        placeholder="https://..."
                                                        className="flex-1"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => removeLink(index)}
                                                        disabled={data.links.length === 1}
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={addLink}
                                            className="w-full"
                                        >
                                            <Plus className="size-4" /> Ajouter un lien
                                        </Button>
                                        {errors.links && (
                                            <p className="text-sm text-destructive">{errors.links}</p>
                                        )}
                                    </div>
                                </>
                            )}

                            <div className="space-y-2">
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
                                    <p className="text-sm text-destructive">{errors.scan_limit}</p>
                                )}
                            </div>

                            <Button type="submit" disabled={processing} className="w-full">
                                <Upload className="size-4" />
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
        { title: 'Tableau de bord', href: dashboard() },
        { title: 'Mes QR codes', href: '/qr-codes' },
        { title: 'Nouveau', href: '/qr-codes/create' },
    ],
};
