<?php

namespace App\Http\Controllers;

use App\Models\Deity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DeityController extends Controller
{
    public function index()
    {
        return Inertia::render('Deities/Index', [
            'deities' => Deity::all(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Deities/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_ml' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        Deity::create($validated);

        return redirect()->route('deities.index')->with('success', 'Deity added successfully.');
    }

    public function edit(Deity $deity)
    {
        return Inertia::render('Deities/Edit', [
            'deity' => $deity,
        ]);
    }

    public function update(Request $request, Deity $deity)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_ml' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $deity->update($validated);

        return redirect()->route('deities.index')->with('success', 'Deity updated successfully.');
    }

    public function destroy(Deity $deity)
    {
        $deity->delete();
        return redirect()->route('deities.index')->with('success', 'Deity removed.');
    }
}
