import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    Plus,
    Home,
    Truck,
    Music,
    Edit2,
    Calendar,
    Search,
    Trash2,
    ChevronRight,
    SearchX,
    Sparkles,
    Building2,
    Store
} from 'lucide-react';
import { useState } from 'react';

interface Asset {
    id: number;
    name: string;
    name_ml: string;
    type: string;
    base_rate: string;
    description: string;
}

export default function Index({ auth, assets }: PageProps & { assets: Asset[] }) {
    const [search, setSearch] = useState('');

    const getTypeIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'hall': return <Building2 size={24} />;
            case 'vehicle': return <Truck size={24} />;
            case 'sound': return <Music size={24} />;
            case 'store': return <Store size={24} />;
            default: return <Home size={24} />;
        }
    };

    const filteredAssets = assets.filter(a =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.name_ml?.includes(search)
    );

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to retire this asset record? Existing bookings will remain but no new ones can be created.')) {
            router.delete(route('assets.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h2 className="font-black text-2xl text-slate-900 tracking-tight flex items-center gap-3">
                            Temple Asset Registry
                        </h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Facility & Equipment Management</p>
                    </div>
                    <div className="flex gap-4">
                        <Link
                            href={route('asset-bookings.index')}
                            className="bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
                        >
                            <Calendar size={16} /> All Reservations
                        </Link>
                        <Link
                            href={route('assets.create')}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-xl shadow-orange-100 hover:scale-[1.02] active:scale-95"
                        >
                            <Plus size={18} /> Register Asset
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Temple Assets" />

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
                            placeholder="SEARCH BY ASSET NAME, TYPE, OR MALAYALAM..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Assets Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                    {filteredAssets.map((asset) => (
                        <div key={asset.id} className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 hover:shadow-xl transition-all duration-500 group relative overflow-hidden flex flex-col justify-between min-h-[340px]">

                            {/* Type Watermark */}
                            <div className="absolute -bottom-10 -right-10 text-slate-50 group-hover:text-orange-50 transition-colors duration-500 scale-[3]">
                                {getTypeIcon(asset.type)}
                            </div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-600 transition-all duration-500 border border-slate-100 shadow-sm">
                                        {getTypeIcon(asset.type)}
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                                        <Link
                                            href={route('assets.edit', asset.id)}
                                            className="p-3 bg-white text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all border border-slate-100 hover:border-orange-100 shadow-sm"
                                        >
                                            <Edit2 size={16} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(asset.id)}
                                            className="p-3 bg-white text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-slate-100 hover:border-red-100 shadow-sm"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-500 px-2 py-0.5 bg-orange-50 rounded border border-orange-100">{asset.type}</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 leading-tight uppercase tracking-tighter truncate mt-2">{asset.name}</h3>
                                    <p className="font-malayalam text-lg font-bold text-slate-400 group-hover:text-orange-600 transition-colors">{asset.name_ml}</p>
                                </div>

                                <p className="mt-4 text-[11px] font-bold text-slate-400 leading-relaxed italic line-clamp-2">
                                    {asset.description || 'Reliable temple asset managed by central administration.'}
                                </p>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center relative z-10">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Standard Base Rate</p>
                                    <p className="text-2xl font-black text-slate-900 tabular-nums flex items-center gap-1">
                                        <span className="text-orange-600 text-sm">₹</span>{parseFloat(asset.base_rate).toLocaleString('en-IN')}
                                    </p>
                                </div>
                                <Link
                                    href={route('asset-bookings.create', { asset_id: asset.id })}
                                    className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg active:scale-95 flex items-center gap-2"
                                >
                                    Instant Book <ChevronRight size={14} />
                                </Link>
                            </div>
                        </div>
                    ))}

                    {filteredAssets.length === 0 && (
                        <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                            <div className="flex flex-col items-center gap-4 text-slate-300">
                                <SearchX size={64} strokeWidth={1} />
                                <p className="text-xs font-black uppercase tracking-[0.3em] font-sans">No assets matching your search criteria</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Statutory Note */}
                <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group max-w-2xl">
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all duration-700" />
                    <div className="flex gap-4 relative z-10">
                        <Sparkles size={20} className="text-orange-500 shrink-0" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                            Temple assets are public property under Devaswom management. Unauthorized use or booking without payment is strictly prohibited under Religious & Charitable Endowments Act.
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
