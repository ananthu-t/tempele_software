<?php

namespace App\Http\Controllers;

use App\Models\Temple;
use App\Models\Devaswom;
use App\Models\District;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TempleController extends Controller
{
    public function index()
    {
        return Inertia::render('Temples/Index', [
            'temples' => Temple::with(['devaswom', 'district', 'taluk', 'panchayat'])->get(),
            'devaswoms' => Devaswom::all(),
            'districts' => District::with('taluks.panchayats')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Temples/Create', [
            'devaswoms' => Devaswom::all(),
            'districts' => District::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_ml' => 'nullable|string|max:255',
            'devaswom_id' => 'nullable|exists:devaswoms,id',
            'district_id' => 'nullable|exists:districts,id',
            'taluk_id' => 'nullable|exists:taluks,id',
            'panchayat_id' => 'nullable|exists:panchayats,id',
            'address' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
        ]);

        Temple::create($validated);

        return redirect()->route('temples.index')->with('success', 'Temple added successfully.');
    }

    public function edit(Temple $temple)
    {
        return Inertia::render('Temples/Edit', [
            'temple' => $temple->load(['devaswom', 'district', 'taluk', 'panchayat']),
            'devaswoms' => Devaswom::all(),
            'districts' => District::all(),
        ]);
    }

    public function update(Request $request, Temple $temple)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_ml' => 'nullable|string|max:255',
            'devaswom_id' => 'nullable|exists:devaswoms,id',
            'district_id' => 'nullable|exists:districts,id',
            'taluk_id' => 'nullable|exists:taluks,id',
            'panchayat_id' => 'nullable|exists:panchayats,id',
            'address' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
        ]);

        $temple->update($validated);

        return redirect()->route('temples.index')->with('success', 'Temple updated successfully.');
    }

    public function destroy(Temple $temple)
    {
        $temple->delete();
        return redirect()->route('temples.index')->with('success', 'Temple removed.');
    }
}
