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
    CheckCircle2,
    Trash2
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { debounce } from 'lodash';
import { fetchMalayalamTransliteration } from '@/Services/MalayalamService';

interface Devotee {
    id: number;
    name: string;
    name_ml: string;
    phone: string;
    star: string;
    address: string;
}

export default function Edit({ auth, devotee }: PageProps & { devotee: Devotee }) {
    const { data, setData, put, processing, errors } = useForm({
        name: devotee.name || '',
        name_ml: devotee.name_ml || '',
        phone: devotee.phone || '',
        star: devotee.star || '',
        address: devotee.address || '',
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
        // Only trigger if name is changed and not empty
        if (data.name !== devotee.name) {
            debouncedTransliterate(data.name);
        }
    }, [data.name, debouncedTransliterate, devotee.name]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('devotees.update', devotee.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('devotees.index')}
                            className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-slate-900 rounded-2xl transition-all shadow-sm group"
                        >
                            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        </Link>
                        <div>
                            <h2 className="font-black text-2xl text-slate-900 tracking-tight flex items-center gap-3">
                                Update Devotee Profile
                            </h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Modifying Registry Entry: {devotee.id}</p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={`Edit ${devotee.name}`} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-20">
                <div className="lg:col-span-2">
                    <form onSubmit={submit} className="bg-white rounded-[2.5rem] p-12 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                            {/* Personal Details Section */}
                            <div className="space-y-8 md:col-span-2">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 pb-4 border-b border-slate-50">
                                    <User size={14} className="text-orange-500" /> Identity Information
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Full Name (English)</label>
                                        <div className="relative group">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors">
                                                <User size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-black text-slate-900 placeholder:text-slate-300 uppercase tracking-tight"
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                                placeholder="ENTER FULL NAME"
                                                required
                                            />
                                        </div>
                                        {errors.name && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Name in Malayalam</label>
                                        <div className="relative group">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors">
                                                <Languages size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold text-slate-900 placeholder:text-slate-300 font-malayalam"
                                                value={data.name_ml}
                                                onChange={e => setData('name_ml', e.target.value)}
                                                placeholder="പേര് നൽകുക"
                                            />
                                        </div>
                                        {errors.name_ml && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1">{errors.name_ml}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Contact & Sacred Details */}
                            <div className="space-y-8 md:col-span-2 pt-4">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 pb-4 border-b border-slate-50">
                                    <Sparkles size={14} className="text-orange-500" /> Contact & Sacred Details
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Mobile Number</label>
                                        <div className="relative group">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors">
                                                <Phone size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-black text-slate-900 tabular-nums"
                                                value={data.phone}
                                                onChange={e => setData('phone', e.target.value)}
                                                placeholder="+91 00000 00000"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Birth Star (നക്ഷത്രം)</label>
                                        <div className="relative group">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors">
                                                <Star size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-black text-slate-900 uppercase tracking-tight"
                                                value={data.star}
                                                onChange={e => setData('star', e.target.value)}
                                                placeholder="E.G. ASWATHI"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Residential Address */}
                            <div className="space-y-3 md:col-span-2 pt-4">
                                <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <MapPin size={12} className="text-orange-500" /> Permanent Address
                                </label>
                                <textarea
                                    className="w-full p-6 bg-slate-50 border-none rounded-[1.5rem] focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold text-slate-900 placeholder:text-slate-300 min-h-[120px]"
                                    value={data.address}
                                    onChange={e => setData('address', e.target.value)}
                                    placeholder="ENTER COMPLETE RESIDENTIAL ADDRESS..."
                                />
                            </div>
                        </div>

                        <div className="mt-12 pt-10 border-t border-slate-50 flex justify-end items-center gap-6">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic flex items-center gap-2">
                                <CheckCircle2 size={14} className="text-emerald-500" /> Data integrity verified
                            </span>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-slate-900 hover:bg-orange-600 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center gap-3 transition-all shadow-2xl active:scale-95 disabled:opacity-50"
                            >
                                <Save size={18} /> {processing ? 'Updating Registry...' : 'Authorize Changes'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Info Panel */}
                <div className="space-y-8">
                    <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all duration-700" />
                        <h3 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-10 pb-4 border-b border-white/5">Update Summary</h3>

                        <div className="space-y-8">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-orange-500 border border-white/5">
                                    <User size={24} />
                                </div>
                                <div>
                                    <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Identity</div>
                                    <div className="font-black text-sm uppercase tracking-tight">{data.name || 'UNSPECIFIED'}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-orange-500 border border-white/5">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Contact</div>
                                    <div className="font-black text-sm tabular-nums tracking-widest">{data.phone || 'NO PHONE'}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-orange-500 border border-white/5">
                                    <Star size={24} />
                                </div>
                                <div>
                                    <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Sacred Stat</div>
                                    <div className="font-black text-sm uppercase tracking-widest">{data.star || 'NOT SET'}</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 bg-white/5 p-6 rounded-2xl border border-white/5">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-relaxed italic">
                                Modifying official devotee records requires high-level administrative clearance. All changes are logged in the central security audit trail.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
