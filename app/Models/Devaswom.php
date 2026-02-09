<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Devaswom extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['name', 'name_ml', 'address', 'phone', 'email'];

    public function temples()
    {
        return $this->hasMany(Temple::class);
    }
}
