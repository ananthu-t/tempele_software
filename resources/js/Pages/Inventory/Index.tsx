import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    Package,
    AlertTriangle,
    ArrowUpCircle,
    ArrowDownCircle,
    Plus,
    History,
    Search,
    ChevronRight,
    SearchX,
    Sparkles,
    ClipboardList,
    Gauge
} from 'lucide-react';
import { useState } from 'react';

interface InventoryItem {
    id: number;
    name: string;
    sku: string;
    unit: string;
    min_stock_level: number;
    current_stock: number;
}

interface StockLog {
    id: number;
    item: { name: string };
    type: string;
    quantity: string;
    remarks: string;
    date: string;
}

export default function Index({ auth, items, recent_logs }: PageProps & { items: InventoryItem[], recent_logs: StockLog[] }) {
    const [search, setSearch] = useState('');

    const { data: addData, setData: setAddData, post: postAdd, processing: addProcessing, reset: resetAdd } = useForm({
        name: '',
        sku: '',
        unit: 'Kg',
        min_stock_level: '',
        current_stock: '',
    });

    const { data: stockData, setData: setStockData, post: postStock, processing: stockProcessing } = useForm({
        type: 'In',
        quantity: '',
        remarks: '',
    });

    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.sku.toLowerCase().includes(search.toLowerCase())
    );

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // @ts-ignore
        postAdd(route('inventory.store'), {
            onSuccess: () => { setShowAddModal(false); resetAdd(); }
        });
    };

    const handleStockSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedItem) return;
        // @ts-ignore
        postStock(route('inventory.update-stock', selectedItem.id), {
            onSuccess: () => setSelectedItem(null)
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h2 className="font-black text-2xl text-slate-900 tracking-tight flex items-center gap-3">
                            Store & Inventory Control
                        </h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Consumables & Puja Stock Management</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-xl shadow-orange-100 hover:scale-[1.02] active:scale-95"
                    >
                        <Plus size={18} /> Catalog New Item
                    </button>
                </div>
            }
        >
            <Head title="Inventory Management" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Main Stock Registry */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Search Bar */}
                    <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className="relative flex-1 group">
                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300 group-focus-within:text-orange-500 transition-colors">
                                <Search size={20} />
                            </div>
                            <input
                                type="text"
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-black text-slate-900 placeholder:text-slate-300 uppercase tracking-widest text-xs"
                                placeholder="SEARCH BY ITEM NAME OR SKU CODE..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Stock Table */}
                    <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                                <Gauge size={14} className="text-orange-500" /> Live Inventory Levels
                            </h3>
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                {filteredItems.length} Commodities Registered
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-50">
                                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Commodity Detail</th>
                                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">Available Stock</th>
                                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Status</th>
                                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredItems.length > 0 ? (
                                        filteredItems.map(item => (
                                            <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-orange-100 group-hover:text-orange-600 transition-all border border-slate-100">
                                                            <Package size={24} />
                                                        </div>
                                                        <div>
                                                            <div className="font-black text-slate-900 uppercase tracking-tight leading-tight group-hover:text-orange-600 transition-colors">{item.name}</div>
                                                            <div className="font-mono text-[10px] text-slate-400 uppercase tracking-widest mt-1">{item.sku}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8 text-center">
                                                    <div className="text-xl font-black text-slate-900 tabular-nums">
                                                        {item.current_stock} <span className="text-[10px] text-slate-400 uppercase tracking-widest">{item.unit}</span>
                                                    </div>
                                                    <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1 italic">THRESHOLD: {item.min_stock_level}</div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    {item.current_stock <= item.min_stock_level ? (
                                                        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-red-100 animate-pulse">
                                                            <AlertTriangle size={12} /> Critical Low
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                                                            Optimal Level
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-10 py-8 text-right">
                                                    <button
                                                        onClick={() => setSelectedItem(item)}
                                                        className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg active:scale-95 whitespace-nowrap"
                                                    >
                                                        Adjust Stock
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-10 py-24 text-center">
                                                <div className="flex flex-col items-center gap-4 text-slate-300">
                                                    <SearchX size={64} strokeWidth={1} />
                                                    <p className="text-xs font-black uppercase tracking-[0.3em]">No items found matching search</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Activity Feed Column */}
                <div className="space-y-8">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 relative overflow-hidden flex flex-col h-full min-h-[600px]">
                        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-2 mb-10 pb-6 border-b border-slate-50">
                            <History className="text-orange-500" size={16} /> Audit Stream
                        </h3>

                        <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            {recent_logs.length > 0 ? (
                                recent_logs.map(log => (
                                    <div key={log.id} className="group relative flex gap-6 items-start p-4 hover:bg-slate-50 rounded-2xl transition-all duration-300 border border-transparent hover:border-slate-100">
                                        <div className={`p-3 rounded-2xl flex-shrink-0 ${log.type === 'In' ? 'bg-emerald-50 text-emerald-600 shadow-sm' : 'bg-red-50 text-red-600 shadow-sm'}`}>
                                            {log.type === 'In' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <div className="font-black text-xs text-slate-900 uppercase tracking-tight group-hover:text-orange-600 transition-colors truncate pr-4">{log.item.name}</div>
                                                <div className={`text-[10px] font-black tabular-nums ${log.type === 'In' ? 'text-emerald-600' : 'text-red-600'}`}>
                                                    {log.type === 'In' ? '+' : '-'}{log.quantity}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-[8px] text-slate-400 font-black uppercase tracking-widest italic">{log.date}</div>
                                            <div className="text-[9px] text-slate-500 mt-2 font-bold leading-relaxed">{log.remarks || 'Routine adjustment recorded by system.'}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <ClipboardList size={48} className="mx-auto text-slate-100 mb-4" />
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Silence in the Stream</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-10 pt-8 border-t border-slate-50">
                            <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100 flex gap-4">
                                <Sparkles size={20} className="text-orange-600 shrink-0" />
                                <p className="text-[9px] font-black text-orange-800/60 uppercase tracking-widest leading-relaxed italic">
                                    Inventory audits ensure transparency in store procurement and distribution protocols.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {selectedItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <form onSubmit={handleStockSubmit} className="bg-white rounded-[3rem] p-12 max-w-md w-full shadow-[0_40px_100px_rgba(0,0,0,0.2)] animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Stock Adjustment</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 italic">{selectedItem.name}</p>
                            </div>
                            <button type="button" onClick={() => setSelectedItem(null)} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full text-slate-400 hover:text-red-500 transition-all font-black">✕</button>
                        </div>

                        <div className="space-y-8">
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setStockData('type', 'In')}
                                    className={`py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${stockData.type === 'In' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100 scale-100' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 active:scale-95'}`}
                                >
                                    Stock Admission
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStockData('type', 'Out')}
                                    className={`py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${stockData.type === 'Out' ? 'bg-red-500 text-white shadow-xl shadow-red-100 scale-100' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 active:scale-95'}`}
                                >
                                    Stock Release
                                </button>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Quantity Details ({selectedItem.unit})</label>
                                <input
                                    type="number"
                                    className="w-full rounded-2xl border-slate-100 bg-slate-50 p-6 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-black text-3xl tabular-nums text-slate-900"
                                    value={stockData.quantity}
                                    onChange={e => setStockData('quantity', e.target.value)}
                                    placeholder="0"
                                    required
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Internal Note</label>
                                <textarea
                                    className="w-full rounded-2xl border-slate-100 bg-slate-50 p-5 font-bold text-xs focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-slate-900"
                                    value={stockData.remarks}
                                    onChange={e => setStockData('remarks', e.target.value)}
                                    placeholder="State the reason for this adjustment..."
                                    rows={3}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={stockProcessing}
                                className="w-full bg-slate-900 hover:bg-orange-600 text-white font-black py-6 rounded-3xl shadow-2xl transition-all scale-100 hover:scale-[1.02] active:scale-95 disabled:opacity-50 uppercase tracking-[0.3em] text-[10px]"
                            >
                                {stockProcessing ? 'PROVISIONING...' : 'ENACT ADJUSTMENT'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <form onSubmit={handleAddSubmit} className="bg-white rounded-[3rem] p-12 max-w-2xl w-full shadow-[0_40px_100px_rgba(0,0,0,0.2)] animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Catalog New Commodity</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 italic">Official Store Registry Entry</p>
                            </div>
                            <button type="button" onClick={() => setShowAddModal(false)} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full text-slate-400 hover:text-red-500 transition-all font-black">✕</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Item Title</label>
                                <input
                                    type="text"
                                    className="w-full rounded-2xl border-slate-100 bg-slate-50 p-5 font-black text-slate-900 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all placeholder:text-slate-300 uppercase tracking-tight"
                                    value={addData.name}
                                    onChange={e => setAddData('name', e.target.value)}
                                    placeholder="E.G. PURE GHEE"
                                    required
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">SKU / Code</label>
                                <input
                                    type="text"
                                    className="w-full rounded-2xl border-slate-100 bg-slate-50 p-5 font-black text-slate-900 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all placeholder:text-slate-300 uppercase tracking-widest font-mono"
                                    value={addData.sku}
                                    onChange={e => setAddData('sku', e.target.value)}
                                    placeholder="GH-001"
                                    required
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Measurement Unit</label>
                                <select
                                    className="w-full rounded-2xl border-slate-100 bg-slate-50 p-5 font-black text-slate-900 text-xs focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all cursor-pointer uppercase tracking-widest"
                                    value={addData.unit}
                                    onChange={e => setAddData('unit', e.target.value)}
                                >
                                    <option value="Kg">Kilogram (Kg)</option>
                                    <option value="Ltr">Litre (Ltr)</option>
                                    <option value="Nos">Numbers (Nos)</option>
                                    <option value="Pkt">Packets (Pkt)</option>
                                    <option value="Bdl">Bundles (Bdl)</option>
                                </select>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Min. Threshold</label>
                                <input
                                    type="number"
                                    className="w-full rounded-2xl border-slate-100 bg-slate-50 p-5 font-black text-slate-900 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all tabular-nums"
                                    value={addData.min_stock_level}
                                    onChange={e => setAddData('min_stock_level', e.target.value)}
                                    placeholder="0"
                                    required
                                />
                            </div>
                            <div className="space-y-4 md:col-span-2">
                                <label className="text-[20px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 text-center block w-full mb-4">Initial Stock Count</label>
                                <input
                                    type="number"
                                    className="w-full rounded-3xl border-slate-100 bg-orange-50 p-8 focus:ring-8 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-black text-5xl text-center tabular-nums text-orange-600"
                                    value={addData.current_stock}
                                    onChange={e => setAddData('current_stock', e.target.value)}
                                    placeholder="0"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mt-12 flex gap-4">
                            <button
                                type="submit"
                                disabled={addProcessing}
                                className="flex-1 bg-slate-900 text-white font-black py-6 rounded-3xl shadow-2xl transition-all scale-100 hover:scale-[1.02] active:scale-95 disabled:opacity-50 uppercase tracking-[0.3em] text-[10px]"
                            >
                                {addProcessing ? 'CATALOGING...' : 'ENSHRINE IN REGISTRY'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
