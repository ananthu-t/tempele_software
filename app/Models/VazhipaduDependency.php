<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VazhipaduDependency extends Model
{
    use HasFactory;

    protected $fillable = ['vazhipadu_id', 'required_vazhipadu_id', 'required_quantity'];

    public function vazhipadu()
    {
        return $this->belongsTo(Vazhipadu::class);
    }

    public function requiredVazhipadu()
    {
        return $this->belongsTo(Vazhipadu::class, 'required_vazhipadu_id');
    }
}
