import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    Calendar,
    ChevronLeft,
    Search,
    Clock,
    User,
    CheckCircle2,
    XCircle,
    MoreVertical
} from 'lucide-react';
import { useState } from 'react';

interface AssetBooking {
    id: number;
    asset: { name: string; name_ml?: string };
    devotee: { name: string; phone: string };
    start_date: string;
    end_date: string;
    total_amount: string;
    advance_paid: string;
    balance_amount: string;
    status: string;
    payment_status: string;
}

interface PaginationData {
    data: AssetBooking[];
    links: { url: string | null; label: string; active: boolean }[];
}

export default function Index({ auth, bookings }: PageProps & { bookings: PaginationData }) {
    const { patch } = useForm();
    const [search, setSearch] = useState('');

    const handleStatusUpdate = (id: number, status: string) => {
        if (confirm(`Change booking status to ${status}?`)) {
            // @ts-ignore
            patch(route('asset-bookings.update-status', id), { status });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'confirmed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href={route('assets.index')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                            <ChevronLeft size={20} />
                        </Link>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">Asset Booking Records</h2>
                    </div>
                    <Link
                        href={route('asset-bookings.create')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-100"
                    >
                        + Create Booking
                    </Link>
                </div>
            }
        >
            <Head title="Asset Bookings" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Search bar */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                                placeholder="Search by asset or devotee name..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Bookings Table */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                <tr>
                                    <th className="px-6 py-4">Asset / Devotee</th>
                                    <th className="px-6 py-4">Booking Period</th>
                                    <th className="px-6 py-4">Payment</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {bookings.data.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-black text-gray-900">{booking.asset.name}</div>
                                            <div className="text-xs text-indigo-600 font-bold flex items-center gap-1 mt-1 font-malayalam">
                                                {booking.asset.name_ml}
                                            </div>
                                            <div className="flex items-center gap-1 mt-2 text-xs font-bold text-gray-400">
                                                <User size={12} /> {booking.devotee.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                                <Calendar size={14} className="text-gray-400" />
                                                {booking.start_date}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mt-1">
                                                <Clock size={14} className="text-gray-400" />
                                                to {booking.end_date}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-black text-gray-900">₹{parseFloat(booking.total_amount).toLocaleString()}</div>
                                            <div className="text-[10px] font-black uppercase tracking-wider mt-1 flex gap-2">
                                                <span className="text-emerald-500">Adv: ₹{parseFloat(booking.advance_paid).toLocaleString()}</span>
                                                <span className="text-red-400">Bal: ₹{parseFloat(booking.balance_amount).toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusBadge(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                            <div className="text-[9px] font-bold text-gray-400 mt-1 ml-1">{booking.payment_status}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleStatusUpdate(booking.id, 'Completed')}
                                                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-100"
                                                    title="Mark as Completed"
                                                >
                                                    <CheckCircle2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(booking.id, 'Cancelled')}
                                                    className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                                    title="Cancel Booking"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="px-6 py-4 bg-gray-50 flex justify-center gap-2">
                            {bookings.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1 rounded-md text-sm font-bold transition-all ${link.active
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-white text-gray-500 hover:bg-indigo-50'
                                        } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
