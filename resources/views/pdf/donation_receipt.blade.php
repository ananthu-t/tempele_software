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
            padding-bottom: 10px;
            margin-bottom: 20px;
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
            <div class="receipt-title">DONATION RECEIPT</div>
            <div>Temple Management System</div>
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
            <p>Thank you for your generous contribution.</p>
            <p>This is a computer-generated receipt.</p>
        </div>
    </div>
</body>

</html>