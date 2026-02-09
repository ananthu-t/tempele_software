import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Plus, Sparkles, Pencil, Trash2, X, Settings2, CalendarRange } from 'lucide-react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

interface Vazhipadu {
    id: number;
    name: string;
}

interface RateRule {
    id: number;
    vazhipadu_id: number;
    amount: number;
    effective_from: string;
    effective_to: string | null;
    rule_type: 'base' | 'festival' | 'star' | 'special';
    rule_config: any;
    is_active: boolean;
    vazhipadu?: Vazhipadu;
}

export default function Index({ auth, rates, vazhipadus }: PageProps & { rates: RateRule[], vazhipadus: Vazhipadu[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRate, setEditingRate] = useState<RateRule | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        vazhipadu_id: '',
        amount: '',
        effective_from: new Date().toISOString().split('T')[0],
        effective_to: '',
        rule_type: 'base',
        is_active: true,
    });

    const openCreateModal = () => {
        setEditingRate(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (rate: RateRule) => {
        setEditingRate(rate);
        setData({
            vazhipadu_id: String(rate.vazhipadu_id),
            amount: String(rate.amount),
            effective_from: rate.effective_from,
            effective_to: rate.effective_to || '',
            rule_type: rate.rule_type,
            is_active: rate.is_active,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingRate) {
            put(route('vazhipadu-rates.update', editingRate.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('vazhipadu-rates.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingRate(null);
        reset();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h2 className="font-black text-2xl text-slate-900 tracking-tight flex items-center gap-3">
                            Pricing Engine
                        </h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Vazhipadu Rate & Rule Management</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="bg-slate-900 hover:bg-black text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-xl active:scale-95"
                    >
                        <Plus size={18} /> New Rate Rule
                    </button>
                </div>
            }
        >
            <Head title="Pricing Engine" />

            <div className="space-y-8">
                <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Ritual</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Type</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Validity</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Amount</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {rates.map((rate) => (
                                <tr key={rate.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-10 py-8">
                                        <div className="font-black text-slate-900 uppercase tracking-tight leading-tight group-hover:text-orange-600 transition-colors">
                                            {rate.vazhipadu?.name}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className={`w-2 h-2 rounded-full ${rate.is_active ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{rate.is_active ? 'ACTIVE' : 'DISABLED'}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border ${rate.rule_type === 'base' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                rate.rule_type === 'festival' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                                    'bg-orange-50 text-orange-600 border-orange-100'
                                            }`}>
                                            {rate.rule_type}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                                            <CalendarRange size={14} className="opacity-50" />
                                            {rate.effective_from} {rate.effective_to ? `→ ${rate.effective_to}` : '(Always)'}
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="text-xl font-black text-slate-900 tabular-nums">
                                            <span className="text-slate-400 mr-1 text-sm">₹</span>
                                            {parseFloat(String(rate.amount)).toLocaleString('en-IN')}
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(rate)}
                                                className="p-3 bg-white text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all border border-slate-100 shadow-sm"
                                            >
                                                <Settings2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Price Rule Modal */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="md">
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                            {editingRate ? 'Modify Pricing' : 'New Pricing Rule'}
                        </h3>
                        <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-900">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {!editingRate && (
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Target Vazhipadu</label>
                                <select
                                    value={data.vazhipadu_id}
                                    onChange={e => setData('vazhipadu_id', e.target.value)}
                                    className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 focus:ring-4 focus:ring-orange-500/10 font-black text-slate-900 uppercase tracking-widest text-xs"
                                    required
                                >
                                    <option value="">SELECT RITUAL...</option>
                                    {vazhipadus.map(v => (
                                        <option key={v.id} value={v.id}>{v.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Base Amount</label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-black">₹</span>
                                    <input
                                        type="number"
                                        value={data.amount}
                                        onChange={e => setData('amount', e.target.value)}
                                        className="w-full bg-slate-50 border-none rounded-xl py-4 pl-12 pr-6 focus:ring-4 focus:ring-orange-500/10 font-black text-slate-900 tabular-nums"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Rule Type</label>
                                <select
                                    value={data.rule_type}
                                    onChange={e => setData('rule_type', e.target.value as any)}
                                    className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 focus:ring-4 focus:ring-orange-500/10 font-black text-slate-900 uppercase tracking-widest text-xs"
                                >
                                    <option value="base">BASE RATE</option>
                                    <option value="festival">FESTIVAL SURCHARGE</option>
                                    <option value="star">NAKSHATRA RULE</option>
                                    <option value="special">SPECIAL DAY</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Effective From</label>
                                <input
                                    type="date"
                                    value={data.effective_from}
                                    onChange={e => setData('effective_from', e.target.value)}
                                    className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 focus:ring-4 focus:ring-orange-500/10 font-black text-slate-900 text-xs"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Effective To</label>
                                <input
                                    type="date"
                                    value={data.effective_to}
                                    onChange={e => setData('effective_to', e.target.value)}
                                    className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 focus:ring-4 focus:ring-orange-500/10 font-black text-slate-900 text-xs"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={e => setData('is_active', e.target.checked)}
                                className="w-5 h-5 rounded border-slate-200 text-orange-600 focus:ring-orange-500"
                            />
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Mark as Active Rule</span>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-orange-600 text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.3em] hover:bg-orange-700 transition-all shadow-xl shadow-orange-100 active:scale-95 disabled:opacity-50"
                        >
                            {editingRate ? 'UPDATE PRICING RULE' : 'INITIALIZE PRICING RULE'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
