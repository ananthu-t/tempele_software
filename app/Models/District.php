<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class District extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['name', 'name_ml'];

    public function taluks()
    {
        return $this->hasMany(Taluk::class);
    }

    public function temples()
    {
        return $this->hasMany(Temple::class);
    }
}
