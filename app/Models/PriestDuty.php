<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongToTemple;
use App\Traits\HasAuditLog;

class PriestDuty extends Model
{
    use HasFactory, BelongToTemple, HasAuditLog;

    protected $fillable = ['temple_id', 'staff_id', 'duty_date', 'shift', 'remarks'];

    protected $casts = [
        'duty_date' => 'date',
    ];

    public function staff()
    {
        return $this->belongsTo(Staff::class);
    }
}
