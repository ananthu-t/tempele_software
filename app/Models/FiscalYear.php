<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongToTemple;

class FiscalYear extends Model
{
    use HasFactory, BelongToTemple;

    protected $fillable = [
        'temple_id',
        'name',
        'start_date',
        'end_date',
        'is_active',
        'is_closed'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
        'is_closed' => 'boolean',
    ];

    public function ledgers()
    {
        return $this->hasMany(Ledger::class);
    }
}
