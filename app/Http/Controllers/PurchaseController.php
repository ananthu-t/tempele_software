<?php

namespace App\Http\Controllers;

use App\Models\Purchase;
use App\Models\InventoryItem;
use App\Models\Account;
use App\Models\Ledger;
use App\Models\StockLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class PurchaseController extends Controller
{
    public function index()
    {
        return Inertia::render('Purchases/Index', [
            'purchases' => Purchase::with(['items.inventoryItem', 'account', 'expenseAccount'])->latest()->paginate(10),
            'inventory_items' => InventoryItem::all(),
            'accounts' => Account::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vendor_name' => 'nullable|string',
            'bill_number' => 'nullable|string',
            'bill_date' => 'required|date',
            'payment_mode' => 'required|string',
            'account_id' => 'required|exists:accounts,id',
            'expense_account_id' => 'required|exists:accounts,id',
            'remarks' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.inventory_item_id' => 'required|exists:inventory_items,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated) {
            $totalAmount = 0;
            foreach ($validated['items'] as $item) {
                $totalAmount += $item['quantity'] * $item['unit_price'];
            }

            $purchase = Purchase::create([
                'temple_id' => auth()->user()->temple_id ?? 1,
                'vendor_name' => $validated['vendor_name'],
                'bill_number' => $validated['bill_number'],
                'bill_date' => $validated['bill_date'],
                'total_amount' => $totalAmount,
                'payment_mode' => $validated['payment_mode'],
                'account_id' => $validated['account_id'],
                'expense_account_id' => $validated['expense_account_id'],
                'remarks' => $validated['remarks'],
            ]);

            foreach ($validated['items'] as $itemData) {
                $purchase->items()->create([
                    'inventory_item_id' => $itemData['inventory_item_id'],
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $itemData['unit_price'],
                    'total_price' => $itemData['quantity'] * $itemData['unit_price'],
                ]);

                // Update Inventory
                $invItem = InventoryItem::find($itemData['inventory_item_id']);
                $invItem->increment('current_stock', $itemData['quantity']);

                // Create Stock Log
                StockLog::create([
                    'inventory_item_id' => $invItem->id,
                    'type' => 'In',
                    'quantity' => $itemData['quantity'],
                    'remarks' => 'Purchase Entry #' . $purchase->id . ' / ' . ($validated['bill_number'] ?? 'No Bill #'),
                    'date' => $validated['bill_date'],
                ]);
            }

            // Ledger Entries
            // 1. Debit Expense
            Ledger::create([
                'account_id' => $validated['expense_account_id'],
                'type' => 'Debit',
                'category' => 'Purchase',
                'amount' => $totalAmount,
                'transaction_date' => $validated['bill_date'],
                'payment_mode' => $validated['payment_mode'],
                'description' => "Purchase Bill #" . ($validated['bill_number'] ?? $purchase->id) . " from " . ($validated['vendor_name'] ?? 'Vendor'),
                'reference_type' => 'Purchase',
                'reference_id' => $purchase->id,
            ]);

            // 2. Credit Asset/Source
            Ledger::create([
                'account_id' => $validated['account_id'],
                'type' => 'Credit',
                'category' => 'Purchase',
                'amount' => $totalAmount,
                'transaction_date' => $validated['bill_date'],
                'payment_mode' => $validated['payment_mode'],
                'description' => "Payment for Purchase Bill #" . ($validated['bill_number'] ?? $purchase->id),
                'reference_type' => 'Purchase',
                'reference_id' => $purchase->id,
            ]);
        });

        return redirect()->back()->with('success', 'Purchase entry enshrined and stock updated.');
    }
}
