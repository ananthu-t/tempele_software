import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    ChevronLeft,
    UserPlus,
    Save,
    User,
    Phone,
    Star,
    MapPin,
    Languages,
    Sparkles,
    CheckCircle2
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { debounce } from 'lodash';
import { fetchMalayalamTransliteration } from '@/Services/MalayalamService';

export default function Create({ auth }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        name_ml: '',
        phone: '',
        star: '',
        address: '',
    });

    const debouncedTransliterate = useMemo(
        () => debounce(async (val: string) => {
            if (val) {
                const result = await fetchMalayalamTransliteration(val);
                setData('name_ml', result);
            }
        }, 500),
        [setData]
    );

    useEffect(() => {
        debouncedTransliterate(data.name);
    }, [data.name, debouncedTransliterate]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('devotees.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('devotees.index')} className="p-2 hover:bg-white rounded-xl shadow-sm border border-slate-200 transition-all text-slate-500 hover:text-orange-600">
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h2 className="font-black text-2xl text-slate-900 tracking-tight">Enroll New Devotee</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Member Management Card</p>
                    </div>
                </div>
            }
        >
            <Head title="Enroll Devotee" />

            <div className="max-w-4xl mx-auto py-12">
                <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-10">

                    {/* Portrait / Summary Side */}
                    <div className="md:col-span-1">
                        <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                            {/* Decorative background */}
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-600/20 rounded-full blur-3xl group-hover:bg-orange-600/40 transition-all duration-700" />

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-white/10 rounded-[2rem] flex items-center justify-center text-orange-500 mb-6 border border-white/10 shadow-xl">
                                    <User size={48} />
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-tighter leading-tight mb-2">
                                    {data.name || 'FULL NAME'}
                                </h3>
                                <p className="font-malayalam text-orange-400 text-lg mb-8">{data.name_ml || 'പേര്'}</p>

                                <div className="w-full space-y-4 pt-6 border-t border-white/5">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        <span>Phone</span>
                                        <span className="text-white">{data.phone || '---'}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        <span>Nakshathram</span>
                                        <span className="text-white">{data.star || '---'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 bg-orange-50 rounded-3xl p-6 border border-orange-100 flex gap-4">
                            <Sparkles size={20} className="text-orange-600 shrink-0" />
                            <p className="text-[10px] font-black text-orange-800/60 uppercase tracking-widest leading-relaxed">
                                Devotee records are indexed for rapid lookup during Vazhipadu and Donation entries.
                            </p>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 p-10">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-orange-500" /> Registry Details
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">English Name</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-2xl bg-slate-50 border-slate-100 p-5 font-black text-slate-900 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all placeholder:text-slate-300 uppercase tracking-tight"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="E.G. HARIKRISHNAN"
                                        required
                                    />
                                    {errors.name && <p className="text-[10px] font-black text-red-500 uppercase px-1">{errors.name}</p>}
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 italic">പേര് (MALAYALAM)</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-2xl bg-slate-50 border-slate-100 p-5 font-bold text-slate-900 font-malayalam focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all placeholder:text-slate-300"
                                        value={data.name_ml}
                                        onChange={e => setData('name_ml', e.target.value)}
                                        placeholder="മലയാളത്തിൽ"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Contact Number</label>
                                    <div className="relative">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">
                                            <Phone size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border-slate-100 rounded-2xl font-black text-slate-900 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all placeholder:text-slate-300 uppercase tracking-widest tabular-nums"
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                            placeholder="9876543210"
                                            required
                                        />
                                    </div>
                                    {errors.phone && <p className="text-[10px] font-black text-red-500 uppercase px-1">{errors.phone}</p>}
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Birth Star (Nakshathram)</label>
                                    <div className="relative">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-500">
                                            <Star size={18} />
                                        </div>
                                        <select
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border-slate-100 rounded-2xl font-black text-slate-900 text-xs focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all cursor-pointer uppercase tracking-widest appearance-none"
                                            value={data.star}
                                            onChange={e => setData('star', e.target.value)}
                                        >
                                            <option value="">Select Star</option>
                                            {['Ashwati', 'Bharani', 'Kartika', 'Rohini', 'Makiryam', 'Thiruvathira', 'Punartham', 'Pooyam', 'Ayilyam', 'Makam', 'Pooram', 'Uthram', 'Atham', 'Chitra', 'Choti', 'Vishakham', 'Anizham', 'Thrikketta', 'Moolam', 'Pooradam', 'Uthradam', 'Thiruvonam', 'Avittam', 'Chathayam', 'Pooruruttathi', 'Uthruttathi', 'Revathi'].map(star => (
                                                <option key={star} value={star}>{star}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-4 md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Residential Address</label>
                                    <div className="relative">
                                        <div className="absolute left-5 top-5 text-slate-300">
                                            <MapPin size={18} />
                                        </div>
                                        <textarea
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border-slate-100 rounded-3xl font-black text-slate-900 text-xs focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all placeholder:text-slate-300 uppercase tracking-widest min-h-[120px]"
                                            value={data.address}
                                            onChange={e => setData('address', e.target.value)}
                                            placeholder="HOUSE NAME, LOCALITY, PINCODE"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t border-slate-50">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-slate-900 text-white hover:bg-orange-600 font-black py-6 rounded-[2rem] shadow-2xl transition-all scale-100 hover:scale-[1.02] active:scale-95 disabled:opacity-50 uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4"
                                >
                                    {processing ? 'Processing...' : (
                                        <>
                                            Complete Enrollment <Save size={20} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
