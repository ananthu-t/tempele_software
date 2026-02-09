import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    Plus,
    Search,
    HandHeart,
    Download,
    Eye,
    ChevronRight,
    SearchX,
    Sparkles,
    IndianRupee,
    User,
    Calendar
} from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import BillPreviewModal from '@/Components/Receipt/PreviewModal';
import { bluetoothPrinter } from '@/Services/BluetoothPrinterService';

interface Donation {
    id: number;
    donor_name: string;
    amount: string;
    purpose: string;
    receipt_number: string;
    donation_date: string;
    payment_mode: string;
    is_anonymous: boolean;
}

interface PaginationData {
    data: Donation[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
}

export default function Index({ auth, donations }: PageProps & { donations: PaginationData }) {
    const [search, setSearch] = useState('');
    const [previewData, setPreviewData] = useState<any>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const handlePreview = async (id: number) => {
        try {
            const response = await axios.get(route('api.receipt-data.donation', id));
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
            header={
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h2 className="font-black text-2xl text-slate-900 tracking-tight flex items-center gap-3">
                            Sacred Donation Ledger
                        </h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Vazhipadu & Charitable Contributions</p>
                    </div>
                    <Link
                        href={route('donations.create')}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-xl shadow-orange-100 hover:scale-[1.02] active:scale-95"
                    >
                        <Plus size={18} /> Record Donation
                    </Link>
                </div>
            }
        >
            <Head title="Donations" />

            <div className="space-y-8">

                {/* Search & Stats Card */}
                <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6">
                    <div className="relative flex-1 group w-full">
                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300 group-focus-within:text-orange-500 transition-colors">
                            <Search size={20} />
                        </div>
                        <input
                            type="text"
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-black text-slate-900 placeholder:text-slate-300 uppercase tracking-widest text-xs"
                            placeholder="SEARCH BY DONOR OR RECEIPT NUMBER..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95 group">
                        <Download size={16} className="group-hover:translate-y-0.5 transition-transform" /> Export Audit PDF
                    </button>
                </div>

                {/* Donations Table */}
                <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Receipt #</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Donor Info</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Purpose</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Amount</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">View</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {donations.data.length > 0 ? (
                                donations.data.map((donation) => (
                                    <tr key={donation.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-orange-50 transition-colors text-slate-400 group-hover:text-orange-500">
                                                    <HandHeart size={16} />
                                                </div>
                                                <span className="font-mono text-[10px] font-black text-slate-400 uppercase tracking-widest">{donation.receipt_number}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:bg-white group-hover:text-orange-500 transition-all font-black text-xs">
                                                    <User size={18} />
                                                </div>
                                                <div>
                                                    <div className="font-black text-slate-900 uppercase tracking-tight leading-tight group-hover:text-orange-600 transition-colors">
                                                        {donation.is_anonymous ? 'Sacred Anonymous' : donation.donor_name}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[9px] text-slate-400 font-black uppercase tracking-widest mt-0.5">
                                                        <Calendar size={10} /> {donation.donation_date}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-3 py-1 bg-slate-50 rounded-lg border border-transparent group-hover:border-slate-100 transition-all">
                                                {donation.purpose}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="text-xl font-black text-slate-900 tabular-nums">
                                                <span className="text-orange-600 mr-1 text-sm font-black">₹</span>
                                                {parseFloat(donation.amount).toLocaleString('en-IN')}
                                            </div>
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">{donation.payment_mode}</div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handlePreview(donation.id)}
                                                    className="p-3 bg-white text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all border border-slate-100 hover:border-orange-100 shadow-sm"
                                                >
                                                    <Printer size={18} />
                                                </button>
                                                <Link
                                                    href={route('donations.show', donation.id)}
                                                    className="p-3 bg-white text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all border border-slate-100 hover:border-orange-100 shadow-sm"
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-10 py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 text-slate-300">
                                            <SearchX size={64} strokeWidth={1} />
                                            <p className="text-xs font-black uppercase tracking-[0.3em]">No donation records found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="flex justify-center gap-2 pb-12">
                    {donations.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${link.active
                                ? 'bg-slate-900 text-white shadow-xl px-6'
                                : 'bg-white text-slate-400 hover:text-slate-900 border border-slate-100'
                                } ${!link.url ? 'opacity-30 pointer-events-none' : ''}`}
                        />
                    ))}
                </div>

                {/* Statutory Note */}
                <div className="bg-orange-50 rounded-[2rem] p-8 border border-orange-100 flex gap-4 max-w-2xl">
                    <Sparkles size={20} className="text-orange-600 shrink-0" />
                    <p className="text-[10px] font-black text-orange-800/60 uppercase tracking-widest leading-relaxed">
                        Donations are exempt under Section 80G. All entries are non-reversible once the receipt is generated and synchronized with the Financial Ledger (Vazhipadu Counter).
                    </p>
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
