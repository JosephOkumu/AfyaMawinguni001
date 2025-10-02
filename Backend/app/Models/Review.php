<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    protected $fillable = [
        'patient_id',
        'doctor_id', 
        'nursing_provider_id',
        'appointment_id',
        'nursing_service_id',
        'rating',
        'review_text'
    ];

    protected $casts = [
        'rating' => 'integer',
    ];

    public function patient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class, 'doctor_id');
    }

    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class, 'appointment_id');
    }

    public function nursingProvider(): BelongsTo
    {
        return $this->belongsTo(NursingProvider::class, 'nursing_provider_id');
    }

    public function nursingService(): BelongsTo
    {
        return $this->belongsTo(NursingService::class, 'nursing_service_id');
    }
}
