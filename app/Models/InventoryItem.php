<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\BelongToTemple;

class InventoryItem extends Model
{
    use HasFactory, SoftDeletes, BelongToTemple;

    protected $fillable = ['temple_id', 'name', 'name_ml', 'category', 'unit', 'current_stock', 'low_stock_threshold'];

    public function stockLogs()
    {
        return $this->hasMany(StockLog::class);
    }
}
