<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongToTemple;

class ReceiptTemplate extends Model
{
    use HasFactory, BelongToTemple;

    protected $fillable = [
        'temple_id',
        'name',
        'type', // Vazhipadu, Donation, Advance, Refund
        'header_content',
        'footer_content',
        'is_default',
        'layout_config', // JSON for CSS styles or column spans
    ];

    protected $casts = [
        'layout_config' => 'array',
        'is_default' => 'boolean',
    ];
}
