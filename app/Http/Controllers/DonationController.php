<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DonationController extends Controller
{
    public function index()
    {
        return Inertia::render('Donations/Index', [
            'donations' => Donation::latest()->paginate(20),
        ]);
    }

    public function create()
    {
        return Inertia::render('Donations/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'donor_name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'amount' => 'required|numeric|min:1',
            'purpose' => 'required|string|max:255',
            'payment_mode' => 'required|string',
            'is_anonymous' => 'required|boolean',
            'remarks' => 'nullable|string',
        ]);

        // Generate Receipt Number
        $count = Donation::count() + 1;
        $receipt = "DON-" . date('Y') . "-" . str_pad($count, 5, '0', STR_PAD_LEFT);

        $donation = Donation::create(array_merge($validated, [
            'receipt_number' => $receipt,
            'donation_date' => now(),
        ]));

        return redirect()->route('donations.index')->with('success', 'Donation recorded. Receipt: ' . $receipt);
    }

    public function show(Donation $donation)
    {
        return Inertia::render('Donations/Show', [
            'donation' => $donation,
        ]);
    }
}
