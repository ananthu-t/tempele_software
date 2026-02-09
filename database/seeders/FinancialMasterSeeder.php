<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FiscalYear;
use App\Models\Account;
use App\Models\Temple;

class FinancialMasterSeeder extends Seeder
{
    public function run(): void
    {
        $temple = Temple::first();
        if (!$temple) {
            return;
        }

        // 1. Fiscal Year
        FiscalYear::updateOrCreate(
            ['temple_id' => $temple->id, 'name' => 'FY 2025-26'],
            [
                'start_date' => '2025-04-01',
                'end_date' => '2026-03-31',
                'is_active' => true,
                'is_closed' => false,
            ]
        );

        // 2. Chart of Accounts
        $accounts = [
            ['code' => '1000', 'name' => 'Cash in Hand', 'type' => 'Asset', 'is_system_defined' => true],
            ['code' => '1100', 'name' => 'Bank Account', 'type' => 'Asset', 'is_system_defined' => true],
            ['code' => '4000', 'name' => 'Vazhipadu Collections', 'type' => 'Revenue', 'is_system_defined' => true],
            ['code' => '4100', 'name' => 'Donation Income', 'type' => 'Revenue', 'is_system_defined' => true],
            ['code' => '5000', 'name' => 'Ritual Expenses', 'type' => 'Expense', 'is_system_defined' => true],
            ['code' => '5100', 'name' => 'Administrative Expenses', 'type' => 'Expense', 'is_system_defined' => true],
        ];

        foreach ($accounts as $account) {
            Account::updateOrCreate(
                ['temple_id' => $temple->id, 'code' => $account['code']],
                array_merge($account, ['temple_id' => $temple->id])
            );
        }
    }
}
