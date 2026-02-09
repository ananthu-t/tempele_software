<?php

namespace App\Http\Controllers;

use App\Models\Ledger;
use App\Models\Account;
use App\Models\FiscalYear;
use App\Models\Temple;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function trialBalance()
    {
        $accounts = Account::with('parent')
            ->select('id', 'name', 'type', 'balance')
            ->where('balance', '!=', 0)
            ->get();

        return Inertia::render('Reports/TrialBalance', [
            'accounts' => $accounts,
        ]);
    }

    public function incomeStatement(Request $request)
    {
        $fiscalYearId = $request->get('fiscal_year_id', FiscalYear::where('is_active', true)->first()?->id);

        $revenue = Account::where('type', 'Revenue')
            ->whereHas('ledgers', fn($q) => $q->where('fiscal_year_id', $fiscalYearId))
            ->with(['ledgers' => fn($q) => $q->where('fiscal_year_id', $fiscalYearId)])
            ->get();

        $expenses = Account::where('type', 'Expense')
            ->whereHas('ledgers', fn($q) => $q->where('fiscal_year_id', $fiscalYearId))
            ->with(['ledgers' => fn($q) => $q->where('fiscal_year_id', $fiscalYearId)])
            ->get();

        return Inertia::render('Reports/IncomeStatement', [
            'revenue' => $revenue,
            'expenses' => $expenses,
            'fiscalYears' => FiscalYear::all(),
        ]);
    }

    public function consolidatedCollection(Request $request)
    {
        $startDate = $request->get('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->get('end_date', now()->toDateString());
        $templeId = $request->get('temple_id');

        $query = Ledger::whereBetween('transaction_date', [$startDate, $endDate])
            ->where('category', 'Vazhipadu');

        if ($templeId) {
            $query->where('temple_id', $templeId);
        }

        $report = $query->with('temple')
            ->select('temple_id', DB::raw('SUM(amount) as total'))
            ->groupBy('temple_id')
            ->get();

        return Inertia::render('Reports/ConsolidatedCollection', [
            'report' => $report,
            'temples' => Temple::all(),
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'temple_id' => $templeId,
            ]
        ]);
    }
}
