<?php

namespace App\Http\Controllers;

use App\Models\FiscalYear;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FiscalYearController extends Controller
{
    public function index()
    {
        return Inertia::render('FiscalYears/Index', [
            'fiscalYears' => FiscalYear::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_active' => 'boolean',
        ]);

        if ($validated['is_active']) {
            FiscalYear::where('temple_id', session('temple_id'))->update(['is_active' => false]);
        }

        FiscalYear::create($validated);

        return redirect()->back()->with('success', 'Fiscal Year created.');
    }

    public function toggleStatus(FiscalYear $fiscalYear)
    {
        $fiscalYear->update(['is_active' => !$fiscalYear->is_active]);
        return redirect()->back();
    }
}
