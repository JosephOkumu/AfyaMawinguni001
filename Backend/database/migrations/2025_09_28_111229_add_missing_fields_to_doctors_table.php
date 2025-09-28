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
            // Check if columns don't exist before adding them
            if (!Schema::hasColumn('doctors', 'description')) {
                $table->text('description')->nullable()->after('specialty');
            }
            if (!Schema::hasColumn('doctors', 'professional_summary')) {
                $table->text('professional_summary')->nullable()->after('description');
            }
            if (!Schema::hasColumn('doctors', 'years_of_experience')) {
                $table->string('years_of_experience')->nullable()->after('professional_summary');
            }
            if (!Schema::hasColumn('doctors', 'physical_consultation_fee')) {
                $table->decimal('physical_consultation_fee', 10, 2)->nullable()->after('consultation_fee');
            }
            if (!Schema::hasColumn('doctors', 'online_consultation_fee')) {
                $table->decimal('online_consultation_fee', 10, 2)->nullable()->after('physical_consultation_fee');
            }
            if (!Schema::hasColumn('doctors', 'languages')) {
                $table->text('languages')->nullable()->after('online_consultation_fee');
            }
            if (!Schema::hasColumn('doctors', 'accepts_insurance')) {
                $table->boolean('accepts_insurance')->default(false)->after('languages');
            }
            if (!Schema::hasColumn('doctors', 'consultation_modes')) {
                $table->json('consultation_modes')->nullable()->after('accepts_insurance');
            }
            if (!Schema::hasColumn('doctors', 'appointment_duration_minutes')) {
                $table->integer('appointment_duration_minutes')->default(30)->after('availability_schedule');
            }
            if (!Schema::hasColumn('doctors', 'repeat_weekly')) {
                $table->boolean('repeat_weekly')->default(true)->after('appointment_duration_minutes');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('doctors', function (Blueprint $table) {
            //
        });
    }
};
