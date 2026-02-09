<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\BelongToTemple;

class Donation extends Model
{
    use HasFactory, SoftDeletes, BelongToTemple;

    protected $fillable = [
        'temple_id',
        'devotee_id',
        'deity_id',
        'donor_name',
        'phone',
        'is_anonymous',
        'purpose',
        'amount',
        'receipt_number',
        'donation_date',
        'payment_mode',
        'payment_status',
        'remarks'
    ];

    public function devotee()
    {
        return $this->belongsTo(Devotee::class);
    }

    public function deity()
    {
        return $this->belongsTo(Deity::class);
    }
}
