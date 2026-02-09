<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\BelongToTemple;

class Asset extends Model
{
    use HasFactory, SoftDeletes, BelongToTemple;

    protected $fillable = ['temple_id', 'name', 'name_ml', 'type', 'description', 'base_rate', 'rate_unit', 'is_available'];

    public function bookings()
    {
        return $this->hasMany(AssetBooking::class);
    }
}
