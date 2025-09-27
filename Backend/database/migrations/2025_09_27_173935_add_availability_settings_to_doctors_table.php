<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('doctors', function (Blueprint $table) {
            $table->json('availability_schedule')->nullable()->after('availability');
            $table->integer('appointment_duration_minutes')->default(30)->after('availability_schedule');
            $table->boolean('repeat_weekly')->default(true)->after('appointment_duration_minutes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('doctors', function (Blueprint $table) {
            $table->dropColumn(['availability_schedule', 'appointment_duration_minutes', 'repeat_weekly']);
        });
    }
};
