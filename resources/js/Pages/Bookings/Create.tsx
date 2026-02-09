import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { PageProps, Devotee } from '@/types';
import {
    Search,
    UserPlus,
    Plus,
    CheckCircle2,
    Printer,
    HandCoins,
    User as UserIcon,
    Languages,
    Ghost,
    Sparkles,
    Flame,
    Clock,
    ChevronRight,
    ArrowRight
} from 'lucide-react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';
import axios from 'axios';
import { fetchMalayalamTransliteration } from '@/Services/MalayalamService';
import DevoteeSearchModal from '@/Components/Devotee/SearchModal';

interface Vazhipadu {
    id: number;
    name: string;
    name_ml: string;
    rate: string;
}

interface Deity {
    id: number;
    name: string;
    name_ml: string;
}

export default function Create({ auth, vazhipadus, deities }: PageProps & { vazhipadus: Vazhipadu[], deities: Deity[] }) {
    const [selectedDevotee, setSelectedDevotee] = useState<Devotee | null>(null);
    const [isManglish, setIsManglish] = useState(true);
    const [showSearchModal, setShowSearchModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        devotee_id: '',
        vazhipadu_id: '',
        deity_id: deities[0]?.id || '',
        booking_date: new Date().toISOString().split('T')[0],
        payment_mode: 'Cash',
        remarks: '',
        // Quick devotee registration
        devotee_name: '',
        devotee_name_ml: '',
        devotee_phone: '',
        devotee_star: '',
    });

    const debouncedTransliterate = useMemo(
        () => debounce(async (val: string) => {
            if (val) {
                const result = await fetchMalayalamTransliteration(val);
                setData('devotee_name_ml', result);
            }
        }, 500),
        [setData]
    );

    useEffect(() => {
        if (!selectedDevotee) {
            debouncedTransliterate(data.devotee_name);
        }
    }, [data.devotee_name, debouncedTransliterate, selectedDevotee]);

    const selectDevotee = (devotee: Devotee) => {
        setSelectedDevotee(devotee);
        setData('devotee_id', devotee.id.toString());
        setShowSearchModal(false);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // @ts-ignore
        post(route('bookings.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 text-orange-600">
                        <HandCoins size={24} />
                    </div>
                    <div>
                        <h2 className="font-black text-2xl text-slate-900 tracking-tight">Main Vazhipadu Counter</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Sacred Offering Management</p>
                    </div>
                </div>
            }
        >
            <Head title="New Booking" />

            <div className="max-w-[1500px] mx-auto py-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left Column: Form Details */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Devotee Section */}
                        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 p-10 relative overflow-hidden">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-2 relative z-10">
                                <UserIcon size={16} className="text-orange-500" /> Devotee Information
                            </h3>

                            {!selectedDevotee ? (
                                <div className="space-y-8 relative z-10">
                                    <div className="flex justify-between items-center bg-orange-50/50 p-6 rounded-3xl border border-orange-100/50">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white rounded-2xl text-orange-600 shadow-sm">
                                                <UserPlus size={20} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Quick Registration</h4>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Enroll new devotee directly</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowSearchModal(true)}
                                            className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-orange-600 transition-all shadow-xl shadow-slate-200 flex items-center gap-3"
                                        >
                                            <Search size={16} /> Search Existing
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">English Name</label>
                                            <input
                                                type="text"
                                                className="w-full rounded-2xl bg-slate-50 border-slate-100 p-4 font-black text-slate-900 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all placeholder:text-slate-300 uppercase tracking-tight text-sm"
                                                value={data.devotee_name}
                                                onChange={e => setData('devotee_name', e.target.value)}
                                                placeholder="E.G. HARIKRISHNAN"
                                            />
                                            {errors.devotee_name && <p className="text-[10px] font-black text-red-500 px-1">{errors.devotee_name}</p>}
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 italic">പേര് (MALAYALAM)</label>
                                            <input
                                                type="text"
                                                className="w-full rounded-2xl bg-slate-50 border-slate-100 p-4 font-bold text-slate-900 font-malayalam focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all placeholder:text-slate-300 text-sm"
                                                value={data.devotee_name_ml}
                                                onChange={e => setData('devotee_name_ml', e.target.value)}
                                                placeholder="മലയാളത്തിൽ"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Phone Number</label>
                                            <input
                                                type="text"
                                                className="w-full rounded-2xl bg-slate-50 border-slate-100 p-4 font-black text-slate-900 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all placeholder:text-slate-300 text-sm tracking-widest"
                                                value={data.devotee_phone}
                                                onChange={e => setData('devotee_phone', e.target.value)}
                                                placeholder="9876543210"
                                            />
                                            {errors.devotee_phone && <p className="text-[10px] font-black text-red-500 px-1">{errors.devotee_phone}</p>}
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Star (Nakshathram)</label>
                                            <select
                                                className="w-full rounded-2xl bg-slate-50 border-slate-100 p-4 font-black text-slate-900 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-xs uppercase tracking-widest cursor-pointer"
                                                value={data.devotee_star}
                                                onChange={e => setData('devotee_star', e.target.value)}
                                            >
                                                <option value="">Select Star</option>
                                                {['Ashwati', 'Bharani', 'Kartika', 'Rohini', 'Makiryam', 'Thiruvathira', 'Punartham', 'Pooyam', 'Ayilyam', 'Makam', 'Pooram', 'Uthram', 'Atham', 'Chitra', 'Choti', 'Vishakham', 'Anizham', 'Thrikketta', 'Moolam', 'Pooradam', 'Uthradam', 'Thiruvonam', 'Avittam', 'Chathayam', 'Pooruruttathi', 'Uthruttathi', 'Revathi'].map(star => (
                                                    <option key={star} value={star}>{star}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-orange-50 border border-orange-100 rounded-[2.5rem] p-8 flex justify-between items-center animate-in zoom-in duration-300 relative z-10">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-emerald-500 shadow-xl shadow-orange-200/20 border border-orange-100">
                                            <CheckCircle2 size={40} />
                                        </div>
                                        <div>
                                            <div className="font-black text-3xl text-slate-900 uppercase tracking-tight leading-tight">{selectedDevotee.name}</div>
                                            <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1 italic">
                                                MOBILE: {selectedDevotee.phone} • NAKSHATHRAM: {selectedDevotee.star} • <span className="font-malayalam text-orange-600 text-sm tracking-normal">{selectedDevotee.name_ml}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => { setSelectedDevotee(null); setData('devotee_id', ''); }}
                                        className="text-[10px] font-black text-white bg-slate-900 hover:bg-red-600 px-8 py-3 rounded-2xl transition-all uppercase tracking-widest shadow-lg active:scale-95"
                                    >
                                        Dismiss Profile
                                    </button>
                                </div>
                            )}
                            {errors.devotee_id && <p className="mt-4 text-[10px] font-black text-red-500 uppercase tracking-[0.2em] px-2 italic">Essential: Please identify a devotee to continue.</p>}

                            <DevoteeSearchModal
                                show={showSearchModal}
                                onClose={() => setShowSearchModal(false)}
                                onSelect={selectDevotee}
                            />
                        </div>

                        {/* Vazhipadu Selection Grid */}
                        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 p-10">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                                    <Sparkles size={16} className="text-orange-500" /> Step 02: Offering Catalog
                                </h3>
                                <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-wider italic">
                                    Total Items: {vazhipadus.length} Ready
                                </div>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {vazhipadus.map(v => (
                                    <button
                                        key={v.id}
                                        type="button"
                                        onClick={() => setData('vazhipadu_id', v.id.toString())}
                                        className={`p-5 rounded-[2rem] border-2 text-left transition-all duration-300 relative group flex flex-col justify-between h-40 ${data.vazhipadu_id === v.id.toString()
                                            ? 'border-orange-600 bg-orange-600 text-white shadow-2xl shadow-orange-200 transform scale-[1.05] z-10'
                                            : 'border-slate-50 bg-slate-50 hover:border-orange-200 hover:bg-white text-slate-900'}`}
                                    >
                                        <div>
                                            {data.vazhipadu_id === v.id.toString() && (
                                                <div className="absolute top-4 right-4 text-white">
                                                    <CheckCircle2 size={16} />
                                                </div>
                                            )}
                                            <div className={`text-xs font-black uppercase tracking-tight leading-tight mb-1 truncate ${data.vazhipadu_id === v.id.toString() ? 'text-white' : 'text-slate-900'}`}>
                                                {v.name}
                                            </div>
                                            <div className={`text-[10px] font-malayalam tracking-normal mb-4 truncate ${data.vazhipadu_id === v.id.toString() ? 'text-orange-100' : 'text-slate-400'}`}>
                                                {v.name_ml}
                                            </div>
                                        </div>
                                        <div className={`text-xl font-black tabular-nums ${data.vazhipadu_id === v.id.toString() ? 'text-white' : 'text-orange-600'}`}>
                                            ₹{parseFloat(v.rate).toLocaleString('en-IN')}
                                        </div>
                                    </button>
                                ))}
                            </div>
                            {errors.vazhipadu_id && <p className="mt-6 text-[10px] font-black text-red-500 uppercase tracking-[0.2em] italic px-2">Catalog selection required for checkout.</p>}
                        </div>

                        {/* Master Setup Panel */}
                        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 p-10 flex flex-col md:flex-row gap-8">
                            <div className="flex-1 space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Selected Deity (പ്രതിഷ്ഠ)</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-orange-500">
                                        <Flame size={18} />
                                    </div>
                                    <select
                                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-black text-slate-900 text-xs appearance-none uppercase tracking-widest cursor-pointer"
                                        value={data.deity_id}
                                        onChange={e => setData('deity_id', e.target.value)}
                                    >
                                        {deities.map(d => (
                                            <option key={d.id} value={d.id} className="font-black uppercase tracking-widest">{d.name} ({d.name_ml})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex-1 space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Sacred Date</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-orange-500">
                                        <Clock size={18} />
                                    </div>
                                    <input
                                        type="date"
                                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-black text-slate-900 text-xs uppercase tracking-widest"
                                        value={data.booking_date}
                                        onChange={e => setData('booking_date', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Checkout Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-slate-200 sticky top-12 overflow-hidden group">
                            {/* Glow Effect */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-600/10 rounded-full blur-[80px] group-hover:bg-orange-600/20 transition-all duration-700" />

                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 mb-10 relative z-10">Checkout Invoice</h3>

                            <div className="space-y-10 relative z-10">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Total Payable Value</p>
                                    <div className="text-6xl font-black tracking-tighter tabular-nums text-white">
                                        ₹{parseFloat(vazhipadus.find(v => v.id.toString() === data.vazhipadu_id)?.rate || '0.00').toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Selection Summary</p>
                                        {data.vazhipadu_id && <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />}
                                    </div>
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 italic text-sm font-medium text-slate-300 leading-relaxed min-h-[100px] flex items-center">
                                        {data.vazhipadu_id
                                            ? `Sacred offering of "${vazhipadus.find(v => v.id.toString() === data.vazhipadu_id)?.name}" at ${deities.find(d => d.id.toString() === data.deity_id)?.name || 'Main Shrine'} for ${selectedDevotee?.name || 'Authorized Devotee'}.`
                                            : "Awaiting Vazhipadu selection..."
                                        }
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-1">Payment Method</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['Cash', 'UPI', 'Card', 'Bank'].map(mode => (
                                            <button
                                                key={mode}
                                                type="button"
                                                onClick={() => setData('payment_mode', mode)}
                                                className={`py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${data.payment_mode === mode
                                                    ? 'bg-orange-600 border-orange-600 text-white shadow-xl shadow-orange-950/20'
                                                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                                                    }`}
                                            >
                                                {mode}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-white/5 space-y-6">
                                    <div className="flex items-center justify-between px-1">
                                        <div className="flex items-center gap-2">
                                            <Languages size={14} className="text-orange-500" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Transliteration</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setIsManglish(!isManglish)}
                                            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${isManglish ? 'bg-orange-600 border-orange-600 text-white shadow-lg' : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300'}`}
                                        >
                                            {isManglish ? 'Enabled' : 'Disabled'}
                                        </button>
                                    </div>

                                    <button
                                        onClick={submit}
                                        disabled={processing || !data.devotee_id || !data.vazhipadu_id}
                                        className="w-full bg-white text-slate-900 hover:bg-orange-50 disabled:opacity-30 disabled:grayscale font-black py-6 rounded-[2rem] shadow-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4 text-xs uppercase tracking-[0.3em]"
                                    >
                                        {processing ? 'Processing...' : (
                                            <>
                                                Print Sacred Receipt <Printer size={22} className="text-orange-600 transition-transform group-hover:rotate-12" />
                                            </>
                                        )}
                                    </button>

                                    <Link href="/bookings" className="block w-full text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-colors py-2 group/back">
                                        <span className="inline-flex items-center gap-2 group-hover/back:-translate-x-2 transition-transform">
                                            <ArrowRight size={14} className="rotate-180" /> Cancel Entry
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Audit Compliance */}
                        <div className="bg-orange-50 rounded-[2rem] p-8 border border-orange-100 flex gap-4">
                            <Sparkles size={20} className="text-orange-600 shrink-0" />
                            <p className="text-[10px] font-black text-orange-800/60 uppercase tracking-widest leading-relaxed">
                                Every transaction is digitally signed and audited. Receipt formatting adheres to Sacred Temple Bylaws and GAAP accounting standards.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                input[type="date"]::-webkit-calendar-picker-indicator {
                    filter: invert(47%) sepia(87%) saturate(2718%) hue-rotate(3deg) brightness(101%) contrast(105%);
                    cursor: pointer;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
