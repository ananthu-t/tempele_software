import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    FileText,
    ArrowLeft,
    Printer,
    Search,
    Download,
    TrendingUp,
    TrendingDown,
    ChevronLeft,
    Sparkles,
    Calendar,
    Receipt
} from 'lucide-react';

interface Transaction {
    id: number;
    date: string;
    type: 'Credit' | 'Debit';
    category: string;
    description: string;
    amount: string;
    payment_mode: string;
}

export default function Report({ auth, report, filters }: PageProps & { report: Transaction[], filters: any }) {
    const { data, setData, get } = useForm({
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
    });

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        // @ts-ignore
        get(route('ledgers.report'));
    };

    const handlePrint = () => {
        window.print();
    };

    const totalIncome = report.filter(t => t.type === 'Credit').reduce((acc, t) => acc + parseFloat(t.amount), 0);
    const totalExpense = report.filter(t => t.type === 'Debit').reduce((acc, t) => acc + parseFloat(t.amount), 0);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('ledgers.index')}
                            className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-slate-900 rounded-2xl transition-all shadow-sm group"
                        >
                            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        </Link>
                        <div>
                            <h2 className="font-black text-2xl text-slate-900 tracking-tight flex items-center gap-3">
                                Financial Performance Report
                            </h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Certified Audit Statement Generation</p>
                        </div>
                    </div>
                    <div className="flex gap-4 print:hidden">
                        <button className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm group">
                            <Download size={16} className="group-hover:translate-y-0.5 transition-transform" /> Export Master CSV
                        </button>
                        <button
                            onClick={handlePrint}
                            className="bg-slate-900 hover:bg-orange-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-xl active:scale-95"
                        >
                            <Printer size={18} /> Generate Hardcopy
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Audit Statement" />

            <div className="space-y-12 pb-20">

                {/* Search & Filter - Hidden in Print */}
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 print:hidden">
                    <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Period Inception</label>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors">
                                    <Calendar size={18} />
                                </div>
                                <input
                                    type="date"
                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-orange-500/10 transition-all font-black text-slate-900"
                                    value={data.start_date}
                                    onChange={e => setData('start_date', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Period Conclusion</label>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors">
                                    <Calendar size={18} />
                                </div>
                                <input
                                    type="date"
                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-orange-500/10 transition-all font-black text-slate-900"
                                    value={data.end_date}
                                    onChange={e => setData('end_date', e.target.value)}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="bg-orange-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-orange-700 transition-all shadow-xl shadow-orange-100 flex items-center justify-center gap-3"
                        >
                            <Search size={16} /> Analysis Report
                        </button>
                    </form>
                </div>

                {/* Report Content */}
                <div className="bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden print:shadow-none print:border-none print:rounded-none">
                    <div className="p-16">
                        {/* Statement Header */}
                        <div className="text-center mb-16 border-b border-slate-50 pb-12 flex flex-col items-center">
                            <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-orange-500 mb-6 border-4 border-slate-100 print:bg-white print:text-black print:border-black">
                                <Receipt size={32} />
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 mb-3 uppercase tracking-tighter">Official Audit Statement</h1>
                            <div className="flex items-center gap-3 justify-center mb-4">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                                    Fiscal Frame: {filters.start_date || 'INITIAL'} — {filters.end_date || 'CURRENT'}
                                </span>
                            </div>
                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] italic">Generated by Temple ERP v2.0 - Sacred Digital Infrastructure</p>
                        </div>

                        {/* Statement Aggregates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
                            <div className="bg-emerald-50/30 rounded-[2.5rem] p-10 border border-emerald-100 flex justify-between items-center group">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-2">Total Fiscal Inflow</p>
                                    <p className="text-4xl font-black text-slate-900 tabular-nums">
                                        <span className="text-emerald-500 text-2xl mr-1">₹</span>{totalIncome.toLocaleString('en-IN')}
                                    </p>
                                </div>
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                    <TrendingUp size={28} />
                                </div>
                            </div>
                            <div className="bg-red-50/30 rounded-[2.5rem] p-10 border border-red-100 flex justify-between items-center group">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em] mb-2">Total Fiscal Outflow</p>
                                    <p className="text-4xl font-black text-slate-900 tabular-nums">
                                        <span className="text-red-500 text-2xl mr-1">₹</span>{totalExpense.toLocaleString('en-IN')}
                                    </p>
                                </div>
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                                    <TrendingDown size={28} />
                                </div>
                            </div>
                        </div>

                        {/* Transaction Matrix */}
                        <div className="overflow-x-auto min-w-full">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-t border-b border-slate-50">
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Timestamp</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Narrative</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Classification</th>
                                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] text-right">Inflow (+)</th>
                                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] text-right">Outflow (-)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {report.map(tx => (
                                        <tr key={tx.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-6 font-black text-slate-900 uppercase text-[10px] tabular-nums tracking-widest">{tx.date}</td>
                                            <td className="px-8 py-6">
                                                <div className="font-bold text-slate-900 text-xs leading-relaxed">{tx.description}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 px-3 py-1 bg-slate-50 rounded-lg group-hover:bg-white border border-transparent group-hover:border-slate-100 transition-all">{tx.category}</span>
                                            </td>
                                            <td className="px-10 py-6 text-right">
                                                {tx.type === 'Credit' ? (
                                                    <div className="font-black text-emerald-600 text-lg tabular-nums">
                                                        <span className="text-xs mr-1 opacity-50">₹</span>{parseFloat(tx.amount).toLocaleString('en-IN')}
                                                    </div>
                                                ) : <span className="text-slate-200">—</span>}
                                            </td>
                                            <td className="px-10 py-6 text-right">
                                                {tx.type === 'Debit' ? (
                                                    <div className="font-black text-red-500 text-lg tabular-nums">
                                                        <span className="text-xs mr-1 opacity-50">₹</span>{parseFloat(tx.amount).toLocaleString('en-IN')}
                                                    </div>
                                                ) : <span className="text-slate-200">—</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-slate-900 text-white rounded-[2rem] overflow-hidden shadow-2xl">
                                        <td colSpan={3} className="px-10 py-10 font-black uppercase tracking-[0.4em] text-xs">Certified Statement Net Balance</td>
                                        <td colSpan={2} className="px-10 py-10 text-right">
                                            <div className="flex flex-col items-end">
                                                <div className="text-5xl font-black tabular-nums tracking-tighter">
                                                    <span className="text-orange-500 text-2xl mr-2">₹</span>{(totalIncome - totalExpense).toLocaleString('en-IN')}
                                                </div>
                                                <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-2">Fiscal Integrity Guaranteed</div>
                                            </div>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {/* Statement Footer */}
                        <div className="mt-20 pt-12 border-t-2 border-dashed border-slate-100 grid grid-cols-2 gap-20">
                            <div className="space-y-4">
                                <div className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-10">Administrative Auths.</div>
                                <div className="w-48 h-1 bg-slate-100" />
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Secretary / Treasurer Signature</p>
                            </div>
                            <div className="text-right space-y-4">
                                <div className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-10">Official Temple Seal</div>
                                <div className="flex justify-end opacity-5">
                                    <Receipt size={80} />
                                </div>
                            </div>
                        </div>

                        <div className="mt-20 text-center">
                            <div className="inline-flex items-center gap-4 text-[9px] font-black text-slate-300 uppercase tracking-[0.5em] px-8 py-3 bg-slate-50 rounded-full border border-slate-100">
                                <Sparkles size={12} className="text-orange-500" /> End of Certified Fiscal Transcript <Sparkles size={12} className="text-orange-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    body { background: white !important; }
                    .print\\:shadow-none, .print\\:shadow-none * { visibility: visible; }
                    .print\\:shadow-none { position: absolute; left: 0; top: 0; width: 100%; border: none !important; }
                    .print\\:hidden { display: none !important; }
                    footer, header, nav, .sidebar { display: none !important; }
                    main { margin: 0 !important; padding: 0 !important; }
                    .bg-slate-900 { border: 2px solid black !important; }
                    .text-white { color: black !important; }
                }
            `}} />
        </AuthenticatedLayout>
    );
}
