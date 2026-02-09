<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\BelongToTemple;

class Ledger extends Model
{
    use HasFactory, SoftDeletes, BelongToTemple;

    protected $fillable = [
        'temple_id',
        'fiscal_year_id',
        'account_id',
        'type',
        'category',
        'amount',
        'transaction_date',
        'reference_type',
        'reference_id',
        'description',
        'payment_mode'
    ];

    public function fiscalYear()
    {
        return $this->belongsTo(FiscalYear::class);
    }

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    protected $casts = [
        'transaction_date' => 'date',
    ];
}
