<?php

namespace App\Traits;

use App\Models\ActivityLog;

trait HasAuditLog
{
    protected static function bootHasAuditLog()
    {
        static::created(function ($model) {
            static::logActivity($model, 'created');
        });

        static::updated(function ($model) {
            static::logActivity($model, 'updated');
        });

        static::deleted(function ($model) {
            static::logActivity($model, 'deleted');
        });
    }

    protected static function logActivity($model, $action)
    {
        ActivityLog::create([
            'temple_id' => $model->temple_id ?? session('temple_id'),
            'user_id' => auth()->id(),
            'action' => $action,
            'auditable_type' => get_class($model),
            'auditable_id' => $model->id,
            'old_values' => $action === 'updated' ? array_intersect_key($model->getOriginal(), $model->getChanges()) : null,
            'new_values' => $action !== 'deleted' ? $model->getChanges() : null,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
