<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Panchayat extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['taluk_id', 'name', 'name_ml'];

    public function taluk()
    {
        return $this->belongsTo(Taluk::class);
    }

    public function temples()
    {
        return $this->hasMany(Temple::class);
    }
}
