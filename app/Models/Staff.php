<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\BelongToTemple;

class Staff extends Model
{
    use HasFactory, SoftDeletes, BelongToTemple;

    protected $fillable = [
        'temple_id',
        'name',
        'name_ml',
        'role',
        'phone',
        'salary',
        'status',
        'duty_timing'
    ];
}
