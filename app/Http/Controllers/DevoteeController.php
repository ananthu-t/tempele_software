<?php

namespace App\Http\Controllers;

use App\Models\Devotee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DevoteeController extends Controller
{
    public function index(Request $request)
    {
        $query = Devotee::query();
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('phone', 'like', "%{$request->search}%")
                    ->orWhere('name_ml', 'like', "%{$request->search}%");
            });
        }

        if ($request->wantsJson()) {
            return $query->limit(10)->get();
        }

        return Inertia::render('Devotees/Index', [
            'devotees' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Devotees/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_ml' => 'nullable|string|max:255',
            'phone' => 'required|string|max:15|unique:devotees,phone',
            'star' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        $devotee = Devotee::create($validated);

        if ($request->wantsJson()) {
            return response()->json($devotee);
        }

        return redirect()->route('devotees.index')->with('success', 'Devotee enrolled successfully.');
    }

    public function edit(Devotee $devotee)
    {
        return Inertia::render('Devotees/Edit', [
            'devotee' => $devotee
        ]);
    }

    public function update(Request $request, Devotee $devotee)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_ml' => 'nullable|string|max:255',
            'phone' => 'required|string|max:15|unique:devotees,phone,' . $devotee->id,
            'star' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        $devotee->update($validated);

        return redirect()->route('devotees.index')->with('success', 'Devotee updated successfully.');
    }

    public function destroy(Devotee $devotee)
    {
        $devotee->delete();
        return redirect()->route('devotees.index')->with('success', 'Devotee record removed.');
    }
}
