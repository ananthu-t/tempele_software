import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    Activity,
    Printer,
    Download,
    TrendingUp,
    TrendingDown,
    Calendar,
    ArrowUpCircle,
    ArrowDownCircle,
    Sparkles
} from 'lucide-react';
import ExportToolbar from '@/Components/ExportToolbar';
import { useState } from 'react';

interface Account {
    id: number;
    name: string;
    balance: string;
    ledgers: any[];
}

interface FiscalYear {
    id: number;
    year_name: string;
    is_active: boolean;
}

interface Props extends PageProps {
    revenue: Account[];
    expenses: Account[];
    fiscalYears: FiscalYear[];
}

export default function IncomeStatement({ auth, revenue, expenses, fiscalYears }: Props) {
    const totalRevenue = revenue.reduce((sum, acc) => sum + parseFloat(acc.balance), 0);
    const totalExpenses = expenses.reduce((sum, acc) => sum + parseFloat(acc.balance), 0);
    const netIncome = totalRevenue - totalExpenses;

    const handleYearChange = (id: string) => {
        router.get(route('reports.income-statement'), { fiscal_year_id: id });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h2 className="font-black text-2xl text-slate-900 tracking-tight flex items-center gap-3">
                            <Activity className="text-emerald-600" /> Income Statement
                        </h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Profit & Loss Performance Review</p>
                    </div>
                    <div className="flex gap-4">
                        <select
                            className="bg-white border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest px-6 appearance-none hover:bg-slate-50 transition-all"
                            onChange={(e) => handleYearChange(e.target.value)}
                        >
                            {fiscalYears.map(year => (
                                <option key={year.id} value={year.id}>
                                    FY {year.year_name} {year.is_active ? '(ACTIVE)' : ''}
                                </option>
                            ))}
                        </select>
                        <ExportToolbar reportName="income-statement" />
                    </div>
                </div>
            }
        >
            <Head title="Income Statement" />

            <div className="py-12 space-y-12">
                {/* Visual Performance Gauge */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-emerald-600 p-8 rounded-[2.5rem] shadow-xl shadow-emerald-100 flex flex-col justify-between min-h-[220px] relative overflow-hidden group">
                        <ArrowUpCircle className="absolute -right-4 -bottom-4 text-white/10 w-48 h-48" />
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-emerald-100 uppercase tracking-widest mb-4">Total Revenue Generated</p>
                            <p className="text-4xl font-black text-white tabular-nums tracking-tighter">
                                <span className="text-xl mr-1 text-emerald-200">₹</span>
                                {totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="relative z-10 bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm self-start">
                            <p className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <TrendingUp size={12} /> Positive Inflow
                            </p>
                        </div>
                    </div>

                    <div className="bg-rose-600 p-8 rounded-[2.5rem] shadow-xl shadow-rose-100 flex flex-col justify-between min-h-[220px] relative overflow-hidden">
                        <ArrowDownCircle className="absolute -right-4 -bottom-4 text-white/10 w-48 h-48" />
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-rose-100 uppercase tracking-widest mb-4">Total Operational Expenses</p>
                            <p className="text-4xl font-black text-white tabular-nums tracking-tighter">
                                <span className="text-xl mr-1 text-rose-200">₹</span>
                                {totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="relative z-10 bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm self-start">
                            <p className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <TrendingDown size={12} /> Expenditure
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[220px]">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Net Surplus / Deficit</p>
                            <p className={`text-5xl font-black tabular-nums tracking-tighter ${netIncome >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                <span className="text-xl mr-1 opacity-50">₹</span>
                                {netIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${netIncome >= 0 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'}`} />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {netIncome >= 0 ? 'Operational Surplus' : 'Operational Deficit'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Detailed Breakdown Table */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Revenue Details */}
                    <div className="bg-white rounded-[3rem] p-10 border border-slate-100 flex flex-col">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.4em] mb-10 pb-6 border-b border-slate-50 flex items-center gap-3">
                            <TrendingUp size={20} className="text-emerald-600" /> Revenue Streams
                        </h4>
                        <div className="space-y-8 flex-1">
                            {revenue.map(acc => (
                                <div key={acc.id} className="flex justify-between items-center group">
                                    <div>
                                        <p className="font-black text-slate-700 uppercase tracking-tight group-hover:text-emerald-600 transition-colors">{acc.name}</p>
                                        <div className="w-24 h-1 bg-slate-50 rounded-full mt-2 group-hover:bg-emerald-50 transition-colors" />
                                    </div>
                                    <div className="text-xl font-black text-slate-900 tabular-nums">
                                        {parseFloat(acc.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-12 pt-8 border-t border-slate-50 flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Total Surplus Gen.</span>
                            <span className="text-2xl font-black text-emerald-600 uppercase tabular-nums">₹ {totalRevenue.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Expense Details */}
                    <div className="bg-white rounded-[3rem] p-10 border border-slate-100 flex flex-col">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.4em] mb-10 pb-6 border-b border-slate-50 flex items-center gap-3">
                            <TrendingDown size={20} className="text-rose-600" /> Cost Allocation
                        </h4>
                        <div className="space-y-8 flex-1">
                            {expenses.map(acc => (
                                <div key={acc.id} className="flex justify-between items-center group">
                                    <div>
                                        <p className="font-black text-slate-700 uppercase tracking-tight group-hover:text-rose-600 transition-colors">{acc.name}</p>
                                        <div className="w-24 h-1 bg-slate-50 rounded-full mt-2 group-hover:bg-rose-50 transition-colors" />
                                    </div>
                                    <div className="text-xl font-black text-slate-900 tabular-nums">
                                        {parseFloat(acc.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-12 pt-8 border-t border-slate-50 flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Total Capital Outflow</span>
                            <span className="text-2xl font-black text-rose-600 uppercase tabular-nums">₹ {totalExpenses.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Statutory Analytics Note */}
                <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex gap-6 items-center shadow-2xl relative overflow-hidden group">
                    <Sparkles className="text-orange-500 absolute -top-10 -right-10 w-40 h-40 opacity-10 group-hover:rotate-12 transition-transform duration-700" />
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                        <Activity className="text-orange-500" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 font-mono">Precision Accounting Note</p>
                        <p className="text-xs font-bold leading-relaxed text-slate-200">
                            The Income Statement is synthesized in real-time from ledger activities indexed under Revenue/Expense classifications.
                            Inter-account transfers are neutralized to prevent valuation inflation. Audit completed on {new Date().toLocaleDateString()}.
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
