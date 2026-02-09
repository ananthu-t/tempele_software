import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    ChevronLeft,
    Save,
    HandHeart,
    DollarSign,
    User,
    Info,
    Receipt,
    Phone,
    CreditCard,
    Sparkles,
    CheckCircle2
} from 'lucide-react';

export default function Create({ auth }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        donor_name: '',
        phone: '',
        amount: '',
        purpose: 'General Donation',
        payment_mode: 'Cash',
        is_anonymous: false,
        remarks: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // @ts-ignore
        post(route('donations.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href={route('donations.index')}
                        className="p-2 hover:bg-white rounded-xl shadow-sm border border-slate-200 transition-all text-slate-500 hover:text-orange-600"
                    >
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h2 className="font-black text-2xl text-slate-900 tracking-tight">Financial Contribution</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Sacred Billing & Donation Entry</p>
                    </div>
                </div>
            }
        >
            <Head title="New Donation" />

            <div className="max-w-5xl mx-auto py-8">
                <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left Column: Form Details */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 p-12">

                            <div className="flex items-center gap-6 mb-12 border-b border-slate-50 pb-8">
                                <div className="bg-gradient-to-tr from-orange-600 to-amber-400 p-5 rounded-[2rem] shadow-xl shadow-orange-100 text-white">
                                    <HandHeart size={32} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-slate-900 leading-tight">Devotee Information</h3>
                                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Primary details for the donation receipt</p>
                                </div>
                            </div>

                            <div className="space-y-10">
                                {/* Donor Name Field */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Donor Identity</label>
                                        <button
                                            type="button"
                                            onClick={() => setData('is_anonymous', !data.is_anonymous)}
                                            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full transition-all border ${data.is_anonymous
                                                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                                                    : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'
                                                }`}
                                        >
                                            {data.is_anonymous ? <CheckCircle2 size={12} /> : null}
                                            Anonymous Mode
                                        </button>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300 group-focus-within:text-orange-500 transition-colors">
                                            <User size={20} />
                                        </div>
                                        <input
                                            type="text"
                                            disabled={data.is_anonymous}
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border-slate-100 rounded-3xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-black text-slate-900 placeholder:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
                                            value={data.donor_name}
                                            onChange={e => setData('donor_name', e.target.value)}
                                            placeholder={data.is_anonymous ? "IDENTITY HIDDEN (ANONYMOUS)" : "ENTER FULL NAME"}
                                        />
                                    </div>
                                    {errors.donor_name && <p className="text-xs font-black text-red-500 mt-2 px-1 tracking-wide uppercase">{errors.donor_name}</p>}
                                </div>

                                {/* Phone Field */}
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">Contact Details</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300 group-focus-within:text-orange-500 transition-colors">
                                            <Phone size={20} />
                                        </div>
                                        <input
                                            type="text"
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border-slate-100 rounded-3xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-black text-slate-900 placeholder:text-slate-300"
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                            placeholder="ENTER MOBILE NUMBER"
                                        />
                                    </div>
                                </div>

                                {/* Purpose Field */}
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">Donation Outcome (Purpose)</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {['General Donation', 'Development Fund', 'Annadhanam', 'Festival Fund'].map((p) => (
                                            <button
                                                key={p}
                                                type="button"
                                                onClick={() => setData('purpose', p)}
                                                className={`py-4 px-6 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border ${data.purpose === p
                                                        ? 'bg-orange-600 text-white border-orange-600 shadow-xl shadow-orange-100 transform scale-[1.02]'
                                                        : 'bg-white text-slate-500 border-slate-200 hover:border-orange-200 group'
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Remarks Section */}
                        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 p-12">
                            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                <Sparkles size={20} className="text-orange-500" /> Additional Remarks
                            </h3>
                            <textarea
                                rows={3}
                                className="w-full bg-slate-50 border-slate-100 rounded-3xl p-6 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                value={data.remarks}
                                onChange={e => setData('remarks', e.target.value)}
                                placeholder="E.G. SPECIAL PRAYER REQUESTS OR MEMORIAL NOTES..."
                            />
                        </div>
                    </div>

                    {/* Right Column: Financials & Action */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Billing Card */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-100 sticky top-24">
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 mb-10">Total Contribution</h3>

                            <div className="space-y-8">
                                <div className="relative">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-500 font-black text-2xl group-focus-within:scale-125 transition-transform">₹</div>
                                    <input
                                        type="number"
                                        className="w-full bg-white/5 border-white/10 rounded-2xl py-6 pl-14 pr-8 text-3xl font-black text-white focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-white/10 tabular-nums"
                                        value={data.amount}
                                        onChange={e => setData('amount', e.target.value)}
                                        placeholder="0.00"
                                    />
                                    {errors.amount && <p className="text-[10px] font-black text-orange-500 mt-2 px-1 tracking-widest uppercase">{errors.amount}</p>}
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Payment Gateway Mode</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['Cash', 'UPI', 'Card', 'Bank'].map(mode => (
                                            <button
                                                key={mode}
                                                type="button"
                                                onClick={() => setData('payment_mode', mode)}
                                                className={`py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${data.payment_mode === mode
                                                        ? 'bg-orange-600 border-orange-600 text-white shadow-lg'
                                                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                                    }`}
                                            >
                                                {mode}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-white/5 space-y-6">
                                    <div className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="p-3 bg-orange-600 rounded-xl">
                                            <Receipt size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Auto-Generated</p>
                                            <p className="text-sm font-black italic">Printable Receipt</p>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-6 bg-white text-slate-900 hover:bg-orange-50 rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs shadow-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {processing ? 'Processing...' : (
                                            <>
                                                Confirm Transaction <ChevronRight size={18} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Security Info */}
                        <div className="bg-orange-50 rounded-3xl p-8 border border-orange-100 flex gap-4">
                            <Info size={20} className="text-orange-600 shrink-0" />
                            <p className="text-[10px] font-black text-orange-800 uppercase tracking-widest leading-relaxed">
                                Ensure all donor details are accurate. Once committed, financial entries are audited and locked for tamper-proof security.
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
