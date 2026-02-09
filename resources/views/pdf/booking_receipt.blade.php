<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: sans-serif;
        }

        .receipt-box {
            width: 100%;
            border: 1px solid #eee;
            padding: 20px;
        }

        .header {
            text-align: center;
            border-bottom: 2px solid #ef4444;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }

        .temple-name {
            font-size: 20px;
            font-weight: 900;
            color: #ef4444;
            letter-spacing: -0.5px;
        }

        .temple-name-ml {
            font-size: 18px;
            font-weight: bold;
            display: block;
            margin-top: 2px;
        }

        .receipt-title {
            font-size: 24px;
            font-weight: bold;
            color: #ef4444;
        }

        .details {
            width: 100%;
            margin-bottom: 20px;
        }

        .details td {
            padding: 5px;
        }

        .amount-section {
            background: #fee2e2;
            padding: 15px;
            border: 1px solid #fecaca;
            margin-top: 10px;
        }

        .footer {
            text-align: center;
            font-size: 12px;
            color: #666;
            margin-top: 30px;
        }
    </style>
</head>

<body>
    <div class="receipt-box">
        <div class="header">
            <div class="temple-name-ml">{{ $temple->name_ml }}</div>
            <div class="temple-name">{{ $temple->name }}</div>
            <div
                style="font-size: 10px; margin-top: 10px; font-weight: bold; color: #ef4444; text-transform: uppercase; letter-spacing: 2px;">
                {{ $template->name ?? 'VAZHIPADU RECEIPT' }}
            </div>
            @if($template && $template->header_content)
                <div style="font-size: 9px; color: #666; margin-top: 5px;">{!! nl2br(e($template->header_content)) !!}</div>
            @endif
        </div>

        <table class="details">
            <tr>
                <td><strong>Receipt No:</strong> {{ $booking->receipt_number }}</td>
                <td align="right"><strong>Date:</strong>
                    {{ $booking->booking_date ?? $booking->created_at->format('d/m/Y') }}</td>
            </tr>
            <tr>
                <td colspan="2"><strong>Devotee:</strong> {{ $booking->devotee->name }}</td>
            </tr>
            <tr>
                <td><strong>Star (നക്ഷത്രം):</strong> {{ $booking->devotee->star ?? 'N/A' }}</td>
                <td align="right"><strong>Deity:</strong> {{ $booking->deity->name }}</td>
            </tr>
            <tr>
                <td colspan="2"><strong>Vazhipadu:</strong> {{ $booking->vazhipadu->name }}</td>
            </tr>
        </table>

        <div class="amount-section">
            <table width="100%">
                <tr>
                    <td><strong>Vazhipadu Rate:</strong></td>
                    <td align="right">₹{{ number_format($booking->total_amount, 2) }}</td>
                </tr>
                <tr>
                    <td colspan="2">
                        <hr style="border: 0.5px solid #fecaca;">
                    </td>
                </tr>
                <tr>
                    <td><span style="font-size: 18px;"><strong>TOTAL PAID:</strong></span></td>
                    <td align="right"><span
                            style="font-size: 18px;"><strong>₹{{ number_format($booking->total_amount, 2) }}</strong></span>
                    </td>
                </tr>
            </table>
        </div>

        <div class="footer">
            @if($template && $template->footer_content)
                <p>{!! nl2br(e($template->footer_content)) !!}</p>
            @else
                <p>അടിയന്തിരമായി വഴിപാട് കഴിക്കുന്നതാണ്.</p>
            @endif
            <p style="font-size: 8px; opacity: 0.5; margin-top: 10px;">GENERATED VIA TEMPLE ERP PROTOCOL v1.0</p>
        </div>
    </div>
</body>

</html>