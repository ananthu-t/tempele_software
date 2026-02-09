<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\BelongToTemple;

class Account extends Model
{
    use HasFactory, SoftDeletes, BelongToTemple;

    protected $fillable = [
        'temple_id',
        'parent_id',
        'code',
        'name',
        'name_ml',
        'type',
        'balance',
        'is_system_defined'
    ];

    protected $casts = [
        'is_system_defined' => 'boolean',
        'balance' => 'decimal:2',
    ];

    public function parent()
    {
        return $this->belongsTo(Account::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Account::class, 'parent_id');
    }

    public function ledgers()
    {
        return $this->hasMany(Ledger::class);
    }
}
