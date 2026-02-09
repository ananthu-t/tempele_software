<?php

namespace App\Services;

use App\Models\Vazhipadu;
use App\Models\VazhipaduRate;
use Carbon\Carbon;

class PricingService
{
    /**
     * Calculate the final amount for a vazhipadu on a given date.
     * Support for complex rule-based pricing (Festival, Nakshatra, etc.)
     */
    public function getAmount(Vazhipadu $vazhipadu, Carbon $date): float
    {
        // 1. Look for active overrides/rules in VazhipaduRate
        $rateRule = VazhipaduRate::where('vazhipadu_id', $vazhipadu->id)
            ->where('is_active', true)
            ->where('effective_from', '<=', $date->toDateString())
            ->where(function ($query) use ($date) {
                $query->whereNull('effective_to')
                    ->orWhere('effective_to', '>=', $date->toDateString());
            })
            ->orderBy('rule_type', 'desc') // priority: rule > base
            ->first();

        if ($rateRule) {
            return (float) $rateRule->amount;
        }

        // 2. Fallback to Vazhipadu master base rate
        return (float) $vazhipadu->rate;
    }
}
