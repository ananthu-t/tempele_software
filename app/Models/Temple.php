<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Temple extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'devaswom_id',
        'district_id',
        'taluk_id',
        'panchayat_id',
        'name',
        'name_ml',
        'address',
        'address_ml',
        'phone',
        'email',
        'registration_number',
        'logo',
        'website'
    ];

    public function devaswom()
    {
        return $this->belongsTo(Devaswom::class);
    }

    public function district()
    {
        return $this->belongsTo(District::class);
    }

    public function taluk()
    {
        return $this->belongsTo(Taluk::class);
    }

    public function panchayat()
    {
        return $this->belongsTo(Panchayat::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function vazhipadus()
    {
        return $this->hasMany(Vazhipadu::class);
    }

    public function ledgers()
    {
        return $this->hasMany(Ledger::class);
    }

    public function devotees()
    {
        return $this->hasMany(Devotee::class);
    }

    public function donations()
    {
        return $this->hasMany(Donation::class);
    }

    public function staff()
    {
        return $this->hasMany(Staff::class);
    }

    public function fiscalYears()
    {
        return $this->hasMany(FiscalYear::class);
    }

    public function accounts()
    {
        return $this->hasMany(Account::class);
    }

    public function receiptTemplates()
    {
        return $this->hasMany(ReceiptTemplate::class);
    }

    public function priestDuties()
    {
        return $this->hasMany(PriestDuty::class);
    }
}
