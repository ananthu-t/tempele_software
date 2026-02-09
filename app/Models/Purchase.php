<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Temple;
use App\Models\Account;
use App\Models\PurchaseItem;

class Purchase extends Model
{
    use HasFactory;

    protected $fillable = [
        'temple_id',
        'vendor_name',
        'bill_number',
        'bill_date',
        'total_amount',
        'payment_mode',
        'account_id',
        'expense_account_id',
        'remarks',
    ];

    public function temple()
    {
        return $this->belongsTo(Temple::class);
    }

    public function account()
    {
        return $this->belongsTo(Account::class, 'account_id');
    }

    public function expenseAccount()
    {
        return $this->belongsTo(Account::class, 'expense_account_id');
    }

    public function items()
    {
        return $this->hasMany(PurchaseItem::class);
    }
}
