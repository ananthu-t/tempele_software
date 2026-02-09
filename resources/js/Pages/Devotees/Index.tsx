import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    Users,
    Search,
    UserPlus,
    Edit2,
    Trash2,
    Phone,
    Star,
    ChevronRight,
    SearchX
} from 'lucide-react';
import { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';

interface Devotee {
    id: number;
    name: string;
    name_ml: string;
    phone: string;
    star: string;
    address: string;
}

interface Meta {
    links: any[];
}

export default function Index({ auth, devotees, filters }: PageProps & { devotees: { data: Devotee[], meta: any, links: any[] }, filters: any }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = useCallback(
        debounce((query: string) => {
            router.get(route('devotees.index'), { search: query }, { preserveState: true, replace: true });
        }, 300),
        []
    );

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        handleSearch(e.target.value);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to remove this devotee record? This may affect historical bookings.')) {
            router.delete(route('devotees.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h2 className="font-black text-2xl text-slate-900 tracking-tight flex items-center gap-3">
                            Devotee Registry
                        </h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Sacred Membership & Patronage</p>
                    </div>
                    <Link
                        href={route('devotees.create')}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-xl shadow-orange-100 hover:scale-[1.02] active:scale-95"
                    >
                        <UserPlus size={18} /> New Enrollment
                    </Link>
                </div>
            }
        >
            <Head title="Devotee Registry" />

            <div className="space-y-8">

                {/* Search & Filter Bar */}
                <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="relative flex-1 group">
                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300 group-focus-within:text-orange-500 transition-colors">
                            <Search size={20} />
                        </div>
                        <input
                            type="text"
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-black text-slate-900 placeholder:text-slate-300 uppercase tracking-widest text-xs"
                            placeholder="SEARCH BY NAME, MOBILE, OR NAKSHATHRAM..."
                            value={search}
                            onChange={onSearchChange}
                        />
                    </div>
                </div>

                {/* Registry Table/Grid */}
                <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Profile Details</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Nakshathram</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Contact</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {devotees.data.length > 0 ? (
                                devotees.data.map((devotee) => (
                                    <tr key={devotee.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-orange-100 group-hover:text-orange-600 transition-all font-black text-sm uppercase">
                                                    {devotee.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-black text-slate-900 uppercase tracking-tight leading-tight group-hover:text-orange-600 transition-colors">{devotee.name}</div>
                                                    <div className="font-malayalam text-orange-600 font-bold text-sm mt-0.5">{devotee.name_ml}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-2 text-xs font-black text-slate-600 uppercase tracking-widest">
                                                <Star size={14} className="text-orange-500" />
                                                {devotee.star || '---'}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-2 text-xs font-black text-slate-600 uppercase tracking-widest">
                                                <Phone size={14} className="text-slate-300" />
                                                {devotee.phone}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={route('devotees.edit', devotee.id)}
                                                    className="p-3 bg-white text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all border border-slate-100 hover:border-orange-100 shadow-sm"
                                                >
                                                    <Edit2 size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(devotee.id)}
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
                                            <p className="text-xs font-black uppercase tracking-[0.3em]">No registry matching your search</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Simple Pagination Footer */}
                <div className="flex justify-center gap-2 pb-12">
                    {devotees.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${link.active
                                    ? 'bg-slate-900 text-white shadow-xl'
                                    : 'bg-white text-slate-400 hover:text-slate-900 border border-slate-100'
                                } ${!link.url ? 'opacity-30 pointer-events-none' : ''}`}
                        />
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
