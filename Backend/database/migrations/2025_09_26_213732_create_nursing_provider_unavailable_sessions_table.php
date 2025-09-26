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
        Schema::create('nursing_provider_unavailable_sessions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('nursing_provider_id');
            $table->foreign('nursing_provider_id', 'np_unavailable_provider_fk')->references('id')->on('nursing_providers')->onDelete('cascade');
            $table->date('date');
            $table->time('start_time');
            $table->time('end_time');
            $table->string('reason')->nullable();
            $table->timestamps();

            // Add indexes for better query performance
            $table->index(['nursing_provider_id', 'date'], 'np_unavail_provider_date_idx');
            $table->index(['date'], 'np_unavail_date_idx');

            // Prevent overlapping sessions for the same provider on the same date
            $table->unique(['nursing_provider_id', 'date', 'start_time', 'end_time'], 'np_unavailable_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nursing_provider_unavailable_sessions');
    }
};
