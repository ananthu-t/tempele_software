<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Taluk extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['district_id', 'name', 'name_ml'];

    public function district()
    {
        return $this->belongsTo(District::class);
    }

    public function panchayats()
    {
        return $this->hasMany(Panchayat::class);
    }

    public function temples()
    {
        return $this->hasMany(Temple::class);
    }
}
