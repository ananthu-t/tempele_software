<?php

namespace App\Http\Controllers;

use App\Models\Vazhipadu;
use App\Models\VazhipaduCategory;
use App\Models\Nakshatra;
use Inertia\Inertia;
use Illuminate\Http\Request;

class VazhipaduController extends Controller
{
    public function index()
    {
        return Inertia::render('Vazhipadus/Index', [
            'vazhipadus' => Vazhipadu::with('category')->latest()->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Vazhipadus/Create', [
            'categories' => VazhipaduCategory::all(),
            'nakshatras' => Nakshatra::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'nullable|exists:vazhipadu_categories,id',
            'name' => 'required|string|max:255',
            'name_ml' => 'nullable|string|max:255',
            'rate' => 'required|numeric|min:0',
            'duration' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'nakshatras' => 'nullable|array',
        ]);

        Vazhipadu::create($validated);

        return redirect()->route('vazhipadus.index')->with('success', 'Vazhipadu created successfully.');
    }

    public function edit(Vazhipadu $vazhipadu)
    {
        return Inertia::render('Vazhipadus/Edit', [
            'vazhipadu' => $vazhipadu,
            'categories' => VazhipaduCategory::all(),
            'nakshatras' => Nakshatra::all(),
        ]);
    }

    public function update(Request $request, Vazhipadu $vazhipadu)
    {
        $validated = $request->validate([
            'category_id' => 'nullable|exists:vazhipadu_categories,id',
            'name' => 'required|string|max:255',
            'name_ml' => 'nullable|string|max:255',
            'rate' => 'required|numeric|min:0',
            'duration' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'nakshatras' => 'nullable|array',
        ]);

        $vazhipadu->update($validated);

        return redirect()->route('vazhipadus.index')->with('success', 'Vazhipadu updated successfully.');
    }

    public function destroy(Vazhipadu $vazhipadu)
    {
        $vazhipadu->delete();
        return redirect()->route('vazhipadus.index')->with('success', 'Vazhipadu removed.');
    }
}
