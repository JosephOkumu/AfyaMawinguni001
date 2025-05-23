<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LabProvider extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'lab_name',
        'description',
        'license_number',
        'certifications',
        'services_offered',
        'logo',
        'operating_hours',
        'address',
        'city',
        'offers_home_sample_collection',
        'home_collection_fee',
        'is_available',
        'average_rating',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'services_offered' => 'json',
        'operating_hours' => 'json',
        'offers_home_sample_collection' => 'boolean',
        'home_collection_fee' => 'decimal:2',
        'is_available' => 'boolean',
        'average_rating' => 'integer',
    ];

    /**
     * Get the user that owns the lab provider.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the lab tests for the lab provider.
     */
    public function labTests()
    {
        return $this->hasMany(LabTest::class);
    }
}
