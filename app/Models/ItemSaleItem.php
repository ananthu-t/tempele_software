<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ItemSaleItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_sale_id',
        'inventory_item_id',
        'quantity',
        'unit_price',
        'total_price',
    ];

    public function sale()
    {
        return $this->belongsTo(ItemSale::class, 'item_sale_id');
    }

    public function inventoryItem()
    {
        return $this->belongsTo(InventoryItem::class);
    }
}
