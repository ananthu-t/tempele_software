import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    ChevronLeft,
    Save,
    Calendar,
    User,
    Search,
    CreditCard,
    Info,
    CheckCircle2,
    Clock,
    Sparkles,
    ChevronRight,
    MapPin,
    IndianRupee
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface Asset {
    id: number;
    name: string;
    name_ml: string;
    base_rate: string;
    category: string;
}

interface Devotee {
    id: number;
    name: string;
    name_ml: string;
    phone: string;
}

export default function Create({ auth, assets, devotees }: PageProps & { assets: Asset[], devotees: Devotee[] }) {
    const { data, setData, post, processing, errors } = useForm({
        asset_id: '',
        devotee_id: '',
        start_date: '',
        end_date: '',
        total_amount: '',
        advance_paid: '',
        payment_mode: 'Cash',
        remarks: '',
    });

    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
    const [selectedDevotee, setSelectedDevotee] = useState<Devotee | null>(null);
    const [devoteeSearch, setDevoteeSearch] = useState('');

    useEffect(() => {
        if (data.asset_id) {
            const asset = assets.find(a => a.id.toString() === data.asset_id);
            if (asset) {
                setSelectedAsset(asset);
                setData('total_amount', asset.base_rate);
            }
        }
    }, [data.asset_id]);

    const filteredDevotees = devotees.filter(d =>
        d.name.toLowerCase().includes(devoteeSearch.toLowerCase()) ||
        d.phone.includes(devoteeSearch)
    ).slice(0, 5);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // @ts-ignore
        post(route('asset-bookings.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('assets.index')} className="p-2 hover:bg-white rounded-xl shadow-sm border border-slate-200 transition-all text-slate-500 hover:text-orange-600">
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h2 className="font-black text-2xl text-slate-900 tracking-tight">Asset & Hall Booking</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Schedule & Reservation Management</p>
                    </div>
                </div>
            }
        >
            <Head title="Create Asset Booking" />

            <div className="max-w-6xl mx-auto py-8">
                <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left Column: Multi-step Booking Form */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Step 1: Asset Selection */}
                        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 p-10">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                                <MapPin size={16} className="text-orange-500" /> Step 01: Resource Selection
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {assets.map(asset => (
                                    <button
                                        key={asset.id}
                                        type="button"
                                        onClick={() => setData('asset_id', asset.id.toString())}
                                        className={`p-6 rounded-[2rem] border-2 text-left transition-all duration-300 relative group ${data.asset_id === asset.id.toString()
                                            ? 'border-orange-600 bg-orange-50/50 shadow-xl shadow-orange-100 transform scale-[1.02]'
                                            : 'border-slate-50 bg-slate-50 hover:border-slate-200 hover:bg-white'}`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-2 py-0.5 bg-white rounded border border-slate-100 shadow-sm">{asset.category}</span>
                                            {data.asset_id === asset.id.toString() && <CheckCircle2 size={16} className="text-orange-600" />}
                                        </div>
                                        <p className="font-black text-slate-900 text-lg group-hover:text-orange-600 transition-colors uppercase tracking-tight">{asset.name}</p>
                                        <p className="font-malayalam text-orange-600 font-bold text-sm mt-0.5">{asset.name_ml}</p>
                                        <div className="mt-4 pt-4 border-t border-slate-200/50 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <span>Base Rate</span>
                                            <span className="text-slate-900">₹{parseFloat(asset.base_rate).toLocaleString()}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            {errors.asset_id && <p className="text-xs font-black text-red-500 mt-4 uppercase tracking-wide">{errors.asset_id}</p>}
                        </div>

                        {/* Step 2: Devotee Look-up */}
                        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 p-10">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                                <User size={16} className="text-orange-500" /> Step 02: Devotee Assignment
                            </h3>

                            {!selectedDevotee ? (
                                <div className="relative group">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300 group-focus-within:text-orange-500 transition-colors">
                                            <Search size={20} />
                                        </div>
                                        <input
                                            type="text"
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border-slate-100 rounded-3xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-black text-slate-900 placeholder:text-slate-300"
                                            placeholder="SEARCH BY NAME, MOBILE, OR MALAYALAM NAME..."
                                            value={devoteeSearch}
                                            onChange={e => setDevoteeSearch(e.target.value)}
                                        />
                                    </div>

                                    {devoteeSearch.length > 0 && (
                                        <div className="absolute z-20 w-full mt-3 bg-white border border-slate-100 rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                                            {filteredDevotees.map(d => (
                                                <button
                                                    key={d.id}
                                                    type="button"
                                                    onClick={() => { setSelectedDevotee(d); setData('devotee_id', d.id.toString()); }}
                                                    className="w-full text-left p-6 hover:bg-orange-50 flex justify-between items-center border-b last:border-0 border-slate-50 transition-colors group"
                                                >
                                                    <div>
                                                        <div className="font-black text-slate-900 group-hover:text-orange-600 transition-colors uppercase tracking-tight">{d.name}</div>
                                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{d.phone}</div>
                                                    </div>
                                                    <div className="font-malayalam text-orange-600 font-bold text-lg">{d.name_ml}</div>
                                                </button>
                                            ))}
                                            <Link href={route('devotees.create')} className="block w-full text-center p-4 text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 bg-orange-50 hover:bg-orange-100 transition-all">
                                                + Enroll New Devotee
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-orange-50 border border-orange-100 rounded-[2rem] p-8 flex justify-between items-center">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm border border-orange-100">
                                            <CheckCircle2 size={32} />
                                        </div>
                                        <div>
                                            <div className="font-black text-2xl text-slate-900 uppercase tracking-tight leading-tight">{selectedDevotee.name}</div>
                                            <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">{selectedDevotee.phone} • <span className="font-malayalam text-orange-500 text-sm tracking-normal">{selectedDevotee.name_ml}</span></div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => { setSelectedDevotee(null); setData('devotee_id', ''); }}
                                        className="text-[10px] font-black text-red-500 hover:text-white hover:bg-red-500 border border-red-100 px-6 py-2.5 rounded-xl transition-all uppercase tracking-widest"
                                    >
                                        Detach
                                    </button>
                                </div>
                            )}
                            {errors.devotee_id && <p className="text-xs font-black text-red-500 mt-4 uppercase tracking-wide">{errors.devotee_id}</p>}
                        </div>

                        {/* Step 3: Schedule */}
                        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 p-10">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                                <Clock size={16} className="text-orange-500" /> Step 03: Reservation Window
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Commencement Date</label>
                                    <input
                                        type="date"
                                        className="w-full rounded-2xl border-slate-100 bg-slate-50 p-5 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-black text-slate-900 tabular-nums"
                                        value={data.start_date}
                                        onChange={e => setData('start_date', e.target.value)}
                                    />
                                    {errors.start_date && <p className="text-[10px] font-black text-red-500 uppercase tracking-wide">{errors.start_date}</p>}
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Conclusion Date</label>
                                    <input
                                        type="date"
                                        className="w-full rounded-2xl border-slate-100 bg-slate-50 p-5 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-black text-slate-900 tabular-nums"
                                        value={data.end_date}
                                        onChange={e => setData('end_date', e.target.value)}
                                    />
                                    {errors.end_date && <p className="text-[10px] font-black text-red-500 uppercase tracking-wide">{errors.end_date}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Billing & Financials */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-100 sticky top-24">
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 mb-10">Financial Summary</h3>

                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Gross Booking Fee (₹)</label>
                                    <div className="relative">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-500 font-black text-2xl">₹</div>
                                        <input
                                            type="number"
                                            className="w-full bg-white/5 border-white/10 rounded-2xl py-6 pl-14 pr-8 text-3xl font-black text-white focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-white/10 tabular-nums"
                                            value={data.total_amount}
                                            onChange={e => setData('total_amount', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Advance Contribution (₹)</label>
                                    <div className="relative">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500 font-black text-2xl">₹</div>
                                        <input
                                            type="number"
                                            className="w-full bg-white/5 border-white/10 rounded-2xl py-6 pl-14 pr-8 text-3xl font-black text-emerald-400 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-white/10 tabular-nums"
                                            value={data.advance_paid}
                                            onChange={e => setData('advance_paid', e.target.value)}
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-white/5">
                                    <div className="flex justify-between items-center mb-8">
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Net Receivable</span>
                                        <span className="text-3xl font-black text-orange-500 tabular-nums">
                                            ₹{(parseFloat(data.total_amount || '0') - parseFloat(data.advance_paid || '0')).toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-8">
                                        {['Cash', 'UPI', 'Card', 'Bank'].map(mode => (
                                            <button
                                                key={mode}
                                                type="button"
                                                onClick={() => setData('payment_mode', mode)}
                                                className={`py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${data.payment_mode === mode
                                                        ? 'bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-950/20'
                                                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                                    }`}
                                            >
                                                {mode}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing || !data.asset_id || !data.devotee_id}
                                        className="w-full py-6 bg-white text-slate-900 hover:bg-orange-50 rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs shadow-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {processing ? 'Processing...' : (
                                            <>
                                                Secure Reservation <ChevronRight size={18} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Compliance Note */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 flex gap-4">
                            <Info size={20} className="text-slate-400 shrink-0" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                                Reserved assets are locked upon confirmation. Advance payments are non-refundable according to temple bylaws Section 4.C.
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
