import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    ShoppingCart,
    Plus,
    Search,
    Trash2,
    Calendar,
    User,
    Hash,
    Banknote,
    ArrowRight,
    SearchX,
    FileText,
    History,
    CheckCircle2
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface PurchaseItem {
    id: number;
    inventory_item_id: number;
    inventory_item: { name: string; unit: string };
    quantity: number;
    unit_price: number;
    total_price: number;
}

interface Purchase {
    id: number;
    vendor_name: string | null;
    bill_number: string | null;
    bill_date: string;
    total_amount: string;
    payment_mode: string;
    account: { name: string };
    expense_account: { name: string };
    items: PurchaseItem[];
    created_at: string;
}

interface Props extends PageProps {
    purchases: {
        data: Purchase[];
        links: any[];
    };
    inventory_items: { id: number; name: string; unit: string }[];
    accounts: { id: number; name: string }[];
}

export default function Index({ auth, purchases, inventory_items, accounts }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const { data, setData, post, processing, reset, errors } = useForm({
        vendor_name: '',
        bill_number: '',
        bill_date: new Date().toISOString().split('T')[0],
        payment_mode: 'Cash',
        account_id: accounts[0]?.id || '',
        expense_account_id: accounts.find(a => a.name.toLowerCase().includes('expense'))?.id || accounts[0]?.id || '',
        remarks: '',
        items: [{ inventory_item_id: '', quantity: '', unit_price: '' }]
    });

    const addItem = () => {
        setData('items', [...data.items, { inventory_item_id: '', quantity: '', unit_price: '' }]);
    };

    const removeItem = (index: number) => {
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setData('items', newItems);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('purchases.store'), {
            onSuccess: () => {
                setShowModal(false);
                reset();
            }
        });
    };

    const totalBillAmount = data.items.reduce((sum, item) => {
        return sum + (Number(item.quantity) * Number(item.unit_price) || 0);
    }, 0);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h2 className="font-black text-2xl text-slate-900 tracking-tight flex items-center gap-3">
                            Procurement & Purchase Hub
                        </h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Stock Procurement & Financial Payouts</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-slate-900 hover:bg-orange-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-xl shadow-slate-200 active:scale-95"
                    >
                        <Plus size={18} /> Record New Purchase
                    </button>
                </div>
            }
        >
            <Head title="Purchases" />

            <div className="space-y-8">
                {/* Search & Filters */}
                <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="relative flex-1 group">
                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300 group-focus-within:text-orange-500 transition-colors">
                            <Search size={20} />
                        </div>
                        <input
                            type="text"
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-orange-500/10 transition-all font-black text-slate-900 placeholder:text-slate-300 uppercase tracking-widest text-xs"
                            placeholder="SEARCH BY VENDOR OR BILL NUMBER..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Purchase History Table */}
                <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                            <History size={14} className="text-orange-500" /> Historical Procurement Stream
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Bill Date & ID</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Vendor & Reference</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Items</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Accounting Head</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Total Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {purchases.data.length > 0 ? (
                                    purchases.data.map(purchase => (
                                        <tr key={purchase.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex flex-col items-center justify-center text-slate-500 border border-slate-200">
                                                        <span className="text-[8px] font-black uppercase tracking-tighter leading-none opacity-50 mb-0.5">{new Date(purchase.bill_date).toLocaleString('default', { month: 'short' })}</span>
                                                        <span className="text-sm font-black tracking-tight leading-none">{new Date(purchase.bill_date).getDate()}</span>
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-slate-900 uppercase tracking-tight">#{purchase.id}</div>
                                                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{new Date(purchase.bill_date).getFullYear()}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="font-black text-slate-900 uppercase tracking-tighter truncate max-w-[200px]">{purchase.vendor_name || 'Generic Vendor'}</div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest border px-1.5 py-0.5 rounded-md border-slate-200">{purchase.bill_number || 'ST-000'}</span>
                                                    <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-1.5 py-0.5 rounded-md">{purchase.payment_mode}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex -space-x-2">
                                                    {purchase.items.map((item, idx) => (
                                                        <div key={idx} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[8px] font-black text-slate-600 shadow-sm first:z-30 last:z-10" title={item.inventory_item.name}>
                                                            {item.inventory_item.name.charAt(0)}
                                                        </div>
                                                    ))}
                                                    {purchase.items.length > 3 && (
                                                        <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-[8px] font-black text-white z-0">
                                                            +{purchase.items.length - 3}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2">{purchase.items.length} LINE ITEMS</div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{purchase.expense_account.name}</div>
                                                <div className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-1 flex items-center gap-1.5 opacity-60">
                                                    VIA <ArrowRight size={8} className="text-slate-300" /> {purchase.account.name}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="text-lg font-black text-slate-900 tabular-nums uppercase tracking-tighter">₹ {parseFloat(purchase.total_amount).toLocaleString('en-IN')}</div>
                                                <div className="flex items-center justify-end gap-1 text-[8px] font-black text-emerald-600 uppercase tracking-widest mt-1 italic">
                                                    <CheckCircle2 size={10} /> Enshrined
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-24 text-center">
                                            <div className="flex flex-col items-center gap-4 text-slate-300">
                                                <SearchX size={64} strokeWidth={1} />
                                                <p className="text-xs font-black uppercase tracking-[0.3em]">No procurement entries registered</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Entry Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <form onSubmit={submit} className="bg-white rounded-[3.5rem] p-12 max-w-5xl w-full shadow-[0_40px_100px_rgba(0,0,0,0.2)] animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[90vh] custom-scrollbar">
                        <div className="flex justify-between items-start mb-12">
                            <div>
                                <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none flex items-center gap-4">
                                    <ShoppingCart className="text-orange-600" size={36} /> Procurement Registry
                                </h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3 italic">Record bulk stock admission & balance payout</p>
                            </div>
                            <button type="button" onClick={() => setShowModal(false)} className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-full text-slate-400 hover:text-red-500 transition-all font-black text-xl">✕</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                                    <User size={12} /> Vendor Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-2xl border-slate-100 bg-slate-50 p-5 font-black text-slate-900 uppercase tracking-tight focus:ring-4 focus:ring-orange-500/10 placeholder:text-slate-200"
                                    value={data.vendor_name}
                                    onChange={e => setData('vendor_name', e.target.value)}
                                    placeholder="E.G. LOCAL PROVISION STORE"
                                />
                                {errors.vendor_name && <p className="text-red-500 text-[10px] font-black uppercase mt-1">{errors.vendor_name}</p>}
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                                    <Hash size={12} /> Bill / Reference #
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-2xl border-slate-100 bg-slate-50 p-5 font-black text-slate-900 uppercase tracking-widest font-mono focus:ring-4 focus:ring-orange-500/10"
                                    value={data.bill_number}
                                    onChange={e => setData('bill_number', e.target.value)}
                                    placeholder="REF-000"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                                    <Calendar size={12} /> Billing Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full rounded-2xl border-slate-100 bg-slate-50 p-5 font-black text-slate-900 uppercase tracking-widest focus:ring-4 focus:ring-orange-500/10"
                                    value={data.bill_date}
                                    onChange={e => setData('bill_date', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Bill Items Section */}
                        <div className="mb-12">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Line Item Breakdown</h4>
                                <button type="button" onClick={addItem} className="text-orange-600 text-[10px] font-black uppercase tracking-widest hover:bg-orange-50 px-4 py-2 rounded-xl transition-all border border-orange-100 flex items-center gap-2">
                                    <Plus size={14} /> Split Line Item
                                </button>
                            </div>

                            <div className="space-y-4">
                                {data.items.map((item, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-slate-50 p-6 rounded-[2rem] border border-slate-100 group">
                                        <div className="md:col-span-5 space-y-4">
                                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">Commodity Registry</label>
                                            <select
                                                className="w-full rounded-xl border-slate-200 bg-white p-4 font-black text-slate-900 text-xs uppercase tracking-tight"
                                                value={item.inventory_item_id}
                                                onChange={e => updateItem(index, 'inventory_item_id', e.target.value)}
                                                required
                                            >
                                                <option value="">SELECT COMMODITY...</option>
                                                {inventory_items.map(ii => (
                                                    <option key={ii.id} value={ii.id}>{ii.name} ({ii.unit})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="md:col-span-2 space-y-4">
                                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">Quantity</label>
                                            <input
                                                type="number"
                                                step="any"
                                                className="w-full rounded-xl border-slate-200 bg-white p-4 font-black text-slate-900 text-xs tabular-nums"
                                                value={item.quantity}
                                                onChange={e => updateItem(index, 'quantity', e.target.value)}
                                                placeholder="0.00"
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-4">
                                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">Unit Price (₹)</label>
                                            <input
                                                type="number"
                                                step="any"
                                                className="w-full rounded-xl border-slate-200 bg-white p-4 font-black text-slate-900 text-xs tabular-nums"
                                                value={item.unit_price}
                                                onChange={e => updateItem(index, 'unit_price', e.target.value)}
                                                placeholder="0.00"
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-4">
                                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">Subtotal</label>
                                            <div className="p-4 bg-white/50 border border-slate-200 rounded-xl font-black text-slate-900 text-xs tabular-nums text-right">
                                                ₹ {(Number(item.quantity) * Number(item.unit_price) || 0).toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="md:col-span-1 flex justify-center pb-2">
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                disabled={data.items.length === 1}
                                                className="p-2 text-slate-300 hover:text-red-500 transition-colors disabled:opacity-0"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                            <div className="space-y-8">
                                <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Accounting Configuration</h4>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Fund Source</label>
                                        <select
                                            className="w-full rounded-2xl border-slate-100 bg-slate-50 p-5 font-black text-slate-900 text-xs uppercase"
                                            value={data.account_id}
                                            onChange={e => setData('account_id', e.target.value)}
                                        >
                                            {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Expense Head</label>
                                        <select
                                            className="w-full rounded-2xl border-slate-100 bg-slate-50 p-5 font-black text-slate-900 text-xs uppercase"
                                            value={data.expense_account_id}
                                            onChange={e => setData('expense_account_id', e.target.value)}
                                        >
                                            {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Payment Protocol</label>
                                        <div className="flex flex-wrap gap-4">
                                            {['Cash', 'Bank', 'Cheque'].map(mode => (
                                                <button
                                                    key={mode}
                                                    type="button"
                                                    onClick={() => setData('payment_mode', mode as any)}
                                                    className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${data.payment_mode === mode
                                                        ? 'bg-slate-900 text-white shadow-xl'
                                                        : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    {mode}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-orange-50/50 rounded-[3rem] p-10 border border-orange-100 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-3 text-orange-600 mb-2">
                                        <Banknote size={20} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Aggregate Bill Value</span>
                                    </div>
                                    <div className="text-6xl font-black text-orange-600 tracking-tighter tabular-nums">
                                        ₹ {totalBillAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </div>
                                </div>
                                <div className="space-y-4 mt-12">
                                    <label className="text-[10px] font-black text-orange-800/40 uppercase tracking-widest px-1">Internal Remarks</label>
                                    <textarea
                                        className="w-full rounded-2xl border-orange-100 bg-white p-5 font-bold text-xs text-orange-900 focus:ring-4 focus:ring-orange-500/10 transition-all"
                                        value={data.remarks}
                                        onChange={e => setData('remarks', e.target.value)}
                                        placeholder="Note down bill details or vendor contact..."
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-6 mt-12">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 bg-slate-900 hover:bg-orange-600 text-white font-black py-8 rounded-[2.5rem] shadow-2xl transition-all scale-100 hover:scale-[1.02] active:scale-95 disabled:opacity-50 uppercase tracking-[0.4em] text-xs flex items-center justify-center gap-4"
                            >
                                <ShoppingCart size={20} /> {processing ? 'COMMITING TRANSACTION...' : 'ENACT PURCHASE & SYNC LEDGER'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E2E8F0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #CBD5E1;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
