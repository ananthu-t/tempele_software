<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\BelongToTemple;
use App\Traits\HasAuditLog;

class RecurringPooja extends Model
{
    use HasFactory, SoftDeletes, BelongToTemple, HasAuditLog;

    protected $fillable = [
        'temple_id',
        'devotee_id',
        'vazhipadu_id',
        'deity_id',
        'beneficiary_name',
        'frequency',
        'day_of_month',
        'month_of_year',
        'malayalam_month',
        'malayalam_star',
        'start_date',
        'last_booked_date',
        'next_due_date',
        'is_active',
    ];

    protected $casts = [
        'start_date' => 'date',
        'last_booked_date' => 'date',
        'next_due_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function devotee()
    {
        return $this->belongsTo(Devotee::class);
    }

    public function vazhipadu()
    {
        return $this->belongsTo(Vazhipadu::class);
    }

    public function deity()
    {
        return $this->belongsTo(Deity::class);
    }
}
