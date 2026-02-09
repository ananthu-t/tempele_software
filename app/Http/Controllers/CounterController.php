<?php

namespace App\Http\Controllers;

use App\Models\Vazhipadu;
use App\Models\Devotee;
use App\Models\Deity;
use App\Models\Nakshatra;
use App\Models\Rashi;
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
            'vazhipadus' => Vazhipadu::with('category')->get(),
            'deities' => Deity::all(),
            'nakshatras' => Nakshatra::all(),
            'rashis' => Rashi::all(),
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
}
