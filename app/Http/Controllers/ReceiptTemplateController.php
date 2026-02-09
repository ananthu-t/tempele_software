<?php

namespace App\Http\Controllers;

use App\Models\ReceiptTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReceiptTemplateController extends Controller
{
    public function index()
    {
        return Inertia::render('ReceiptTemplates/Index', [
            'templates' => ReceiptTemplate::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:Vazhipadu,Donation,Advance,Refund',
            'header_content' => 'nullable|string',
            'footer_content' => 'nullable|string',
            'layout_config' => 'nullable|array',
            'is_default' => 'boolean',
        ]);

        if ($validated['is_default']) {
            ReceiptTemplate::where('temple_id', session('temple_id'))
                ->where('type', $validated['type'])
                ->update(['is_default' => false]);
        }

        ReceiptTemplate::create($validated);

        return redirect()->back()->with('success', 'Template created.');
    }
}
