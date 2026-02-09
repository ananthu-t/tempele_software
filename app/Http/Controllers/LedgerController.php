<?php

namespace App\Http\Controllers;

use App\Models\Ledger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class LedgerController extends Controller
{
    public function index()
    {
        $transactions = Ledger::latest()->paginate(20);

        $summary = Ledger::select(
            DB::raw('SUM(CASE WHEN type = "Credit" THEN amount ELSE 0 END) as total_income'),
            DB::raw('SUM(CASE WHEN type = "Debit" THEN amount ELSE 0 END) as total_expense')
        )->first();

        return Inertia::render('Ledgers/Index', [
            'transactions' => $transactions,
            'summary' => [
                'income' => $summary->total_income ?? 0,
                'expense' => $summary->total_expense ?? 0,
                'balance' => ($summary->total_income ?? 0) - ($summary->total_expense ?? 0),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'type' => 'required|in:Credit,Debit',
            'category' => 'required|string', // Pooja, Donation, Salary, Electricity, etc.
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:1',
            'payment_mode' => 'required|string',
        ]);

        Ledger::create($validated);

        return redirect()->back()->with('success', 'Transaction recorded.');
    }

    public function report(Request $request)
    {
        $startDate = $request->input('start_date', now()->startOfMonth());
        $endDate = $request->input('end_date', now()->endOfMonth());

        $report = Ledger::whereBetween('date', [$startDate, $endDate])
            ->orderBy('date')
            ->get();

        return Inertia::render('Ledgers/Report', [
            'report' => $report,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ]
        ]);
    }
}
