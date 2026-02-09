<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ledger;
use App\Models\Account;
use App\Models\ActivityLog;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Str;

class ExportController extends Controller
{
    public function generate(Request $request, $type, $report)
    {
        $data = $this->getReportData($report, $request);

        if ($type === 'pdf') {
            $pdf = Pdf::loadView('exports.report', [
                'data' => $data,
                'title' => Str::title(str_replace('-', ' ', $report)),
                'date' => now()->format('d/m/Y H:i')
            ]);
            return $pdf->download($report . '-' . now()->format('Y-m-d') . '.pdf');
        }

        if ($type === 'csv') {
            $callback = function () use ($data) {
                $file = fopen('php://output', 'w');
                // CSV headers would be dynamically determined based on data
                if (count($data) > 0) {
                    fputcsv($file, array_keys($data[0]->toArray()));
                    foreach ($data as $row) {
                        fputcsv($file, $row->toArray());
                    }
                }
                fclose($file);
            };

            return response()->stream($callback, 200, [
                "Content-type" => "text/csv",
                "Content-Disposition" => "attachment; filename=$report.csv",
                "Pragma" => "no-cache",
                "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
                "Expires" => "0"
            ]);
        }

        return redirect()->back()->with('error', 'Invalid export type.');
    }

    protected function getReportData($report, Request $request)
    {
        switch ($report) {
            case 'trial-balance':
                return Account::where('balance', '!=', 0)->get();
            case 'income-statement':
                return Account::whereIn('type', ['Revenue', 'Expense'])->get();
            case 'ledger':
                return Ledger::latest()->take(1000)->get();
            case 'audit-logs':
                return ActivityLog::with('user')->latest()->take(500)->get();
            case 'users':
                return User::with('roles')->get();
            default:
                return collect([]);
        }
    }
}
