<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NursingProviderUnavailableSession extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'nursing_provider_unavailable_sessions';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nursing_provider_id',
        'date',
        'start_time',
        'end_time',
        'reason',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date' => 'date',
    ];

    /**
     * Get the start time formatted as H:i.
     *
     * @param  string  $value
     * @return string
     */
    public function getStartTimeAttribute($value)
    {
        return date('H:i', strtotime($value));
    }

    /**
     * Get the end time formatted as H:i.
     *
     * @param  string  $value
     * @return string
     */
    public function getEndTimeAttribute($value)
    {
        return date('H:i', strtotime($value));
    }

    /**
     * Get the nursing provider that owns the unavailable session.
     */
    public function nursingProvider()
    {
        return $this->belongsTo(NursingProvider::class);
    }

    /**
     * Scope to get unavailable sessions for a specific provider and date.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  int  $providerId
     * @param  string  $date
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeForProviderAndDate($query, $providerId, $date)
    {
        return $query->where('nursing_provider_id', $providerId)
                     ->where('date', $date);
    }

    /**
     * Scope to get future unavailable sessions.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeFuture($query)
    {
        return $query->where('date', '>=', now()->toDateString());
    }

    /**
     * Check if a time slot overlaps with this unavailable session.
     *
     * @param  string  $startTime
     * @param  string  $endTime
     * @return bool
     */
    public function overlapsWithTimeSlot($startTime, $endTime)
    {
        $sessionStart = strtotime($this->start_time);
        $sessionEnd = strtotime($this->end_time);
        $slotStart = strtotime($startTime);
        $slotEnd = strtotime($endTime);

        return $slotStart < $sessionEnd && $slotEnd > $sessionStart;
    }

    /**
     * Get formatted time range for display.
     *
     * @return string
     */
    public function getFormattedTimeRangeAttribute()
    {
        return date('g:i A', strtotime($this->start_time)) . ' - ' . date('g:i A', strtotime($this->end_time));
    }
}
