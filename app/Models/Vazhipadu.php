<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\BelongToTemple;
use App\Traits\HasAuditLog;

class Vazhipadu extends Model
{
    use HasFactory, SoftDeletes, BelongToTemple, HasAuditLog;

    protected $fillable = [
        'temple_id',
        'category_id',
        'name',
        'name_ml',
        'rate',
        'duration',
        'description',
        'nakshatras'
    ];

    protected $casts = [
        'nakshatras' => 'array',
    ];

    public function category()
    {
        return $this->belongsTo(VazhipaduCategory::class, 'category_id');
    }

    public function rates()
    {
        return $this->hasMany(VazhipaduRate::class);
    }

    public function dependencies()
    {
        return $this->hasMany(VazhipaduDependency::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
