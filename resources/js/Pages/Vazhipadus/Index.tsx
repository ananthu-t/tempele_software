import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    ChevronRight,
    SearchX,
    Sparkles,
    HandCoins,
    Clock,
    Flame
} from 'lucide-react';
import { useState } from 'react';

interface Vazhipadu {
    id: number;
    name: string;
    name_ml: string;
    rate: string;
    duration: string;
    description: string;
}

export default function Index({ auth, vazhipadus }: PageProps & { vazhipadus: Vazhipadu[] }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredVazhipadus = vazhipadus.filter(v =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (v.name_ml && v.name_ml.includes(searchTerm))
    );

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to remove this vazhipadu offering?')) {
            router.delete(route('vazhipadus.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h2 className="font-black text-2xl text-slate-900 tracking-tight flex items-center gap-3">
                            Vazhipadu Offering Master
                        </h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Sacred Service Catalog & Pricing</p>
                    </div>
                    <Link
                        href={route('vazhipadus.create')}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-xl shadow-orange-100 hover:scale-[1.02] active:scale-95"
                    >
                        <Plus size={18} /> New Offering
                    </Link>
                </div>
            }
        >
            <Head title="Vazhipadu Master" />

            <div className="space-y-8">

                {/* Search Bar */}
                <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="relative flex-1 group">
                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300 group-focus-within:text-orange-500 transition-colors">
                            <Search size={20} />
                        </div>
                        <input
                            type="text"
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-black text-slate-900 placeholder:text-slate-300 uppercase tracking-widest text-xs"
                            placeholder="SEARCH BY NAME OR MALAYALAM..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Offerings Table */}
                <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Ritual Detail</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Value (₹)</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Window</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Settings</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredVazhipadus.length > 0 ? (
                                filteredVazhipadus.map((item) => (
                                    <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-orange-100 group-hover:text-orange-600 transition-all border border-slate-100">
                                                    <HandCoins size={24} />
                                                </div>
                                                <div>
                                                    <div className="font-black text-slate-900 uppercase tracking-tight leading-tight group-hover:text-orange-600 transition-colors">{item.name}</div>
                                                    <div className="font-malayalam text-orange-600 font-bold text-sm mt-0.5">{item.name_ml}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="text-xl font-black text-slate-900 tabular-nums">
                                                <span className="text-orange-600 mr-1 text-sm font-black">₹</span>
                                                {parseFloat(item.rate).toLocaleString('en-IN')}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest px-3 py-1.5 bg-slate-50 rounded-lg group-hover:bg-white border border-transparent group-hover:border-slate-100 transition-all">
                                                <Clock size={12} className="text-slate-300" />
                                                {item.duration || 'STANDARD'}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={route('vazhipadus.edit', item.id)}
                                                    className="p-3 bg-white text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all border border-slate-100 hover:border-orange-100 shadow-sm"
                                                >
                                                    <Edit2 size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-3 bg-white text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-slate-100 hover:border-red-100 shadow-sm"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-10 py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 text-slate-300">
                                            <SearchX size={64} strokeWidth={1} />
                                            <p className="text-xs font-black uppercase tracking-[0.3em]">Nirnaya results for "{searchTerm}"</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Audit Note */}
                <div className="bg-orange-50 rounded-[2rem] p-8 border border-orange-100 flex gap-4 max-w-2xl">
                    <Sparkles size={20} className="text-orange-600 shrink-0" />
                    <p className="text-[10px] font-black text-orange-800/60 uppercase tracking-widest leading-relaxed">
                        Offering catalog syncs automatically with the Digital Vazhipadu Counter. Pricing adjustments are timestamped and logged in the System Audit Trail.
                    </p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
