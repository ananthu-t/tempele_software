<?php

namespace App\Http\Controllers;

use App\Models\VazhipaduCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VazhipaduCategoryController extends Controller
{
    public function index()
    {
        return Inertia::render('VazhipaduCategories/Index', [
            'categories' => VazhipaduCategory::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_ml' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        VazhipaduCategory::create($validated);

        return redirect()->back()->with('success', 'Category created.');
    }

    public function update(Request $request, VazhipaduCategory $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_ml' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $category->update($validated);

        return redirect()->back()->with('success', 'Category updated.');
    }

    public function destroy(VazhipaduCategory $category)
    {
        $category->delete();
        return redirect()->back()->with('success', 'Category removed.');
    }
}
