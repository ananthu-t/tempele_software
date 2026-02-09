<!DOCTYPE html>
<html>

<head>
    <title>{{ $title }}</title>
    <style>
        body {
            font-family: sans-serif;
            font-size: 12px;
            color: #333;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #f1f1f1;
            padding-bottom: 20px;
        }

        .header h1 {
            margin: 0;
            color: #111;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        .header p {
            margin: 5px 0;
            color: #666;
            font-size: 10px;
            text-transform: uppercase;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        th {
            background-color: #f9f9f9;
            text-align: left;
            padding: 12px 10px;
            border-bottom: 1px solid #eee;
            text-transform: uppercase;
            font-size: 10px;
            color: #888;
            letter-spacing: 1px;
        }

        td {
            padding: 10px;
            border-bottom: 1px solid #f1f1f1;
        }

        .footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            text-align: right;
            font-size: 8px;
            color: #aaa;
            border-top: 1px solid #eee;
            padding-top: 10px;
        }

        .text-right {
            text-align: right;
        }

        .font-bold {
            font-weight: bold;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>TEMPLE ERP</h1>
        <p>{{ $title }}</p>
        <p>Generated on: {{ $date }}</p>
    </div>

    <table>
        <thead>
            <tr>
                @if(count($data) > 0)
                    @foreach(array_keys($data[0]->toArray()) as $header)
                        @if(!in_array($header, ['id', 'created_at', 'updated_at', 'temple_id', 'deleted_at']))
                            <th>{{ str_replace('_', ' ', $header) }}</th>
                        @endif
                    @endforeach
                @endif
            </tr>
        </thead>
        <tbody>
            @foreach($data as $row)
                <tr>
                    @foreach($row->toArray() as $key => $value)
                        @if(!in_array($key, ['id', 'created_at', 'updated_at', 'temple_id', 'deleted_at']))
                            <td>{{ is_array($value) ? json_encode($value) : $value }}</td>
                        @endif
                    @endforeach
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        TEMPLE MANAGEMENT SYSTEM - AUTHENTICATED AUDIT REPORT
    </div>
</body>

</html>