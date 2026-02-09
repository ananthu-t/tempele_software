<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\AssetBooking;
use App\Models\Devotee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssetBookingController extends Controller
{
    public function index()
    {
        return Inertia::render('AssetBookings/Index', [
            'bookings' => AssetBooking::with(['asset', 'devotee'])->latest()->paginate(20),
        ]);
    }

    public function show(AssetBooking $assetBooking)
    {
        return Inertia::render('AssetBookings/Show', [
            'booking' => $assetBooking->load('asset', 'devotee'),
        ]);
    }

    public function create()
    {
        return Inertia::render('AssetBookings/Create', [
            'assets' => Asset::all(),
            'devotees' => Devotee::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'asset_id' => 'required|exists:assets,id',
            'devotee_id' => 'required|exists:devotees,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'total_amount' => 'required|numeric|min:0',
            'advance_paid' => 'required|numeric|min:0',
            'payment_mode' => 'required|string',
            'remarks' => 'nullable|string',
        ]);

        $booking = AssetBooking::create(array_merge($validated, [
            'balance_amount' => $validated['total_amount'] - $validated['advance_paid'],
            'status' => 'Confirmed',
            'payment_status' => $validated['advance_paid'] >= $validated['total_amount'] ? 'Paid' : 'Partially Paid',
        ]));

        return redirect()->route('asset-bookings.index')->with('success', 'Asset booking confirmed.');
    }

    public function updateStatus(Request $request, AssetBooking $booking)
    {
        $request->validate(['status' => 'required|string']);
        $booking->update(['status' => $request->status]);
        return redirect()->back()->with('success', 'Booking status updated.');
    }
}
