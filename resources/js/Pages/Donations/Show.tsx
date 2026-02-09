import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    Printer,
    ArrowLeft,
    CheckCircle,
    Download,
    Share2,
    HandHeart,
    Receipt
} from 'lucide-react';
import { useRef } from 'react';

interface Donation {
    id: number;
    donor_name: string;
    amount: string;
    purpose: string;
    receipt_number: string;
    donation_date: string;
    payment_mode: string;
    payment_status: string;
    is_anonymous: boolean;
    remarks: string;
}

export default function Show({ auth, donation }: PageProps & { donation: Donation }) {
    const receiptRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        window.print();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href={route('donations.index')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                            <ArrowLeft size={20} />
                        </Link>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">Donation Receipt</h2>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 hover:text-emerald-600 transition-colors">
                            <Share2 size={18} /> Share
                        </button>
                        <button
                            onClick={handlePrint}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-100"
                        >
                            <Printer size={18} /> Print Receipt
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`Receipt - ${donation.receipt_number}`} />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">

                    {/* Success Alert */}
                    <div className="mb-8 bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex items-center gap-4 text-emerald-800 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="bg-white p-2 rounded-full shadow-sm text-emerald-500">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <h4 className="font-black">Donation Recorded Successfully!</h4>
                            <p className="text-sm opacity-80">The transaction has been logged and the receipt is ready for printing.</p>
                        </div>
                    </div>

                    {/* Receipt Card */}
                    <div
                        ref={receiptRef}
                        className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden print:shadow-none print:border-none print:m-0"
                    >
                        {/* Receipt Header */}
                        <div className="bg-emerald-600 p-8 text-white text-center">
                            <h1 className="text-2xl font-black mb-1 uppercase tracking-tighter">Temple Management System</h1>
                            <p className="font-malayalam text-xl font-bold opacity-90">ശ്രീ മഹാദേവ ക്ഷേത്രം</p>
                            <p className="text-xs font-bold uppercase tracking-widest opacity-60 mt-4">Official Donation Receipt</p>
                        </div>

                        {/* Receipt Body */}
                        <div className="p-10 space-y-8 relative">
                            {/* Watermark */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                                <HandHeart size={400} />
                            </div>

                            <div className="flex justify-between items-start border-b border-dashed border-gray-100 pb-6">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Receipt Number</p>
                                    <p className="font-mono text-lg font-black text-gray-900">{donation.receipt_number}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date</p>
                                    <p className="font-bold text-gray-900">{donation.donation_date}</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 font-malayalam">പേര് (Name)</p>
                                    <p className="text-2xl font-black text-gray-900">
                                        {donation.is_anonymous ? 'അജ്ഞാതൻ (ANONYMOUS)' : donation.donor_name}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 font-malayalam">ഉദ്ദേശ്യം (Purpose)</p>
                                        <p className="text-lg font-bold text-gray-900">{donation.purpose}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 font-malayalam">പേയ്മെന്റ് രീതി (Payment)</p>
                                        <p className="text-lg font-bold text-gray-900">{donation.payment_mode}</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 font-malayalam">തുക (Donation Amount)</p>
                                    <p className="text-5xl font-black text-emerald-600">₹{parseFloat(donation.amount).toLocaleString('en-IN')}</p>
                                    <p className="text-xs text-gray-400 font-bold mt-2 italic">Ref: {donation.payment_status}</p>
                                </div>

                                {donation.remarks && (
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Remarks</p>
                                        <p className="text-sm text-gray-500 italic">{donation.remarks}</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="pt-12 mt-8 border-t border-gray-50 flex justify-between items-end">
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Authorized Signature</p>
                                    <div className="h-12 w-40 border-b border-gray-200"></div>
                                    <p className="text-[10px] font-bold text-gray-900 uppercase">Temple Accountant</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-2">QR Verification</p>
                                    <div className="bg-gray-100 w-16 h-16 ml-auto rounded-lg"></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 px-8 py-4 text-center">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Thank you for your divine contribution</p>
                        </div>
                    </div>

                    <div className="mt-8 text-center print:hidden">
                        <Link href={route('donations.index')} className="text-sm font-bold text-gray-400 hover:text-emerald-600 transition-colors">
                            Back to Donation History
                        </Link>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    body * { visibility: hidden; }
                    .print\\:shadow-none, .print\\:shadow-none * { visibility: visible; }
                    .print\\:shadow-none { position: absolute; left: 0; top: 0; width: 100%; }
                    .print\\:hidden { display: none !important; }
                }
            `}} />
        </AuthenticatedLayout>
    );
}
