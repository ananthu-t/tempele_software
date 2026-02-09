import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    Printer,
    Search,
    Calendar,
    ArrowUpRight,
    SearchX
} from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import BillPreviewModal from '@/Components/Receipt/PreviewModal';
import { bluetoothPrinter } from '@/Services/BluetoothPrinterService';

export default function Index({ auth, bookings }: PageProps & { bookings: any }) {
    const [previewData, setPreviewData] = useState<any>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const handlePreview = async (id: number) => {
        try {
            const response = await axios.get(route('api.receipt-data.booking', id));
            setPreviewData(response.data);
            setIsPreviewOpen(true);
        } catch (error) {
            alert('Failed to load receipt data.');
        }
    };

    const handleBluetoothPrint = async () => {
        if (!previewData) return;
        try {
            await bluetoothPrinter.printReceipt(previewData);
        } catch (error) {
            alert('Printing failed. Please check printer connection.');
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Booking History</h2>}
        >
            <Head title="Bookings" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    <div className="flex justify-between items-center">
                        <div className="text-gray-500 text-sm font-medium">
                            Showing {bookings.data.length} of {bookings.total} bookings
                        </div>
                        <Link
                            href={route('bookings.create')}
                            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-orange-100"
                        >
                            + New Booking
                        </Link>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Receipt #</th>
                                    <th className="px-6 py-4 font-semibold">Devotee</th>
                                    <th className="px-6 py-4 font-semibold">Vazhipadu</th>
                                    <th className="px-6 py-4 font-semibold">Date</th>
                                    <th className="px-6 py-4 font-semibold text-right">Amount</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {bookings.data.map((b: any) => (
                                    <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-bold text-gray-700">{b.receipt_number}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-900">{b.devotee.name}</div>
                                            <div className="text-xs text-gray-500">{b.devotee.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-700 uppercase">{b.vazhipadu.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-500 uppercase">
                                                <Calendar size={14} /> {b.booking_date}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="text-sm font-black text-gray-900">₹{b.net_amount}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handlePreview(b.id)}
                                                className="bg-gray-800 text-white p-2 rounded-lg hover:bg-black transition-colors"
                                            >
                                                <Printer size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <BillPreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                data={previewData}
                onBluetoothPrint={handleBluetoothPrint}
            />
        </AuthenticatedLayout>
    );
}
