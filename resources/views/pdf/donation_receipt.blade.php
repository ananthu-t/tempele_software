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
            border-bottom: 2px solid #f97316;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }

        .temple-name {
            font-size: 20px;
            font-weight: 900;
            color: #f97316;
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
            color: #f97316;
        }

        .details {
            width: 100%;
            margin-bottom: 20px;
        }

        .details td {
            padding: 5px;
        }

        .footer {
            text-align: center;
            font-size: 12px;
            color: #666;
            margin-top: 30px;
        }

        .watermark {
            position: absolute;
            top: 30%;
            left: 20%;
            font-size: 60px;
            color: #fef3c7;
            transform: rotate(-45deg);
            z-index: -1;
            opacity: 0.5;
        }
    </style>
</head>

<body>
    <div class="receipt-box">
        <div class="watermark">TEMPLE ERP</div>
        <div class="header">
            <div class="temple-name-ml">{{ $temple->name_ml }}</div>
            <div class="temple-name">{{ $temple->name }}</div>
            <div
                style="font-size: 10px; margin-top: 10px; font-weight: bold; color: #f97316; text-transform: uppercase; letter-spacing: 2px;">
                {{ $template->name ?? 'DONATION RECEIPT' }}
            </div>
            @if($template && $template->header_content)
                <div style="font-size: 9px; color: #666; margin-top: 5px;">{!! nl2br(e($template->header_content)) !!}</div>
            @endif
        </div>

        <table class="details">
            <tr>
                <td><strong>Receipt No:</strong> {{ $donation->receipt_number }}</td>
                <td align="right"><strong>Date:</strong>
                    {{ $donation->donation_date ?? $donation->created_at->format('d/m/Y') }}</td>
            </tr>
            <tr>
                <td colspan="2"><strong>Devotee Name:</strong>
                    {{ $donation->donor_name ?? ($donation->devotee->name ?? 'Anonymous') }}</td>
            </tr>
            <tr>
                <td><strong>Purpose:</strong> {{ $donation->purpose }}</td>
                <td align="right"><strong>Deity:</strong> {{ $donation->deity->name ?? 'General' }}</td>
            </tr>
            <tr>
                <td colspan="2" style="background: #fff7ed; padding: 15px; border: 1px solid #ffedd5; font-size: 18px;">
                    <strong>Amount Received:</strong> ₹{{ number_format($donation->amount, 2) }}
                </td>
            </tr>
            <tr>
                <td><strong>Payment Mode:</strong> {{ $donation->payment_mode }}</td>
                <td align="right"><strong>Status:</strong> Paid</td>
            </tr>
        </table>

        <div class="footer">
            @if($template && $template->footer_content)
                <p>{!! nl2br(e($template->footer_content)) !!}</p>
            @else
                <p>Thank you for your generous contribution.</p>
            @endif
            <p style="font-size: 8px; opacity: 0.5; margin-top: 10px;">GENERATED VIA TEMPLE ERP PROTOCOL v1.0</p>
        </div>
    </div>
</body>

</html>