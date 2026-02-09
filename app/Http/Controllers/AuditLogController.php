<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditLogController extends Controller
{
    public function index()
    {
        return Inertia::render('Reports/AuditLogs', [
            'logs' => ActivityLog::with('user')
                ->latest()
                ->paginate(50)
        ]);
    }
}
