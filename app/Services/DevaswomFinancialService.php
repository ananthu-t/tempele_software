<?php

namespace App\Services;

use App\Models\Ledger;
use App\Models\Temple;
use App\Models\Devaswom;
use Illuminate\Support\Facades\DB;

class DevaswomFinancialService
{
    /**
     * Get consolidated balance for a Devaswom across all its temples.
     */
    public function getConsolidatedBalance(Devaswom $devaswom)
    {
        return Ledger::whereIn('temple_id', $devaswom->temples()->pluck('id'))
            ->select('type', DB::raw('SUM(amount) as total'))
            ->groupBy('type')
            ->get();
    }

    /**
     * Get a unified ledger for the entire Devaswom.
     */
    public function getUnifiedLedger(Devaswom $devaswom)
    {
        return Ledger::with('temple')
            ->whereIn('temple_id', $devaswom->temples()->pluck('id'))
            ->latest()
            ->paginate(50);
    }
}
