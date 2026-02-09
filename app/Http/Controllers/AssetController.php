<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssetController extends Controller
{
    public function index()
    {
        return Inertia::render('Assets/Index', [
            'assets' => Asset::all(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Assets/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_ml' => 'nullable|string|max:255',
            'type' => 'required|string', // Hall, Vehicle, Sound, etc.
            'base_rate' => 'required|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        Asset::create($validated);

        return redirect()->route('assets.index')->with('success', 'Asset added successfully.');
    }

    public function edit(Asset $asset)
    {
        return Inertia::render('Assets/Edit', [
            'asset' => $asset,
        ]);
    }

    public function update(Request $request, Asset $asset)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_ml' => 'nullable|string|max:255',
            'type' => 'required|string',
            'base_rate' => 'required|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        $asset->update($validated);

        return redirect()->route('assets.index')->with('success', 'Asset updated successfully.');
    }

    public function destroy(Asset $asset)
    {
        $asset->delete();
        return redirect()->route('assets.index')->with('success', 'Asset removed.');
    }
}
