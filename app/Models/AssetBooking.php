<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\BelongToTemple;

class AssetBooking extends Model
{
    use HasFactory, SoftDeletes, BelongToTemple;

    protected $fillable = [
        'temple_id',
        'asset_id',
        'devotee_id',
        'start_date',
        'end_date',
        'total_amount',
        'advance_amount',
        'balance_amount',
        'payment_status',
        'status',
        'remarks'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function asset()
    {
        return $this->belongsTo(Asset::class);
    }

    public function devotee()
    {
        return $this->belongsTo(Devotee::class);
    }
}
