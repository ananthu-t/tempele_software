<?php

namespace App\Http\Controllers;

use App\Models\Vazhipadu;
use App\Models\Devotee;
use App\Models\Deity;
use App\Models\Nakshatra;
use App\Models\Account;
use App\Models\Rashi;
use App\Models\Booking;
use Inertia\Inertia;
use Illuminate\Http\Request;

class CounterController extends Controller
{
    /**
     * Specialized fast-entry interface for temple counters.
     * Supports Manglish transliteration and quick search.
     */
    public function index()
    {
        return Inertia::render('Counter/Index', [
            'vazhipadus' => Vazhipadu::with('category')->where('is_active', true)->get(),
            'deities' => Deity::all(),
            'nakshatras' => Nakshatra::all(),
            'rashis' => Rashi::all(),
            'accounts' => Account::where('type', 'Revenue')->get(),
        ]);
    }

    /**
     * Search devotees by mobile or name (API for counter)
     */
    public function searchDevotees(Request $request)
    {
        $query = $request->get('q');
        return Devotee::where(function ($q) use ($query) {
            $q->where('phone', 'like', "%{$query}%")
                ->orWhere('name', 'like', "%{$query}%");
        })
            ->limit(10)
            ->get();
    }

    public function history(Request $request)
    {
        $query = Booking::query()
            ->with(['devotee', 'vazhipadu', 'deity'])
            ->latest();

        // Filters
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('receipt_number', 'like', "%{$search}%")
                    ->orWhere('beneficiary_name', 'like', "%{$search}%")
                    ->orWhereHas('devotee', function ($dq) use ($search) {
                        $dq->where('name', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->has('date_from')) {
            $query->whereDate('booking_date', '>=', $request->get('date_from'));
        }

        if ($request->has('date_to')) {
            $query->whereDate('booking_date', '<=', $request->get('date_to'));
        }

        if ($request->has('payment_mode') && $request->payment_mode !== 'All') {
            $query->where('payment_mode', $request->payment_mode);
        }

        return Inertia::render('Counter/History', [
            'bookings' => $query->paginate(20)->withQueryString(),
            'filters' => $request->only(['search', 'date_from', 'date_to', 'payment_mode']),
        ]);
    }
}
