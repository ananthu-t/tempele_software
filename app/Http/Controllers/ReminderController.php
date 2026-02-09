<?php

namespace App\Http\Controllers;

use App\Models\RecurringPooja;
use App\Models\InventoryItem;
use App\Models\Booking;
use App\Models\Temple;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReminderController extends Controller
{
    public function getReminders()
    {
        $temple_id = session('temple_id');

        $duePoojas = RecurringPooja::where('temple_id', $temple_id)
            ->where('is_active', true)
            ->where('next_due_date', '<=', now()->toDateString())
            ->with(['devotee', 'vazhipadu', 'deity'])
            ->get();

        $lowStock = InventoryItem::where('temple_id', $temple_id)
            ->whereRaw('current_stock <= low_stock_threshold')
            ->get();

        return response()->json([
            'due_poojas' => $duePoojas,
            'low_stock' => $lowStock,
        ]);
    }

    public function book(Request $request, RecurringPooja $pooja)
    {
        return DB::transaction(function () use ($pooja) {
            // 1. Create Booking
            $booking = Booking::create([
                'temple_id' => $pooja->temple_id,
                'devotee_id' => $pooja->devotee_id,
                'vazhipadu_id' => $pooja->vazhipadu_id,
                'deity_id' => $pooja->deity_id,
                'booking_date' => now(),
                'rate' => $pooja->vazhipadu->rate,
                'total_amount' => $pooja->vazhipadu->rate,
                'net_amount' => $pooja->vazhipadu->rate,
                'payment_mode' => 'Cash',
                'payment_status' => 'Paid',
                'status' => 'Confirmed',
                'beneficiary_name' => $pooja->beneficiary_name,
                'receipt_number' => 'REC-' . strtoupper(uniqid()),
            ]);

            // 2. Update Recurring Pooja Metadata
            $pooja->last_booked_date = now()->toDateString();
            $pooja->next_due_date = $this->calculateNextDueDate($pooja)->toDateString();
            $pooja->save();

            return response()->json([
                'message' => 'Ritual enshrined successfully!',
                'booking' => $booking
            ]);
        });
    }

    private function calculateNextDueDate(RecurringPooja $pooja)
    {
        $date = now();
        switch ($pooja->frequency) {
            case 'Daily':
                return $date->addDay();
            case 'Monthly':
                // Use the specific day of month if set
                if ($pooja->day_of_month) {
                    $next = $date->addMonth()->day($pooja->day_of_month);
                } else {
                    $next = $date->addMonth();
                }
                return $next;
            case 'Yearly':
                if ($pooja->month_of_year && $pooja->day_of_month) {
                    $next = $date->addYear()->month($pooja->month_of_year)->day($pooja->day_of_month);
                } else {
                    $next = $date->addYear();
                }
                return $next;
            default:
                return $date->addDay();
        }
    }
}
