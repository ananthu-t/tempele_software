<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Donation;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class PrintController extends Controller
{
    public function printDonation(Donation $donation)
    {
        $donation->load('devotee', 'deity');

        $data = [
            'title' => 'Donation Receipt',
            'date' => date('d/m/Y'),
            'donation' => $donation,
        ];

        // Using a view for the PDF layout
        $pdf = Pdf::loadView('pdf.donation_receipt', $data);

        return $pdf->stream('donation_receipt_' . $donation->receipt_number . '.pdf');
    }

    public function printBooking(Booking $booking)
    {
        $booking->load('devotee', 'vazhipadu', 'deity');

        $data = [
            'title' => 'Vazhipadu Receipt',
            'date' => date('d/m/Y'),
            'booking' => $booking,
        ];

        $pdf = Pdf::loadView('pdf.booking_receipt', $data);

        return $pdf->stream('vazhipadu_receipt_' . $booking->receipt_number . '.pdf');
    }
}
