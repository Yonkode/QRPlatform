<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class QrCode extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'folder_id',
        'label',
        'type',
        'mode',
        'slug',
        'content',
        'style',
        'scan_limit',
        'scan_count',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'content' => 'array',
            'style' => 'array',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (QrCode $qrCode) {
            if (empty($qrCode->slug)) {
                $qrCode->slug = self::generateUniqueSlug();
            }
        });
    }

    public static function generateUniqueSlug(): string
    {
        do {
            $slug = Str::lower(Str::random(8));
        } while (self::where('slug', $slug)->exists());

        return $slug;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function folder(): BelongsTo
    {
        return $this->belongsTo(Folder::class);
    }

    public function scans(): HasMany
    {
        return $this->hasMany(QrScan::class);
    }

    public function quotaLogs(): HasMany
    {
        return $this->hasMany(QrCodeQuotaLog::class);
    }

    public function files(): HasMany
    {
        return $this->hasMany(QrCodeFile::class)->orderBy('order');
    }

    public function hasReachedLimit(): bool
    {
        return $this->scan_limit !== null && $this->scan_count >= $this->scan_limit;
    }

    public function isDynamic(): bool
    {
        return $this->mode === 'dynamic';
    }

    /**
     * Groupe technique selon la typologie du cahier des charges (section 3.2).
     */
    public function group(): string
    {
        return match ($this->type) {
            'pdf', 'images', 'video', 'menu', 'business', 'mp3', 'link_list', 'coupon' => 'A',
            'website', 'app', 'facebook', 'instagram', 'social' => 'B',
            'wifi', 'vcard', 'whatsapp' => 'C',
        };
    }

    public function publicUrl(): string
    {
        return $this->group() === 'B'
            ? route('qr.redirect', $this->slug)
            : route('qr.show', $this->slug);
    }

    
}