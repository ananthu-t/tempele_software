<?php

namespace App\Services;

use App\Models\Ledger;
use App\Models\Account;
use App\Models\FiscalYear;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class FinancialService
{
    /**
     * Record a transaction in the dynamic ledger and update account balances.
     */
    public function recordTransaction(array $data): Ledger
    {
        return DB::transaction(function () use ($data) {
            $templeId = $data['temple_id'] ?? session('temple_id');

            // 1. Resolve Active Fiscal Year
            $fiscalYear = FiscalYear::where('temple_id', $templeId)
                ->where('is_active', true)
                ->where('is_closed', false)
                ->first();

            if (!$fiscalYear) {
                throw new \Exception("No active fiscal year found for the temple.");
            }

            // 2. Create Ledger Entry
            $ledger = Ledger::create(array_merge($data, [
                'temple_id' => $templeId,
                'fiscal_year_id' => $fiscalYear->id,
            ]));

            // 3. Update Account Balance
            if (isset($data['account_id'])) {
                $account = Account::findOrFail($data['account_id']);

                // For Assets/Expenses: Credit decreases, Debit increases
                // For Liabilities/Revenue/Equity: Credit increases, Debit decreases
                $amount = (float) $data['amount'];
                if ($data['type'] === 'Credit') {
                    if (in_array($account->type, ['Liability', 'Revenue', 'Equity'])) {
                        $account->increment('balance', $amount);
                    } else {
                        $account->decrement('balance', $amount);
                    }
                } else { // Debit
                    if (in_array($account->type, ['Asset', 'Expense'])) {
                        $account->increment('balance', $amount);
                    } else {
                        $account->decrement('balance', $amount);
                    }
                }
            }

            return $ledger;
        });
    }
}
