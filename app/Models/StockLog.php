<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Traits\BelongToTemple;

class StockLog extends Model
{
    use HasFactory, BelongToTemple;

    protected $fillable = ['temple_id', 'inventory_item_id', 'type', 'quantity', 'source_destination', 'remarks', 'user_id'];

    public function inventoryItem()
    {
        return $this->belongsTo(InventoryItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
