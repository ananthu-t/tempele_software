import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    Plus,
    Edit2,
    Trash2,
    LayoutDashboard,
    Search,
    Flame,
    Sparkles,
    Ghost,
    ChevronRight,
    SearchX
} from 'lucide-react';
import { useState } from 'react';

interface Deity {
    id: number;
    name: string;
    name_ml: string;
    description: string;
}

export default function Index({ auth, deities }: PageProps & { deities: Deity[] }) {
    const [search, setSearch] = useState('');
    const { delete: destroy } = useForm();

    const filteredDeities = deities.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.name_ml?.includes(search)
    );

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to remove this deity?')) {
            destroy(route('deities.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h2 className="font-black text-2xl text-slate-900 tracking-tight flex items-center gap-3">
                            Sacred Deities Master
                        </h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Venerated Presences & Shrines</p>
                    </div>
                    <Link
                        href={route('deities.create')}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-xl shadow-orange-100 hover:scale-[1.02] active:scale-95"
                    >
                        <Plus size={18} /> Add New Deity
                    </Link>
                </div>
            }
        >
            <Head title="Deity Master" />

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
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Deities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                    {filteredDeities.map((deity) => (
                        <div key={deity.id} className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
                            {/* Decorative Icon Background */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-50 rounded-full flex items-center justify-center group-hover:bg-orange-100 transition-all duration-500">
                                <Flame size={40} className="text-orange-200 group-hover:text-orange-400 translate-x-4 translate-y-4" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-orange-600 border border-slate-100 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                                        <Flame size={32} />
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                                        <Link
                                            href={route('deities.edit', deity.id)}
                                            className="p-3 bg-white text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-2xl transition-all border border-slate-100 hover:border-orange-100 shadow-sm"
                                        >
                                            <Edit2 size={16} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(deity.id)}
                                            className="p-3 bg-white text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all border border-slate-100 hover:border-red-100 shadow-sm"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black text-slate-900 leading-tight uppercase tracking-tighter truncate">{deity.name}</h3>
                                <p className="text-orange-600 font-malayalam text-xl font-bold mt-1">{deity.name_ml}</p>

                                <div className="mt-8 pt-6 border-t border-slate-50 min-h-[5rem]">
                                    <p className="text-[11px] font-bold text-slate-400 leading-relaxed italic line-clamp-3">
                                        {deity.description || 'No description listed for this sacred presence.'}
                                    </p>
                                </div>

                                <div className="mt-6 flex items-center gap-2 group-hover:gap-3 transition-all text-[9px] font-black uppercase tracking-[0.2em] text-orange-500 cursor-pointer">
                                    Entity Registry <ChevronRight size={12} />
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredDeities.length === 0 && (
                        <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                            <div className="flex flex-col items-center gap-4 text-slate-300">
                                <SearchX size={64} strokeWidth={1} />
                                <p className="text-xs font-black uppercase tracking-[0.3em] font-sans">No matching Divine Presences</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
