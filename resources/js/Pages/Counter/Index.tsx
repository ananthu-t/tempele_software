import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { PageProps, Devotee } from '@/types';
import { Search, User, Zap, Printer, CheckCircle2, AlertCircle, X, ChevronDown, Loader2, RefreshCw, History } from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { debounce } from 'lodash';
import axios from 'axios';
import { fetchMalayalamTransliteration } from '@/Services/MalayalamService';
import { bluetoothPrinter } from '@/Services/BluetoothPrinterService';
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

export default function Index({ auth, vazhipadus, deities, nakshatras, accounts }: PageProps & { vazhipadus: Vazhipadu[], deities: any[], nakshatras: Star[], accounts: any[] }) {
    const { flash } = usePage<PageProps>().props as any;
    const [searchQuery, setSearchQuery] = useState('');
    const [devoteeResults, setDevoteeResults] = useState<Devotee[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDevoteePopup, setShowDevoteePopup] = useState(false);
    const [selectedDevotee, setSelectedDevotee] = useState<Devotee | null>(null);
    const [isPrinting, setIsPrinting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        devotee_id: '',
        vazhipadu_ids: [] as string[],
        deity_id: deities[0]?.id || '',
        booking_date: new Date().toISOString().split('T')[0],
        payment_mode: 'Cash',
        beneficiary_name: '',
        beneficiary_name_ml: '',
        beneficiary_nakshatra: '',
        beneficiary_nakshatra_ml: '',
        account_id: accounts[0]?.id || '',
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

    // Handle Auto-Print after success
    useEffect(() => {
        if (flash?.created_booking_ids && flash.created_booking_ids.length > 0) {
            handlePrintAll(flash.created_booking_ids);
            setShowSuccess(true);
        }
    }, [flash]);

    const handlePrintAll = async (ids: number[]) => {
        setIsPrinting(true);
        try {
            for (const id of ids) {
                const response = await axios.get(route('api.receipt.booking', id));
                await bluetoothPrinter.printReceipt(response.data);
            }
        } catch (error) {
            console.error('Printing failed:', error);
        } finally {
            setIsPrinting(false);
        }
    };

    const toggleVazhipadu = (id: string) => {
        const current = [...data.vazhipadu_ids];
        const index = current.indexOf(id);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(id);
        }
        setData('vazhipadu_ids', current);
    };

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
            preserveScroll: true,
            onSuccess: () => {
                // Success overlay handles state reset
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
                    <Link
                        href={route('counter.history')}
                        className="bg-white border border-slate-100 px-6 py-4 rounded-2xl font-black text-[10px] text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all flex items-center gap-3 uppercase tracking-widest shadow-sm"
                    >
                        <History size={16} /> View Audit History
                    </Link>
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

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block italic">Select Vazhipadus (Offerings)</label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                                                {vazhipadus.map(v => (
                                                    <button
                                                        key={v.id}
                                                        type="button"
                                                        onClick={() => toggleVazhipadu(v.id.toString())}
                                                        className={clsx(
                                                            "p-4 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col justify-between h-32",
                                                            data.vazhipadu_ids.includes(v.id.toString())
                                                                ? "border-slate-900 bg-slate-900 text-white shadow-xl"
                                                                : "border-slate-50 bg-slate-50 hover:border-slate-200 text-slate-900"
                                                        )}
                                                    >
                                                        <div>
                                                            <div className="text-[10px] font-black uppercase tracking-tight truncate">{v.name}</div>
                                                            <div className={clsx("text-[10px] font-malayalam tracking-normal mt-1 truncate", data.vazhipadu_ids.includes(v.id.toString()) ? "text-slate-400" : "text-slate-400")}>{v.name_ml}</div>
                                                        </div>
                                                        <div className={clsx("text-lg font-black tabular-nums", data.vazhipadu_ids.includes(v.id.toString()) ? "text-white" : "text-slate-900")}>₹{v.rate}</div>
                                                    </button>
                                                ))}
                                            </div>
                                            {errors.vazhipadu_ids && <p className="text-[10px] font-black text-red-500 italic uppercase tracking-[0.2em]">{errors.vazhipadu_ids}</p>}
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
                                disabled={processing || data.vazhipadu_ids.length === 0}
                                className="w-full bg-slate-900 text-white font-black py-6 rounded-[2rem] shadow-2xl transition-all hover:bg-slate-800 active:scale-95 flex items-center justify-center gap-4 text-xs uppercase tracking-[0.3em] disabled:opacity-30 disabled:grayscale"
                            >
                                {processing ? 'Processing...' : (
                                    <>
                                        Print Sacred Receipt <Printer size={22} className="text-orange-600" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Checkout Info */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-slate-200">
                        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 mb-8">Checkout Summary</h3>

                        <div className="space-y-10">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Net Amount Payable</p>
                                <div className="text-6xl font-black tracking-tighter tabular-nums text-white">
                                    ₹{data.vazhipadu_ids.reduce((sum, id) => {
                                        const v = vazhipadus.find(v => v.id.toString() === id);
                                        return sum + parseFloat(v?.rate || '0');
                                    }, 0).toLocaleString('en-IN')}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 italic">Accounting Head (ERP)</p>
                                <div className="relative group">
                                    <select
                                        className="w-full pl-6 pr-10 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-black text-white text-[10px] appearance-none uppercase tracking-widest cursor-pointer group-hover:bg-white/10"
                                        value={data.account_id}
                                        onChange={e => setData('account_id', e.target.value)}
                                    >
                                        {accounts.map(acc => (
                                            <option key={acc.id} value={acc.id} className="text-slate-900">{acc.name} ({acc.code})</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500">
                                        <ChevronDown size={14} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 italic">Selection Log</p>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-sm font-medium text-slate-300 leading-relaxed min-h-[100px] flex items-center italic">
                                    {data.vazhipadu_ids.length > 0
                                        ? `Processing ${data.vazhipadu_ids.length} offerings for ${data.beneficiary_name || 'Sacred Devotee'}. Recorded under ${accounts.find(a => a.id.toString() === data.account_id.toString())?.name || 'Revenue Account'}.`
                                        : "Awaiting ritual selection..."
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    {selectedDevotee && (
                        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 space-y-4 animate-in zoom-in-95 duration-300">
                            <div className="flex items-center gap-3">
                                <div className="bg-slate-100 p-2 rounded-xl">
                                    <User size={20} className="text-slate-900" />
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Active Devotee</div>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">{selectedDevotee.name}</h3>
                                <p className="text-sm font-medium text-slate-500">{selectedDevotee.name_ml}</p>
                            </div>
                            <div className="pt-4 border-t border-slate-50 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400 italic">
                                <span>{selectedDevotee.phone}</span>
                                <span>{selectedDevotee.star || 'RASHICHAKRAM'}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="bg-white rounded-[3rem] p-12 max-w-lg w-full text-center shadow-2xl space-y-8 animate-in zoom-in-95 duration-500">
                        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                            <CheckCircle2 size={48} />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">Booking Successful</h3>
                            <p className="text-slate-500 font-bold mt-2 uppercase text-xs tracking-widest italic">{flash?.success}</p>
                        </div>

                        <div className="bg-slate-50 rounded-3xl p-6 flex items-center justify-center gap-4">
                            {isPrinting ? (
                                <>
                                    <Loader2 className="animate-spin text-orange-600" size={20} />
                                    <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Printing Recipes...</span>
                                </>
                            ) : (
                                <>
                                    <Printer className="text-emerald-600" size={20} />
                                    <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Receipts Sent to Printer</span>
                                </>
                            )}
                        </div>

                        <button
                            onClick={() => {
                                setShowSuccess(false);
                                reset();
                                setSelectedDevotee(null);
                                setSearchQuery('');
                            }}
                            className="w-full bg-slate-900 hover:bg-emerald-600 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 group"
                        >
                            <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" /> Confirm & Post New Entry
                        </button>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
