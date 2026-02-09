import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    Plus,
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    Landmark,
    PieChart,
    TrendingUp,
    ChevronDown,
    MoreHorizontal,
    PlusCircle
} from 'lucide-react';
import { useState } from 'react';

interface Account {
    id: number;
    parent_id: number | null;
    code: string;
    name: string;
    name_ml: string | null;
    type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
    balance: string;
    parent?: Account;
}

interface Props extends PageProps {
    accounts: Account[];
    parentAccounts: Account[];
}

export default function Index({ auth, accounts, parentAccounts }: Props) {
    const [showModal, setShowModal] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        parent_id: '',
        code: '',
        name: '',
        name_ml: '',
        type: 'Revenue',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // @ts-ignore
        post(route('accounts.store'), {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Asset': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Liability': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'Equity': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            case 'Revenue': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Expense': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h2 className="font-black text-2xl text-slate-900 tracking-tight flex items-center gap-3">
                            Chart of Accounts
                        </h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Temple Financial Structure</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-xl shadow-orange-100 hover:scale-[1.02] active:scale-95"
                    >
                        <PlusCircle size={18} /> New Account
                    </button>
                </div>
            }
        >
            <Head title="Accounts Management" />

            <div className="py-12 space-y-8">
                {/* Statistics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Assets', value: '₹ 2,45,000', icon: <Landmark />, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Revenue YTD', value: '₹ 1,12,000', icon: <TrendingUp />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'Active Heads', value: accounts.length, icon: <Wallet />, color: 'text-orange-600', bg: 'bg-orange-50' },
                        { label: 'Reports', value: 'Trial Balance', icon: <PieChart />, color: 'text-purple-600', bg: 'bg-purple-50' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-lg font-black text-slate-900 tracking-tight">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Accounts Table */}
                <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Code & Name</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Type</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Parent Account</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Balance (₹)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {accounts.map((account) => (
                                <tr key={account.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-white transition-colors uppercase font-black text-[10px]">
                                                {account.code.substring(0, 2)}
                                            </div>
                                            <div>
                                                <div className="font-black text-slate-900 tracking-tight flex items-center gap-2">
                                                    {account.name}
                                                    <span className="text-[10px] text-slate-300 font-mono tracking-widest">{account.code}</span>
                                                </div>
                                                <div className="font-malayalam text-orange-600 text-xs font-bold">{account.name_ml}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full border ${getTypeColor(account.type)}`}>
                                            {account.type}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            {account.parent?.name || '---'}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="text-lg font-black text-slate-900 tabular-nums">
                                            <span className="text-slate-300 text-xs mr-1">₹</span>
                                            {parseFloat(account.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                            <div>
                                <h3 className="font-black text-xl text-slate-900 tracking-tight">Create New Account</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Register new ledger head in financial structure</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 p-2 uppercase text-[10px] font-black tracking-widest">Close</button>
                        </div>

                        <form onSubmit={submit} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-1">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Account Code</label>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-orange-500/10 font-black text-slate-900 text-sm placeholder:text-slate-300"
                                        placeholder="e.g. REV001"
                                        value={data.code}
                                        onChange={e => setData('code', e.target.value)}
                                    />
                                    {errors.code && <p className="mt-1 text-xs text-red-500 font-bold">{errors.code}</p>}
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Account Type</label>
                                    <select
                                        className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-orange-500/10 font-black text-slate-900 text-sm"
                                        value={data.type}
                                        onChange={e => setData('type', e.target.value as any)}
                                    >
                                        <option value="Asset">Asset</option>
                                        <option value="Liability">Liability</option>
                                        <option value="Equity">Equity</option>
                                        <option value="Revenue">Revenue</option>
                                        <option value="Expense">Expense</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Account Name (English)</label>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-orange-500/10 font-black text-slate-900 text-sm"
                                        placeholder="Enter account name..."
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 font-malayalam">Account Name (Malayalam)</label>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-orange-500/10 font-bold text-slate-900 text-sm font-malayalam"
                                        placeholder="മലയാളത്തിലുള്ള പേര്..."
                                        value={data.name_ml}
                                        onChange={e => setData('name_ml', e.target.value)}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Parent Account (Optional)</label>
                                    <select
                                        className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-orange-500/10 font-black text-slate-900 text-sm"
                                        value={data.parent_id}
                                        onChange={e => setData('parent_id', e.target.value)}
                                    >
                                        <option value="">None (Top Level)</option>
                                        {parentAccounts.map(parent => (
                                            <option key={parent.id} value={parent.id}>{parent.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 disabled:opacity-50 mt-4"
                            >
                                Register Financial Account
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
