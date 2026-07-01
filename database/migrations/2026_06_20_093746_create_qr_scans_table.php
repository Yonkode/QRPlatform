<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('qr_scans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('qr_code_id')->constrained('qr_codes')->cascadeOnDelete();
            $table->timestamp('scanned_at')->useCurrent();
            $table->string('ip_address', 45)->nullable();
            $table->string('country', 100)->nullable();
            $table->string('city', 100)->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('device_type', 50)->nullable();
            $table->string('os', 50)->nullable();
            $table->string('browser', 50)->nullable();
            $table->string('user_agent', 255)->nullable();
            $table->string('referer', 255)->nullable();

            $table->index(['qr_code_id', 'scanned_at']);
            $table->index('country');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('qr_scans');
    }
};