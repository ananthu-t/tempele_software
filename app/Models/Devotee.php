<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\BelongToTemple;

class Devotee extends Model
{
    use HasFactory, SoftDeletes, BelongToTemple;

    protected $fillable = [
        'temple_id',
        'name',
        'name_ml',
        'phone',
        'email',
        'address',
        'dob',
        'star',
        'family_members'
    ];

    protected $casts = [
        'family_members' => 'array',
        'dob' => 'date',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function donations()
    {
        return $this->hasMany(Donation::class);
    }
}
