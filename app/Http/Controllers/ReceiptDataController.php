<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Donation;
use Illuminate\Http\Request;

class ReceiptDataController extends Controller
{
    public function getBookingData(Booking $booking)
    {
        $booking->load(['devotee', 'vazhipadu', 'temple']);

        $starMl = $booking->beneficiary_nakshatra_ml;
        if (!$starMl) {
            $starName = $booking->beneficiary_nakshatra ?? $booking->devotee->star;
            if ($starName) {
                $starMl = \App\Models\Nakshatra::where('name', $starName)->first()?->name_ml;
            }
        }

        return response()->json([
            'type' => 'Vazhipadu',
            'receipt_number' => $booking->receipt_number,
            'name' => $booking->beneficiary_name ?? $booking->devotee->name,
            'name_ml' => $booking->beneficiary_name_ml ?? $booking->devotee->name_ml,
            'star' => $booking->beneficiary_nakshatra ?? $booking->devotee->star,
            'star_ml' => $starMl,
            'amount' => $booking->net_amount,
            'vazhipadu' => $booking->vazhipadu->name,
            'vazhipadu_ml' => $booking->vazhipadu->name_ml,
            'date' => $booking->booking_date->format('d-m-Y'),
            'temple_name' => $booking->temple->name,
            'verification_url' => route('verify.receipt', ['id' => $booking->id, 'type' => 'Vazhipadu'])
        ]);
    }

    public function getDonationData(Donation $donation)
    {
        $donation->load(['devotee', 'temple']);

        return response()->json([
            'type' => 'Donation',
            'receipt_number' => $donation->receipt_number,
            'name' => $donation->is_anonymous ? 'Sacred Anonymous' : ($donation->devotee->name ?? $donation->donor_name),
            'amount' => $donation->amount,
            'purpose' => $donation->purpose,
            'date' => $donation->donation_date,
            'temple_name' => $donation->temple->name,
            'verification_url' => route('verify.receipt', ['id' => $donation->id, 'type' => 'Donation'])
        ]);
    }
}
