<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QrScan extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'qr_code_id',
        'scanned_at',
        'ip_address',
        'country',
        'city',
        'latitude',
        'longitude',
        'device_type',
        'os',
        'browser',
        'user_agent',
        'referer',
    ];

    protected function casts(): array
    {
        return [
            'scanned_at' => 'datetime',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
        ];
    }

    public function qrCode(): BelongsTo
    {
        return $this->belongsTo(QrCode::class);
    }
}
