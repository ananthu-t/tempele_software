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

        $templeId = auth()->user()->temple_id ?? 1;

        if ($validated['is_default'] ?? false) {
            ReceiptTemplate::where('temple_id', $templeId)
                ->where('type', $validated['type'])
                ->update(['is_default' => false]);
        }

        ReceiptTemplate::create(array_merge($validated, ['temple_id' => $templeId]));

        return redirect()->back()->with('success', 'New ritual receipt template enshrined.');
    }

    public function update(Request $request, ReceiptTemplate $template)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:Vazhipadu,Donation,Advance,Refund',
            'header_content' => 'nullable|string',
            'footer_content' => 'nullable|string',
            'layout_config' => 'nullable|array',
            'is_default' => 'boolean',
        ]);

        if ($validated['is_default'] ?? false) {
            ReceiptTemplate::where('temple_id', $template->temple_id)
                ->where('type', $validated['type'])
                ->where('id', '!=', $template->id)
                ->update(['is_default' => false]);
        }

        $template->update($validated);

        return redirect()->back()->with('success', 'Receipt layout recalibrated successfully.');
    }

    public function destroy(ReceiptTemplate $template)
    {
        if ($template->is_default) {
            return redirect()->back()->with('error', 'Cannot delete the default template. Assign another default first.');
        }
        $template->delete();
        return redirect()->back()->with('success', 'Template removed from archive.');
    }
}
