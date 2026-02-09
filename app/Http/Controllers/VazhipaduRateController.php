<?php

namespace App\Http\Controllers;

use App\Models\VazhipaduRate;
use App\Models\Vazhipadu;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VazhipaduRateController extends Controller
{
    public function index()
    {
        return Inertia::render('VazhipaduRates/Index', [
            'rates' => VazhipaduRate::with('vazhipadu')->get(),
            'vazhipadus' => Vazhipadu::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vazhipadu_id' => 'required|exists:vazhipadus,id',
            'amount' => 'required|numeric|min:0',
            'effective_from' => 'required|date',
            'effective_to' => 'nullable|date|after_or_equal:effective_from',
            'rule_type' => 'required|in:base,festival,star,special',
            'rule_config' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        VazhipaduRate::create($validated);

        return redirect()->back()->with('success', 'Rate rule added.');
    }

    public function update(Request $request, VazhipaduRate $vazhipaduRate)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'effective_from' => 'required|date',
            'effective_to' => 'nullable|date|after_or_equal:effective_from',
            'rule_type' => 'required|in:base,festival,star,special',
            'rule_config' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $vazhipaduRate->update($validated);

        return redirect()->back()->with('success', 'Rate rule updated.');
    }

    public function destroy(VazhipaduRate $vazhipaduRate)
    {
        $vazhipaduRate->delete();
        return redirect()->back()->with('success', 'Rate rule removed.');
    }
}
