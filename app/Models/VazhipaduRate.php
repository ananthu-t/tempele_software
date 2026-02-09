<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VazhipaduRate extends Model
{
    use HasFactory;

    protected $fillable = [
        'vazhipadu_id',
        'amount',
        'effective_from',
        'effective_to',
        'rule_type',
        'rule_config',
        'is_active'
    ];

    protected $casts = [
        'rule_config' => 'array',
        'effective_from' => 'date',
        'effective_to' => 'date',
        'is_active' => 'boolean',
    ];

    public function vazhipadu()
    {
        return $this->belongsTo(Vazhipadu::class);
    }
}
