import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    Scale,
    Printer,
    Download,
    Search,
    ChevronRight,
    ArrowRightLeft,
    TrendingUp,
    TrendingDown
} from 'lucide-react';
import ExportToolbar from '@/Components/ExportToolbar';
import { useState } from 'react';

interface Account {
    id: number;
    name: string;
    type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
    balance: string;
    parent?: { name: string };
}

interface Props extends PageProps {
    accounts: Account[];
}

export default function TrialBalance({ auth, accounts }: Props) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAccounts = accounts.filter(acc =>
        acc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalDebit = accounts.filter(a => ['Asset', 'Expense'].includes(a.type))
        .reduce((sum, a) => sum + parseFloat(a.balance), 0);

    const totalCredit = accounts.filter(a => ['Liability', 'Equity', 'Revenue'].includes(a.type))
        .reduce((sum, a) => sum + parseFloat(a.balance), 0);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h2 className="font-black text-2xl text-slate-900 tracking-tight flex items-center gap-3">
                            <Scale className="text-orange-600" /> Trial Balance
                        </h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Financial Equilibrium Report</p>
                    </div>
                    <div className="flex gap-4">
                        <ExportToolbar reportName="trial-balance" />
                    </div>
                </div>
            }
        >
            <Head title="Trial Balance" />

            <div className="py-12 space-y-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group overflow-hidden relative">
                        <div className="absolute -right-4 -bottom-4 text-emerald-50 opacity-50 group-hover:scale-110 transition-transform duration-500">
                            <TrendingUp size={120} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Debit Side</p>
                            <p className="text-4xl font-black text-slate-900 tabular-nums">
                                <span className="text-emerald-500 text-xl mr-1">₹</span>
                                {totalDebit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                            <ArrowRightLeft size={32} />
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group overflow-hidden relative">
                        <div className="absolute -right-4 -bottom-4 text-orange-50 opacity-50 group-hover:scale-110 transition-transform duration-500">
                            <TrendingDown size={120} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Credit Side</p>
                            <p className="text-4xl font-black text-slate-900 tabular-nums">
                                <span className="text-orange-500 text-xl mr-1">₹</span>
                                {totalCredit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                            <ArrowRightLeft size={32} style={{ transform: 'rotate(180deg)' }} />
                        </div>
                    </div>
                </div>

                {/* Account List */}
                <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
                    <div className="p-8 border-b border-slate-50">
                        <div className="relative group max-w-md">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={20} />
                            <input
                                type="text"
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-orange-500/10 transition-all font-black text-slate-900 placeholder:text-slate-300 uppercase tracking-widest text-xs"
                                placeholder="Search accounts..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Account Head</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Classification</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Debit (₹)</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Credit (₹)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredAccounts.map(account => {
                                const isDebitSide = ['Asset', 'Expense'].includes(account.type);
                                return (
                                    <tr key={account.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-10 py-6">
                                            <div className="font-black text-slate-900 tracking-tight uppercase group-hover:text-orange-600 transition-colors">
                                                {account.name}
                                            </div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">
                                                {account.parent?.name || 'Top Level Head'}
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border ${account.type === 'Asset' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                account.type === 'Liability' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                                    account.type === 'Equity' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                        account.type === 'Revenue' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                            'bg-rose-50 text-rose-600 border-rose-100'
                                                }`}>
                                                {account.type}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6 text-right font-black tabular-nums">
                                            {isDebitSide ? (
                                                <span className="text-slate-900">
                                                    {parseFloat(account.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                </span>
                                            ) : '---'}
                                        </td>
                                        <td className="px-10 py-6 text-right font-black tabular-nums">
                                            {!isDebitSide ? (
                                                <span className="text-slate-900">
                                                    {parseFloat(account.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                </span>
                                            ) : '---'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot>
                            <tr className="bg-slate-900 text-white">
                                <td colSpan={2} className="px-10 py-8 text-xs font-black uppercase tracking-[0.4em]">Total Balance Confirmation</td>
                                <td className="px-10 py-8 text-right text-xl font-black tabular-nums border-l border-white/10">
                                    <span className="text-orange-500 text-sm mr-1">₹</span>
                                    {totalDebit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-10 py-8 text-right text-xl font-black tabular-nums border-l border-white/10">
                                    <span className="text-orange-500 text-sm mr-1">₹</span>
                                    {totalCredit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </td>
                            </tr>
                        </tfoot>
                    </table>

                    {totalDebit !== totalCredit && (
                        <div className="bg-red-600 text-white p-4 text-center font-black text-[10px] uppercase tracking-widest animate-pulse">
                            ⚠️ System Warning: Trial Balance is out of equilibrium. Please check audit logs for manual entries.
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
