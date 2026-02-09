<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Donation;
use App\Models\Devotee;
use App\Models\Vazhipadu;
use App\Models\Temple;
use App\Models\ActivityLog;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // Stats are automatically scoped to temple_id via BelongToTemple trait
        $stats = [
            'total_bookings' => Booking::whereDate('booking_date', today())->count(),
            'total_collection' => Booking::whereDate('booking_date', today())->sum('net_amount') + Donation::whereDate('created_at', today())->sum('amount'),
            'total_devotees' => Devotee::count(),
            'vazhipadu_count' => Vazhipadu::count(),
        ];

        // Audit Trail for the temple
        $activities = ActivityLog::with('user')
            ->latest()
            ->limit(10)
            ->get();

        // Analytics: Collection trend for the last 7 days
        $collectionTrend = Booking::select(DB::raw('DATE(booking_date) as date'), DB::raw('SUM(net_amount) as total'))
            ->where('booking_date', '>=', now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // For Super Admin/Devaswom view: Comparison across temples
        // Note: This needs careful scoping if the user is not a super-admin
        $templeComparison = [];
        if (auth()->user()->hasRole('Super Admin')) {
            $templeComparison = Temple::with(['bookings' => fn($q) => $q->whereMonth('booking_date', now()->month)])
                ->get()
                ->map(fn($t) => [
                    'name' => $t->name,
                    'collection' => $t->bookings->sum('net_amount'),
                ]);
        }

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recent_bookings' => Booking::with(['devotee', 'vazhipadu'])->latest()->limit(5)->get(),
            'activities' => $activities,
            'collectionTrend' => $collectionTrend,
            'templeComparison' => $templeComparison,
        ]);
    }
}
