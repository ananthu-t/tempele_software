<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Donation;
use App\Models\ReceiptTemplate;
use App\Models\Temple;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class PrintController extends Controller
{
    public function printDonation(Donation $donation)
    {
        $donation->load('devotee', 'deity');

        $temple = Temple::first();
        $template = ReceiptTemplate::where('temple_id', $temple->id)
            ->where('type', 'Donation')
            ->where('is_default', true)
            ->first();

        $data = [
            'title' => 'Donation Receipt',
            'date' => date('d/m/Y'),
            'donation' => $donation,
            'temple' => $temple,
            'template' => $template,
        ];

        // Using a view for the PDF layout
        $pdf = Pdf::loadView('pdf.donation_receipt', $data);

        return $pdf->stream('donation_receipt_' . $donation->receipt_number . '.pdf');
    }

    public function printBooking(Booking $booking)
    {
        $booking->load('devotee', 'vazhipadu', 'deity');

        $temple = Temple::first();
        $template = ReceiptTemplate::where('temple_id', $temple->id)
            ->where('type', 'Vazhipadu')
            ->where('is_default', true)
            ->first();

        $data = [
            'title' => 'Vazhipadu Receipt',
            'date' => date('d/m/Y'),
            'booking' => $booking,
            'temple' => $temple,
            'template' => $template,
        ];

        $pdf = Pdf::loadView('pdf.booking_receipt', $data);

        return $pdf->stream('vazhipadu_receipt_' . $booking->receipt_number . '.pdf');
    }
}
