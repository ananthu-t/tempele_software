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
            padding-bottom: 10px;
            margin-bottom: 20px;
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
            <div class="receipt-title">VAZHIPADU RECEIPT</div>
            <div>Temple Management System</div>
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
            <p>അടിയന്തിരമായി വഴിപാട് കഴിക്കുന്നതാണ്.</p>
            <p>This is a computer-generated receipt.</p>
        </div>
    </div>
</body>

</html>