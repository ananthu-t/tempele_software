<?php

namespace App\Http\Controllers;

use App\Models\Temple;
use App\Models\ReceiptTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class SettingsController extends Controller
{
    public function index()
    {
        // For now, manage the first temple's settings (assuming single temple ERP or super-admin view)
        $temple = Temple::first() ?? new Temple();

        return Inertia::render('Settings/Index', [
            'settings' => $temple,
            'receipt_templates' => ReceiptTemplate::where('temple_id', $temple->id)->get(),
        ]);
    }

    public function update(Request $request)
    {
        $temple = Temple::first();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_ml' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'address_ml' => 'nullable|string',
            'printer_id' => 'nullable|string',
            'printer_type' => 'required|in:USB,Bluetooth,Network',
            'paper_size' => 'required|in:58mm,80mm',
            'receipt_header' => 'nullable|string',
            'receipt_footer' => 'nullable|string',
            'logo_file' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('logo_file')) {
            if ($temple->logo) {
                Storage::disk('public')->delete($temple->logo);
            }
            $path = $request->file('logo_file')->store('temple-logos', 'public');
            $validated['logo'] = $path;
        }

        $temple->update($validated);

        return redirect()->back()->with('success', 'Master settings updated successfully.');
    }
}