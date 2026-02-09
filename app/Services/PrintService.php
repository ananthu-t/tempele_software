<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Donation;
use App\Models\ReceiptTemplate;
use Illuminate\Support\Facades\URL;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class PrintService
{
    /**
     * Generate HTML for a receipt based on a template and data.
     */
    public function generateReceipt(Booking|Donation $entity, string $type = 'Vazhipadu')
    {
        $template = ReceiptTemplate::where('temple_id', $entity->temple_id)
            ->where('type', $type)
            ->where('is_default', true)
            ->first();

        if (!$template) {
            // Fallback content simple
            $header = "Temple Receipt";
            $footer = "Thank you.";
        } else {
            $header = $template->header_content;
            $footer = $template->footer_content;
        }

        // 1. Generate QR Code for verification
        $verifyUrl = URL::signedRoute('verify.receipt', ['id' => $entity->id, 'type' => $type]);
        $qrCode = base64_encode(QrCode::format('png')->size(100)->generate($verifyUrl));

        // 2. Multilingual Data Preparation
        $data = [
            'receipt_number' => $entity->receipt_number ?? "N/A",
            'name' => $entity->devotee->name ?? $entity->name,
            'amount' => $entity->net_amount ?? $entity->amount,
            'vazhipadu' => $entity->vazhipadu->name ?? 'N/A',
            'vazhipadu_ml' => $entity->vazhipadu->name_ml ?? 'N/A',
            'date' => $entity->created_at->format('d-m-Y'),
            'qr' => '<img src="data:image/png;base64,' . $qrCode . '" />',
        ];

        // 3. Simple placeholder replacement
        $html = $header . $footer;
        foreach ($data as $key => $value) {
            $html = str_replace("{{{$key}}}", $value, $html);
        }

        return $html;
    }
}
