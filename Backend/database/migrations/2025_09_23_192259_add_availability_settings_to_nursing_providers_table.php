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
        Schema::table('nursing_providers', function (Blueprint $table) {
            // Only add columns that don't exist
            if (!Schema::hasColumn('nursing_providers', 'appointment_duration_minutes')) {
                $table->integer('appointment_duration_minutes')->default(30);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('nursing_providers', function (Blueprint $table) {
            if (Schema::hasColumn('nursing_providers', 'appointment_duration_minutes')) {
                $table->dropColumn('appointment_duration_minutes');
            }
        });
    }
};
