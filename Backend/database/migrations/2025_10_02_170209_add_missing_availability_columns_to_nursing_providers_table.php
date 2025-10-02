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
            // Add availability_schedule column if it doesn't exist
            if (!Schema::hasColumn('nursing_providers', 'availability_schedule')) {
                $table->json('availability_schedule')->nullable();
            }
            
            // Add repeat_weekly column if it doesn't exist
            if (!Schema::hasColumn('nursing_providers', 'repeat_weekly')) {
                $table->boolean('repeat_weekly')->default(true);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('nursing_providers', function (Blueprint $table) {
            // Drop the columns if they exist
            if (Schema::hasColumn('nursing_providers', 'availability_schedule')) {
                $table->dropColumn('availability_schedule');
            }
            
            if (Schema::hasColumn('nursing_providers', 'repeat_weekly')) {
                $table->dropColumn('repeat_weekly');
            }
        });
    }
};
