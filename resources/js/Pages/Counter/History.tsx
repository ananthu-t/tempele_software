import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Search, History, Printer, Calendar, Filter, ChevronRight, ChevronLeft, ArrowLeft } from 'lucide-react';
import { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import axios from 'axios';
import { bluetoothPrinter } from '@/Services/BluetoothPrinterService';
import clsx from 'clsx';

interface Booking {
    id: number;
    receipt_number: string;
    booking_date: string;
    beneficiary_name: string;
    net_amount: string;
    payment_mode: string;
    devotee: { name: string; phone: string } | null;
    vazhipadu: { name: string; name_ml: string | null } | null;
    deity: { name: string } | null;
}

interface Props extends PageProps {
    bookings: {
        data: Booking[];
        links: any[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        search?: string;
        date_from?: string;
        date_to?: string;
        payment_mode?: string;
    };
}

export default function CounterHistory({ auth, bookings, filters }: Props) {
    const [isPrinting, setIsPrinting] = useState<number | null>(null);
    const [search, setSearch] = useState(filters.search || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [paymentMode, setPaymentMode] = useState(filters.payment_mode || 'All');

    const updateFilters = useCallback(
        debounce((newFilters: any) => {
            router.get(route('counter.history'), newFilters, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 300),
        []
    );

    const handleSearchChange = (val: string) => {
        setSearch(val);
        updateFilters({ search: val, date_from: dateFrom, date_to: dateTo, payment_mode: paymentMode });
    };

    const handleDateChange = (type: 'from' | 'to', val: string) => {
        if (type === 'from') setDateFrom(val);
        else setDateTo(val);
        updateFilters({ search, date_from: type === 'from' ? val : dateFrom, date_to: type === 'to' ? val : dateTo, payment_mode: paymentMode });
    };

    const handlePaymentModeChange = (val: string) => {
        setPaymentMode(val);
        updateFilters({ search, date_from: dateFrom, date_to: dateTo, payment_mode: val });
    };

    const handlePrint = async (booking: Booking) => {
        setIsPrinting(booking.id);
        try {
            const response = await axios.get(route('api.receipt-data.booking', booking.id));
            await bluetoothPrinter.printReceipt(response.data);
        } catch (error) {
            console.error('Printing failed:', error);
        } finally {
            setIsPrinting(null);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-4">
                        <Link href={route('counter.index')} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-all text-slate-400 hover:text-slate-900">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h2 className="font-black text-2xl text-slate-900 tracking-tight">Counter History</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Audit Ledger & Reprint Hub</p>
                        </div>
                    </div>
                    <div className="hidden lg:flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Transactions</p>
                            <p className="text-lg font-black text-slate-900 leading-none mt-0.5">{bookings.total}</p>
                        </div>
                        <div className="h-10 w-px bg-slate-100 mx-2" />
                        <div className="bg-slate-900 p-3 rounded-2xl shadow-lg shadow-slate-200">
                            <History className="text-white" size={20} />
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Counter History" />

            <div className="space-y-8">
                {/* Filters Section */}
                <div className="bg-white rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.03)] border border-slate-100 p-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-2 relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={20} />
                            <input
                                type="text"
                                value={search}
                                onChange={e => handleSearchChange(e.target.value)}
                                placeholder="SEARCH BY RECEIPT, DEVOTEE, OR PHONE..."
                                className="w-full bg-slate-50 border-none rounded-2xl py-5 pl-16 pr-6 font-black text-slate-900 uppercase tracking-wider text-xs focus:ring-2 focus:ring-slate-900/5 transition-all"
                            />
                        </div>
                        <div className="relative group">
                            <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={e => handleDateChange('from', e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-2xl py-5 pl-14 pr-4 font-black text-slate-900 text-xs focus:ring-2 focus:ring-slate-900/5 transition-all"
                            />
                        </div>
                        <div className="relative group">
                            <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                            <select
                                value={paymentMode}
                                onChange={e => handlePaymentModeChange(e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-2xl py-5 pl-14 pr-10 font-black text-slate-900 uppercase tracking-widest text-xs focus:ring-2 focus:ring-slate-900/5 transition-all appearance-none"
                            >
                                <option value="All">ALL PAYMENTS</option>
                                <option value="Cash">CASH</option>
                                <option value="UPI">UPI / G-PAY</option>
                                <option value="Card">CARD</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Transaction Details</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Devotee & Purpose</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Accounting</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {bookings.data.length > 0 ? (
                                    bookings.data.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="font-black text-slate-900 uppercase tracking-tight text-sm">{booking.receipt_number}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-2">
                                                    <Calendar size={10} /> {new Date(booking.booking_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="font-black text-slate-900 uppercase tracking-tighter text-sm flex items-center gap-2">
                                                    {booking.beneficiary_name}
                                                    {booking.devotee && <span className="text-[10px] text-slate-400 font-bold italic ml-2">via {booking.devotee.name}</span>}
                                                </div>
                                                <div className="text-[10px] font-black text-orange-600 uppercase tracking-widest mt-1 italic">
                                                    {booking.vazhipadu?.name}
                                                    {booking.deity && <span className="text-slate-400 ml-2">• {booking.deity.name}</span>}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="font-black text-slate-900 text-sm">₹{parseFloat(booking.net_amount).toLocaleString('en-IN')}</div>
                                                <div className={clsx(
                                                    "text-[9px] font-black uppercase tracking-widest mt-1 px-2 py-0.5 rounded-md inline-block",
                                                    booking.payment_mode === 'Cash' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                                                )}>
                                                    {booking.payment_mode}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button
                                                    onClick={() => handlePrint(booking)}
                                                    disabled={isPrinting === booking.id}
                                                    className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-900 hover:bg-slate-900 hover:text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95 disabled:opacity-50"
                                                >
                                                    {isPrinting === booking.id ? 'PRINTING...' : 'REPRINT'} <Printer size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center">
                                            <div className="max-w-xs mx-auto space-y-4">
                                                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-slate-200">
                                                    <History size={32} />
                                                </div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">No historical records found for this query</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {bookings.last_page > 1 && (
                        <div className="px-8 py-6 bg-slate-50/50 flex justify-between items-center border-t border-slate-50">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Showing {bookings.data.length} of {bookings.total} records
                            </p>
                            <div className="flex gap-2">
                                {bookings.current_page > 1 && (
                                    <Link
                                        href={bookings.links[0].url}
                                        className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 transition-all shadow-sm active:scale-95"
                                    >
                                        <ChevronLeft size={16} />
                                    </Link>
                                )}
                                {bookings.current_page < bookings.last_page && (
                                    <Link
                                        href={bookings.links[bookings.links.length - 1].url}
                                        className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 transition-all shadow-sm active:scale-95"
                                    >
                                        <ChevronRight size={16} />
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
