<?php

namespace App\Traits;

use App\Models\Temple;
use Illuminate\Database\Eloquent\Builder;

trait BelongToTemple
{
    protected static function bootBelongToTemple()
    {
        static::creating(function ($model) {
            if (session()->has('temple_id')) {
                $model->temple_id = session('temple_id');
            }
        });

        static::addGlobalScope('temple', function (Builder $builder) {
            if (session()->has('temple_id')) {
                $builder->where('temple_id', session('temple_id'));
            }
        });
    }

    public function temple()
    {
        return $this->belongsTo(Temple::class);
    }
}
