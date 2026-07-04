<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->decimal('price_monthly', 8, 2)->default(0);
            $table->unsignedInteger('max_qrcodes')->nullable();
            $table->unsignedInteger('max_scans_per_qrcode')->nullable();
            $table->unsignedInteger('max_dynamic_qrcodes')->nullable();
            $table->unsignedInteger('history_retention_days')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
