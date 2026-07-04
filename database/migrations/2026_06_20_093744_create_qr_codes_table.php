<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('qr_codes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('folder_id')->nullable()->constrained('folders')->nullOnDelete();
            $table->string('label', 150);
            $table->enum('type', [
                'website', 'pdf', 'images', 'video', 'wifi', 'menu',
                'business', 'vcard', 'mp3', 'app', 'link_list',
                'coupon', 'facebook', 'instagram', 'social', 'whatsapp',
            ]);
            $table->enum('mode', ['static', 'dynamic'])->default('dynamic');
            $table->string('slug', 20)->unique();
            $table->json('content');
            $table->json('style')->nullable();
            $table->unsignedInteger('scan_limit')->nullable();
            $table->unsignedInteger('scan_count')->default(0);
            $table->enum('status', ['active', 'paused', 'limit_reached'])->default('active');
            $table->timestamps();

            $table->index(['user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('qr_codes');
    }
};
