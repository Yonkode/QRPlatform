<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QrCodeFile extends Model
{
    use HasFactory;

    protected $fillable = [
        'qr_code_id',
        'file_path',
        'file_type',
        'original_name',
        'order',
    ];

    public function qrCode(): BelongsTo
    {
        return $this->belongsTo(QrCode::class);
    }
}
