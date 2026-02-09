<?php

namespace App\Http\Controllers;

use App\Models\ItemSale;
use App\Models\ItemSaleItem;
use App\Models\InventoryItem;
use App\Models\StockLog;
use App\Models\Ledger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class QuickSaleController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:inventory_items,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
            'payment_mode' => 'required|string',
            'account_id' => 'required|exists:accounts,id', // Source/Target Asset account
            'total_amount' => 'required|numeric|min:0',
            'remarks' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated) {
            $temple_id = session('temple_id');

            // 1. Create Sale Record
            $sale = ItemSale::create([
                'temple_id' => $temple_id,
                'total_amount' => $validated['total_amount'],
                'payment_mode' => $validated['payment_mode'],
                'account_id' => $validated['account_id'],
                'remarks' => $validated['remarks'],
            ]);

            foreach ($validated['items'] as $itemData) {
                $inventoryItem = InventoryItem::find($itemData['id']);
                $totalPrice = $itemData['quantity'] * $itemData['unit_price'];

                // 2. Create Sale Item
                ItemSaleItem::create([
                    'item_sale_id' => $sale->id,
                    'inventory_item_id' => $inventoryItem->id,
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $itemData['unit_price'],
                    'total_price' => $totalPrice,
                ]);

                // 3. Update Stock
                $inventoryItem->decrement('current_stock', $itemData['quantity']);

                // 4. Create Stock Log
                StockLog::create([
                    'inventory_item_id' => $inventoryItem->id,
                    'type' => 'Out',
                    'quantity' => $itemData['quantity'],
                    'remarks' => 'Quick Sale: ' . ($sale->remarks ?? 'Direct Counter Transaction'),
                    'date' => now(),
                ]);
            }

            // 5. Create Ledger Entry
            // Debit (Cash/Bank increased)
            Ledger::create([
                'temple_id' => $temple_id,
                'account_id' => $validated['account_id'],
                'date' => now(),
                'particulars' => 'Quick Items Sale (Ref# ' . $sale->id . ')',
                'debit' => $validated['total_amount'],
                'credit' => 0,
                'balance' => 0, // Calculated by observer or trigger if any
            ]);

            return response()->json([
                'message' => 'Sacred transaction recorded!',
                'sale' => $sale
            ]);
        });
    }

    public function search(Request $request)
    {
        $query = $request->get('q');
        $items = InventoryItem::where('temple_id', session('temple_id'))
            ->where('name', 'LIKE', "%{$query}%")
            ->where('current_stock', '>', 0)
            ->get();

        return response()->json($items);
    }
}
