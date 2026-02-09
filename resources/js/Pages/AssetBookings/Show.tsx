import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    Calendar,
    User,
    Phone,
    CreditCard,
    CheckCircle2,
    Clock,
    ArrowLeft,
    Printer,
    MapPin,
    IndianRupee,
    Info
} from 'lucide-react';

interface AssetBooking {
    id: number;
    asset: { name: string; name_ml: string; category: string; base_rate: string };
    devotee: { name: string; phone: string };
    start_date: string;
    end_date: string;
    total_amount: string;
    advance_paid: string;
    balance_amount: string;
    payment_mode: string;
    status: 'Confirmed' | 'Completed' | 'Cancelled';
    receipt_number: string;
}

export default function Show({ auth, booking }: PageProps & { booking: AssetBooking }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href={route('asset-bookings.index')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                            <ArrowLeft size={20} />
                        </Link>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">Booking Details</h2>
                    </div>
                    <a
                        href={route('print.booking', booking.id)}
                        target="_blank"
                        className="bg-gray-900 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all hover:bg-black shadow-lg shadow-gray-200"
                    >
                        <Printer size={18} /> Print Receipt
                    </a>
                </div>
            }
        >
            <Head title={`Booking - ${booking.receipt_number}`} />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">

                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
                        {/* Status Banner */}
                        <div className={`px-10 py-6 flex justify-between items-center ${booking.status === 'Confirmed' ? 'bg-amber-50 text-amber-700' :
                                booking.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                                    'bg-red-50 text-red-700'
                            }`}>
                            <div className="flex items-center gap-2 font-black uppercase tracking-widest text-xs">
                                <Clock size={16} /> Status: {booking.status}
                            </div>
                            <div className="font-bold text-sm">Receipt: #{booking.receipt_number}</div>
                        </div>

                        <div className="p-12">
                            {/* Asset Info */}
                            <div className="flex items-start gap-8 mb-12">
                                <div className="bg-amber-100 p-6 rounded-3xl text-amber-600">
                                    <Calendar size={48} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{booking.asset.category}</p>
                                    <h1 className="text-4xl font-black text-gray-900 mb-2">{booking.asset.name}</h1>
                                    <p className="font-malayalam text-2xl font-bold text-amber-600">{booking.asset.name_ml}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-gray-50 pt-10">
                                {/* Devotee Details */}
                                <div className="space-y-6">
                                    <h3 className="font-black text-xs uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                        <User size={14} /> Devotee Details
                                    </h3>
                                    <div>
                                        <p className="font-black text-xl text-gray-900">{booking.devotee.name}</p>
                                        <p className="flex items-center gap-2 text-gray-500 font-bold mt-1">
                                            <Phone size={14} /> {booking.devotee.phone}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Booking Period</p>
                                        <p className="font-bold text-gray-900 flex items-center gap-2">
                                            {booking.start_date} <span className="text-gray-300">→</span> {booking.end_date}
                                        </p>
                                    </div>
                                </div>

                                {/* Financial Summary */}
                                <div className="space-y-6">
                                    <h3 className="font-black text-xs uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                        <IndianRupee size={14} /> Payment Summary
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-gray-600 font-bold">
                                            <span>Total Amount</span>
                                            <span>₹{parseFloat(booking.total_amount).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-emerald-600 font-bold">
                                            <span>Advance Paid</span>
                                            <span>- ₹{parseFloat(booking.advance_paid).toLocaleString()}</span>
                                        </div>
                                        <div className="pt-3 border-t border-gray-100 flex justify-between text-2xl font-black text-gray-900">
                                            <span>Balance Due</span>
                                            <span>₹{parseFloat(booking.balance_amount).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black text-gray-400 uppercase italic">
                                        <CreditCard size={14} /> Payment Mode: {booking.payment_mode}
                                    </div>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="mt-12 p-8 bg-amber-50 rounded-[2rem] border border-amber-100 flex gap-6">
                                <div className="text-amber-500"><Info size={24} /></div>
                                <div className="text-sm text-amber-800 leading-relaxed italic font-medium">
                                    Please ensure the balance amount is paid at least 24 hours before the booking starts.
                                    Cancellations made within 48 hours are subject to a 10% deduction from the advance.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
