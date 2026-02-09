<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Devotee;
use App\Models\Vazhipadu;
use App\Models\Deity;
use App\Models\Account;
use App\Services\PricingService;
use App\Services\FinancialService;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    protected $pricingService;
    protected $financialService;

    public function __construct(PricingService $pricingService, FinancialService $financialService)
    {
        $this->pricingService = $pricingService;
        $this->financialService = $financialService;
    }

    public function index()
    {
        return Inertia::render('Bookings/Index', [
            'bookings' => Booking::with(['devotee', 'vazhipadu'])->latest()->paginate(20),
        ]);
    }

    public function create()
    {
        return Inertia::render('Bookings/Create', [
            'vazhipadus' => Vazhipadu::all(),
            'deities' => Deity::all(),
            'last_receipt' => Booking::latest()->first()?->receipt_number,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'devotee_id' => 'required_without:devotee_name|nullable|exists:devotees,id',
            'vazhipadu_ids' => 'required|array',
            'vazhipadu_ids.*' => 'exists:vazhipadus,id',
            'deity_id' => 'required|exists:deities,id',
            'booking_date' => 'required|date',
            'booking_time' => 'nullable',
            'payment_mode' => 'required|string',
            'remarks' => 'nullable|string',
            'beneficiary_name' => 'nullable|string|max:255',
            'beneficiary_name_ml' => 'nullable|string|max:255',
            'beneficiary_nakshatra' => 'nullable|string|max:255',
            'beneficiary_nakshatra_ml' => 'nullable|string|max:255',

            // Auto-devotee fields
            'devotee_name' => 'required_without:devotee_id|nullable|string|max:255',
            'devotee_name_ml' => 'nullable|string|max:255',
            'devotee_phone' => 'required_without:devotee_id|nullable|string|max:255',
            'devotee_star' => 'nullable|string|max:255',
        ]);

        return DB::transaction(function () use ($validated) {
            // 0. Handle Auto-Devotee Creation
            $devoteeId = $validated['devotee_id'];

            if (!$devoteeId) {
                // Check if devotee exists by phone to avoid duplicates
                $devotee = Devotee::where('phone', $validated['devotee_phone'])->first();

                if (!$devotee) {
                    $devotee = Devotee::create([
                        'name' => $validated['devotee_name'],
                        'name_ml' => $validated['devotee_name_ml'],
                        'phone' => $validated['devotee_phone'],
                        'star' => $validated['devotee_star'],
                    ]);
                }
                $devoteeId = $devotee->id;
            }

            $createdBookingIds = [];
            $bookingDate = Carbon::parse($validated['booking_date']);
            $revenueAccount = Account::where('code', '4000')->first();

            foreach ($validated['vazhipadu_ids'] as $vazhipaduId) {
                $vazhipadu = Vazhipadu::findOrFail($vazhipaduId);

                // 1. Calculate dynamic price
                $amount = $this->pricingService->getAmount($vazhipadu, $bookingDate);

                // 2. Generate Receipt Number
                $count = Booking::count() + 1;
                $receipt = "RPT-" . date('Y') . "-" . str_pad($count, 5, '0', STR_PAD_LEFT);

                // 3. Create Booking
                $booking = Booking::create(array_merge($validated, [
                    'devotee_id' => $devoteeId,
                    'vazhipadu_id' => $vazhipaduId,
                    'rate' => $amount,
                    'total_amount' => $amount,
                    'net_amount' => $amount,
                    'receipt_number' => $receipt,
                    'status' => 'Confirmed',
                    'payment_status' => 'Paid',
                ]));

                $createdBookingIds[] = $booking->id;

                // 4. Record Financial Entry (Revenue)
                if ($revenueAccount) {
                    $this->financialService->recordTransaction([
                        'account_id' => $revenueAccount->id,
                        'type' => 'Credit',
                        'category' => 'Vazhipadu',
                        'amount' => $amount,
                        'transaction_date' => now()->toDateString(),
                        'reference_type' => 'Booking',
                        'reference_id' => $booking->id,
                        'description' => "Vazhipadu: {$vazhipadu->name} - {$receipt}",
                        'payment_mode' => $validated['payment_mode'],
                    ]);
                }
            }

            return back()->with([
                'success' => count($createdBookingIds) . ' Bookings processed successfully.',
                'created_booking_ids' => $createdBookingIds
            ]);
        });
    }
}
