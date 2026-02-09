import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps, Devotee } from '@/types';
import { Search, User, Zap, Printer, CheckCircle2, AlertCircle, X, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { debounce } from 'lodash';
import axios from 'axios';
import { fetchMalayalamTransliteration } from '@/Services/MalayalamService';
import clsx from 'clsx';

interface Vazhipadu {
    id: number;
    name: string;
    name_ml: string | null;
    rate: string;
    category: { name: string };
}

interface Star {
    id: number;
    name: string;
    name_ml: string;
}

export default function Index({ auth, vazhipadus, deities, nakshatras }: PageProps & { vazhipadus: Vazhipadu[], deities: any[], nakshatras: Star[] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [devoteeResults, setDevoteeResults] = useState<Devotee[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDevoteePopup, setShowDevoteePopup] = useState(false);
    const [selectedDevotee, setSelectedDevotee] = useState<Devotee | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        devotee_id: '',
        vazhipadu_id: '',
        deity_id: deities[0]?.id || '',
        booking_date: new Date().toISOString().split('T')[0],
        payment_mode: 'Cash',
        beneficiary_name: '',
        beneficiary_name_ml: '',
        beneficiary_nakshatra: '',
        beneficiary_nakshatra_ml: '',
        remarks: '',
    });

    const searchTimeout = useRef<any>(null);

    const debouncedTransliterate = useMemo(
        () => debounce(async (field: 'beneficiary_name_ml' | 'beneficiary_nakshatra_ml', val: string) => {
            if (val) {
                const result = await fetchMalayalamTransliteration(val);
                setData(field, result);
            }
        }, 500),
        [setData]
    );

    // Auto-transliterate beneficiary name
    useEffect(() => {
        debouncedTransliterate('beneficiary_name_ml', data.beneficiary_name);
    }, [data.beneficiary_name, debouncedTransliterate]);

    // Auto-transliterate nakshatra
    useEffect(() => {
        debouncedTransliterate('beneficiary_nakshatra_ml', data.beneficiary_nakshatra);
    }, [data.beneficiary_nakshatra, debouncedTransliterate]);

    const handleDevoteeSearch = (q: string) => {
        setSearchQuery(q);
        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        if (q.length < 3) {
            setDevoteeResults([]);
            setShowDevoteePopup(false);
            return;
        }

        setIsSearching(true);
        searchTimeout.current = setTimeout(async () => {
            try {
                const response = await axios.get(route('api.devotees.search'), { params: { q } });
                setDevoteeResults(response.data);
                setShowDevoteePopup(true);
            } catch (error) {
                console.error('Search failed', error);
            } finally {
                setIsSearching(false);
            }
        }, 300);
    };

    const selectDevotee = (devotee: Devotee) => {
        setSelectedDevotee(devotee);
        setData(d => ({
            ...d,
            devotee_id: String(devotee.id),
            beneficiary_name: devotee.name,
            beneficiary_name_ml: devotee.name_ml || '',
            beneficiary_nakshatra: devotee.star || '',
        }));
        setShowDevoteePopup(false);
        setSearchQuery('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('bookings.store'), {
            onSuccess: () => {
                reset();
                setSelectedDevotee(null);
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-4">
                        <div className="bg-slate-900 p-3 rounded-2xl shadow-lg shadow-slate-200">
                            <Zap className="text-white" size={24} />
                        </div>
                        <div>
                            <h2 className="font-black text-2xl text-slate-900 tracking-tight">Counter Terminal</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Specialized Fast Entry</p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Counter" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Form */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden relative">
                        {/* Devotee Search Header */}
                        <div className="p-8 border-b border-slate-50 relative z-20 bg-white">
                            <div className="relative group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={20} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => handleDevoteeSearch(e.target.value)}
                                    placeholder="SEARCH DEVOTEE BY NAME OR PHONE..."
                                    className="w-full bg-slate-50 border-none rounded-2xl py-6 pl-16 pr-6 font-black text-slate-900 uppercase tracking-wider text-sm focus:ring-2 focus:ring-slate-900/5 transition-all"
                                />
                                {isSearching && (
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 animate-spin rounded-full h-4 w-4 border-2 border-slate-200 border-t-slate-900"></div>
                                )}
                            </div>

                            {/* Devotee Search Popup */}
                            {showDevoteePopup && devoteeResults.length > 0 && (
                                <div className="absolute top-full left-8 right-8 mt-2 bg-white rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.15)] border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-4">
                                    <div className="p-4 bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex justify-between items-center">
                                        <span>Search Results ({devoteeResults.length})</span>
                                        <button onClick={() => setShowDevoteePopup(false)}><X size={14} /></button>
                                    </div>
                                    <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-50">
                                        {devoteeResults.map((devotee) => (
                                            <button
                                                key={devotee.id}
                                                onClick={() => selectDevotee(devotee)}
                                                className="w-full text-left p-6 hover:bg-slate-50 transition-colors flex items-center justify-between group"
                                            >
                                                <div>
                                                    <div className="font-black text-slate-900 uppercase tracking-tight text-sm flex items-center gap-3">
                                                        {devotee.name}
                                                        {devotee.name_ml && <span className="text-slate-400 font-medium ml-2">{devotee.name_ml}</span>}
                                                    </div>
                                                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1 italic">{devotee.phone} • {devotee.star || 'No Star'}</div>
                                                </div>
                                                <div className="bg-slate-50 group-hover:bg-slate-900 group-hover:text-white p-2 rounded-xl transition-all">
                                                    <Zap size={14} />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Booking Form */}
                        <form onSubmit={handleSubmit} className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Beneficiary Details */}
                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                                        <div className="h-[1px] w-6 bg-slate-200"></div> Beneficiary Information
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block italic">Beneficiary Name (English / Manglish)</label>
                                            <input
                                                type="text"
                                                value={data.beneficiary_name}
                                                onChange={e => setData('beneficiary_name', e.target.value)}
                                                className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 font-black text-slate-900 uppercase tracking-tight focus:ring-2 focus:ring-slate-900/5 transition-all text-sm"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] mb-3 block italic">Malayalam (Automatic)</label>
                                            <input
                                                type="text"
                                                value={data.beneficiary_name_ml}
                                                onChange={e => setData('beneficiary_name_ml', e.target.value)}
                                                className="w-full bg-orange-50/30 border-none rounded-2xl py-5 px-6 font-medium text-slate-900 focus:ring-2 focus:ring-orange-900/5 transition-all text-lg"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block italic">Nakshatra/Star</label>
                                            <input
                                                type="text"
                                                list="stars-list"
                                                value={data.beneficiary_nakshatra}
                                                onChange={e => setData('beneficiary_nakshatra', e.target.value)}
                                                className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 font-black text-slate-900 uppercase tracking-tight focus:ring-2 focus:ring-slate-900/5 transition-all text-sm"
                                            />
                                            <datalist id="stars-list">
                                                {nakshatras.map(n => <option key={n.id} value={n.name}>{n.name_ml}</option>)}
                                            </datalist>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] mb-3 block italic">Star (ML)</label>
                                            <input
                                                type="text"
                                                value={data.beneficiary_nakshatra_ml}
                                                onChange={e => setData('beneficiary_nakshatra_ml', e.target.value)}
                                                className="w-full bg-orange-50/30 border-none rounded-2xl py-5 px-6 font-medium text-slate-900 focus:ring-2 focus:ring-orange-900/5 transition-all text-lg"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Ritual Details */}
                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                                        <div className="h-[1px] w-6 bg-slate-200"></div> Ritual & Deities
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block italic">Select Deitity</label>
                                            <select
                                                value={data.deity_id}
                                                onChange={e => setData('deity_id', e.target.value)}
                                                className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 font-black text-slate-900 uppercase tracking-tight focus:ring-2 focus:ring-slate-900/5 transition-all text-sm"
                                            >
                                                {deities.map(d => <option key={d.id} value={d.id}>{d.name} {d.name_ml ? `(${d.name_ml})` : ''}</option>)}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block italic">Select Vazhipadu (Offering)</label>
                                            <select
                                                value={data.vazhipadu_id}
                                                onChange={e => setData('vazhipadu_id', e.target.value)}
                                                className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 font-black text-slate-900 uppercase tracking-tight focus:ring-2 focus:ring-slate-900/5 transition-all text-sm outline-none ring-0"
                                                required
                                            >
                                                <option value="">-- SELECT OFFERING --</option>
                                                {vazhipadus.map(v => (
                                                    <option key={v.id} value={v.id}>
                                                        {v.name} {v.name_ml ? `(${v.name_ml})` : ''} - ₹{v.rate}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block italic">Payment Mode</label>
                                            <select
                                                value={data.payment_mode}
                                                onChange={e => setData('payment_mode', e.target.value)}
                                                className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 font-black text-slate-900 uppercase tracking-tight focus:ring-2 focus:ring-slate-900/5 transition-all text-sm"
                                            >
                                                <option value="Cash">CASH</option>
                                                <option value="UPI">UPI / G-PAY</option>
                                                <option value="Card">CREDIT/DEBIT CARD</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block italic">Booking Date</label>
                                            <input
                                                type="date"
                                                value={data.booking_date}
                                                onChange={e => setData('booking_date', e.target.value)}
                                                className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 font-black text-slate-900 uppercase tracking-tight focus:ring-2 focus:ring-slate-900/5 transition-all text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-slate-900 hover:bg-black text-white py-8 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-slate-200 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-4"
                            >
                                {processing ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white"></div>
                                ) : (
                                    <>
                                        <Printer size={20} /> PRINT RECEIPT & CONFIRM
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Mini Dashboard */}
                <div className="lg:col-span-4 space-y-6">
                    {selectedDevotee && (
                        <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 space-y-4 animate-in zoom-in-95 duration-300">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/10 p-2 rounded-xl">
                                    <User size={20} className="text-white" />
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Active Devotee</div>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-black uppercase tracking-tight">{selectedDevotee.name}</h3>
                                <p className="text-sm font-medium text-white/60">{selectedDevotee.name_ml}</p>
                            </div>
                            <div className="pt-4 border-t border-white/10 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest opacity-70 italic">
                                <span>{selectedDevotee.phone}</span>
                                <span>{selectedDevotee.star || 'RASHICHAKRAM'}</span>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 space-y-8 shadow-[0_20px_60px_rgba(0,0,0,0.02)]">
                        <div>
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                                <Zap size={14} className="text-orange-500" /> Terminal Summary
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-4 border-b border-slate-50">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Base Rate</span>
                                    <span className="font-black text-slate-900">₹{vazhipadus.find(v => String(v.id) === data.vazhipadu_id)?.rate || '0.00'}</span>
                                </div>
                                <div className="flex justify-between items-center py-4 border-b border-slate-50">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Discount</span>
                                    <span className="font-black text-slate-400">₹0.00</span>
                                </div>
                                <div className="flex justify-between items-center pt-4">
                                    <span className="text-xs font-black text-slate-900 uppercase tracking-widest italic">Total Payable</span>
                                    <span className="text-2xl font-black text-slate-900">₹{vazhipadus.find(v => String(v.id) === data.vazhipadu_id)?.rate || '0.00'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-orange-50/50 rounded-[2rem] border border-orange-100/50">
                        <p className="text-[10px] font-black text-orange-900/60 uppercase leading-relaxed tracking-wider italic">
                            * Tip: Type names in English/Manglish for auto-transliteration to Malayalam. Use Tab to navigate quickly between fields.
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
