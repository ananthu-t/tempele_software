<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongToTemple;

class ItemSale extends Model
{
    use HasFactory, BelongToTemple;

    protected $fillable = [
        'temple_id',
        'total_amount',
        'payment_mode',
        'account_id',
        'remarks',
    ];

    public function items()
    {
        return $this->hasMany(ItemSaleItem::class);
    }

    public function account()
    {
        return $this->belongsTo(Account::class);
    }
}
