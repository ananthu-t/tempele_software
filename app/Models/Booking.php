<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\BelongToTemple;
use App\Traits\HasAuditLog;

class Booking extends Model
{
    use HasFactory, SoftDeletes, BelongToTemple, HasAuditLog;

    protected $fillable = [
        'temple_id',
        'devotee_id',
        'vazhipadu_id',
        'deity_id',
        'booking_date',
        'booking_time',
        'rate',
        'receipt_number',
        'total_amount',
        'discount',
        'net_amount',
        'payment_mode',
        'payment_status',
        'status',
        'remarks',
        'beneficiary_name',
        'beneficiary_name_ml',
        'beneficiary_nakshatra',
        'beneficiary_nakshatra_ml'
    ];

    protected $casts = [
        'booking_date' => 'date',
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
