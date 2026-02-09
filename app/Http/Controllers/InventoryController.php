<?php

namespace App\Http\Controllers;

use App\Models\InventoryItem;
use App\Models\StockLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function index()
    {
        return Inertia::render('Inventory/Index', [
            'items' => InventoryItem::all(),
            'recent_logs' => StockLog::with('item')->latest()->limit(10)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:inventory_items',
            'unit' => 'required|string', // kg, ltr, Nos, etc.
            'min_stock_level' => 'required|numeric|min:0',
            'current_stock' => 'required|numeric|min:0',
        ]);

        $item = InventoryItem::create($validated);

        // Log initial stock
        StockLog::create([
            'inventory_item_id' => $item->id,
            'type' => 'In',
            'quantity' => $validated['current_stock'],
            'remarks' => 'Initial stock entry',
            'date' => now(),
        ]);

        return redirect()->back()->with('success', 'Item added to inventory.');
    }

    public function updateStock(Request $request, InventoryItem $item)
    {
        $validated = $request->validate([
            'type' => 'required|in:In,Out',
            'quantity' => 'required|numeric|min:1',
            'remarks' => 'nullable|string',
        ]);

        $newStock = $validated['type'] === 'In'
            ? $item->current_stock + $validated['quantity']
            : $item->current_stock - $validated['quantity'];

        if ($newStock < 0) {
            return redirect()->back()->withErrors(['quantity' => 'Insufficient stock.']);
        }

        $item->update(['current_stock' => $newStock]);

        StockLog::create([
            'inventory_item_id' => $item->id,
            'type' => $validated['type'],
            'quantity' => $validated['quantity'],
            'remarks' => $validated['remarks'],
            'date' => now(),
        ]);

        return redirect()->back()->with('success', 'Stock updated successfully.');
    }
}
