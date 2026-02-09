import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    Plus,
    FileText,
    Search,
    IndianRupee,
    Filter,
    ChevronRight,
    ArrowUpCircle,
    ArrowDownCircle,
    Sparkles,
    Calendar,
    Receipt
} from 'lucide-react';
import ExportToolbar from '@/Components/ExportToolbar';
import { useState } from 'react';

interface Transaction {
    id: number;
    date: string;
    type: 'Credit' | 'Debit';
    category: string;
    description: string;
    amount: string;
    payment_mode: string;
}

interface Summary {
    income: number;
    expense: number;
    balance: number;
}

export default function Index({ auth, transactions, summary }: PageProps & { transactions: { data: Transaction[], links: any[] }, summary: Summary }) {
    const { data, setData, post, processing, reset } = useForm({
        date: new Date().toISOString().split('T')[0],
        type: 'Credit',
        category: 'Donation',
        description: '',
        amount: '',
        payment_mode: 'Cash',
    });

    const [showModal, setShowModal] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // @ts-ignore
        post(route('ledgers.store'), {
            onSuccess: () => { setShowModal(false); reset(); }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h2 className="font-black text-2xl text-slate-900 tracking-tight flex items-center gap-3">
                            Daily Cash Book
                        </h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Vazhipadu & Operational Ledger</p>
                    </div>
                    <div className="flex gap-4">
                        <ExportToolbar reportName="ledger" />
                        <Link
                            href={route('ledgers.report')}
                            className="bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
                        >
                            <FileText size={16} /> Audit Reports
                        </Link>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-xl shadow-orange-100 hover:scale-[1.02] active:scale-95"
                        >
                            <Plus size={18} /> Record Transaction
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Financial Ledger" />

            <div className="space-y-12">

                {/* Financial Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-1 h-full bg-emerald-500" />
                        <div className="flex gap-4 items-center mb-4">
                            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                                <TrendingUp size={24} />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Credit</p>
                        </div>
                        <p className="text-4xl font-black text-slate-900 tabular-nums">
                            <span className="text-emerald-500 text-xl mr-1">₹</span>{summary.income.toLocaleString('en-IN')}
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-1 h-full bg-red-500" />
                        <div className="flex gap-4 items-center mb-4">
                            <div className="p-3 bg-red-50 rounded-xl text-red-500">
                                <TrendingDown size={24} />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Debit</p>
                        </div>
                        <p className="text-4xl font-black text-slate-900 tabular-nums">
                            <span className="text-red-500 text-xl mr-1">₹</span>{summary.expense.toLocaleString('en-IN')}
                        </p>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group md:col-span-2">
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all duration-700" />
                        <div className="relative z-10 flex justify-between items-center h-full">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Certified Net Balance</p>
                                <p className="text-5xl font-black text-white tabular-nums tracking-tighter">
                                    <span className="text-orange-600 mr-2">₹</span>{summary.balance.toLocaleString('en-IN')}
                                </p>
                            </div>
                            <div className="p-6 bg-white/5 rounded-3xl border border-white/5 text-orange-500">
                                <Wallet size={48} strokeWidth={1} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ledger Table */}
                <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                        <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-2">
                            <Receipt size={14} className="text-orange-500" /> Audit Trail Entries
                        </h3>
                        <div className="flex gap-2">
                            <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                                <Filter size={18} />
                            </button>
                        </div>
                    </div>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Date & Reference</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Classification</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Flow State</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Quantum</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Channel</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {transactions.data.map(tx => (
                                <tr key={tx.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:bg-white group-hover:text-orange-500 transition-all font-black text-xs">
                                                {tx.id}
                                            </div>
                                            <div>
                                                <div className="font-black text-slate-900 uppercase tracking-tight leading-tight group-hover:text-orange-600 transition-colors">{tx.date}</div>
                                                <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-0.5">REF: {tx.id.toString().padStart(6, '0')}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="font-black text-slate-900 uppercase text-[10px] tracking-widest">{tx.category}</div>
                                        <div className="text-[10px] text-slate-400 font-bold italic line-clamp-1 mt-1 max-w-xs">{tx.description}</div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${tx.type === 'Credit'
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-100'
                                            : 'bg-red-50 text-red-500 border-red-100 group-hover:bg-red-100'
                                            }`}>
                                            {tx.type === 'Credit' ? <ArrowUpCircle size={12} /> : <ArrowDownCircle size={12} />}
                                            {tx.type === 'Credit' ? 'Inflow' : 'Outflow'}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className={`text-xl font-black tabular-nums transition-transform group-hover:translate-x-1 ${tx.type === 'Credit' ? 'text-emerald-600' : 'text-red-500'}`}>
                                            <span className="text-sm mr-1">₹</span>{parseFloat(tx.amount).toLocaleString('en-IN')}
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg group-hover:bg-white border border-transparent group-hover:border-slate-100 transition-all inline-block">{tx.payment_mode}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="flex justify-center gap-2 pb-12">
                    {transactions.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${link.active
                                ? 'bg-slate-900 text-white shadow-xl px-6'
                                : 'bg-white text-slate-400 hover:text-slate-900 border border-slate-100'
                                } ${!link.url ? 'opacity-30 pointer-events-none' : ''}`}
                        />
                    ))}
                </div>
            </div>

            {/* Transaction Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <form onSubmit={submit} className="bg-white rounded-[3rem] p-12 max-w-2xl w-full shadow-[0_40px_100px_rgba(0,0,0,0.2)] animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Record Fiscal Event</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 italic">Official Cash Book Ledger Entry</p>
                            </div>
                            <button type="button" onClick={() => setShowModal(false)} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full text-slate-400 hover:text-red-500 transition-all font-black">✕</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Entry Date</label>
                                <div className="relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">
                                        <Calendar size={18} />
                                    </div>
                                    <input
                                        type="date"
                                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border-slate-100 rounded-2xl font-black text-slate-900 focus:ring-4 focus:ring-orange-500/10"
                                        value={data.date}
                                        onChange={e => setData('date', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Cash Flow Direction</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setData('type', 'Credit')}
                                        className={`py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${data.type === 'Credit' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100' : 'bg-slate-50 text-slate-400'}`}
                                    >
                                        Inflow (+)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setData('type', 'Debit')}
                                        className={`py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${data.type === 'Debit' ? 'bg-red-500 text-white shadow-xl shadow-red-100' : 'bg-slate-50 text-slate-400'}`}
                                    >
                                        Outflow (-)
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Fiscal Quantum (₹)</label>
                                <div className="relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-500 font-black text-2xl">₹</div>
                                    <input
                                        type="number"
                                        className="w-full pl-14 pr-6 py-8 bg-slate-50 border-slate-100 rounded-3xl font-black text-5xl tabular-nums text-slate-900 focus:ring-8 focus:ring-orange-500/10"
                                        value={data.amount}
                                        onChange={e => setData('amount', e.target.value)}
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Classification Category</label>
                                <input
                                    type="text"
                                    className="w-full rounded-2xl border-slate-100 bg-slate-50 p-5 font-black text-slate-900 uppercase tracking-widest text-xs focus:ring-4 focus:ring-orange-500/10"
                                    value={data.category}
                                    onChange={e => setData('category', e.target.value)}
                                    placeholder="E.G. POOJA, SALARY, ELECTRICITY"
                                    required
                                />
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {['Donation', 'Vazhipadu', 'Salary', 'Store', 'Utility', 'Maintenance'].map(cat => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => setData('category', cat)}
                                            className="px-3 py-1.5 bg-slate-50 hover:bg-orange-50 rounded-lg text-[8px] font-black uppercase tracking-widest text-slate-400 hover:text-orange-500 transition-all border border-slate-100"
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 md:col-span-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Entry Narrative</label>
                                <textarea
                                    className="w-full rounded-3xl border-slate-100 bg-slate-50 p-6 font-bold text-xs text-slate-900 focus:ring-4 focus:ring-orange-500/10"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    placeholder="Detailed description of the transaction flow..."
                                    rows={3}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mt-12">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-slate-900 hover:bg-orange-600 text-white font-black py-6 rounded-3xl shadow-2xl transition-all scale-100 hover:scale-[1.02] active:scale-95 disabled:opacity-50 uppercase tracking-[0.3em] text-[10px]"
                            >
                                {processing ? 'VALIDATING ENTRY...' : 'AUTHORIZE & ENSHRINE ENTRY'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
