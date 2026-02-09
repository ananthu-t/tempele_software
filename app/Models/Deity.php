<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\BelongToTemple;

class Deity extends Model
{
    use HasFactory, SoftDeletes, BelongToTemple;

    protected $fillable = ['temple_id', 'name', 'name_ml', 'description'];

    public function vazhipadus()
    {
        return $this->hasMany(Vazhipadu::class);
    }
}
