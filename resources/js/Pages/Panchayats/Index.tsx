import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Plus, Pencil, Trash2, X, MapPin } from 'lucide-react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

interface Taluk {
    id: number;
    name: string;
}

interface Panchayat {
    id: number;
    name: string;
    taluk_id: number;
    taluk?: Taluk;
}

export default function Index({ auth, panchayats, taluks }: PageProps & { panchayats: Panchayat[], taluks: Taluk[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPanchayat, setEditingPanchayat] = useState<Panchayat | null>(null);

    const { data, setData, post, put, processing, reset } = useForm({
        name: '',
        taluk_id: '',
    });

    const openCreateModal = () => {
        setEditingPanchayat(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (panchayat: Panchayat) => {
        setEditingPanchayat(panchayat);
        setData({
            name: panchayat.name,
            taluk_id: String(panchayat.taluk_id),
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingPanchayat) {
            put(route('panchayats.update', editingPanchayat.id), { onSuccess: () => closeModal() });
        } else {
            post(route('panchayats.store'), { onSuccess: () => closeModal() });
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPanchayat(null);
        reset();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h2 className="font-black text-2xl text-slate-900 tracking-tight flex items-center gap-3">Panchayats</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Local Governance Bodies</p>
                    </div>
                    <button onClick={openCreateModal} className="bg-slate-900 hover:bg-black text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 shadow-xl">
                        <Plus size={18} /> Add Panchayat
                    </button>
                </div>
            }
        >
            <Head title="Panchayats" />

            <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-50">
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Panchayat</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Taluk</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {panchayats.map((panchayat) => (
                            <tr key={panchayat.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-10 py-8 font-black text-slate-900 uppercase tracking-tight">{panchayat.name}</td>
                                <td className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">{panchayat.taluk?.name}</td>
                                <td className="px-10 py-8 text-right">
                                    <button onClick={() => openEditModal(panchayat)} className="p-3 text-slate-400 hover:text-orange-600">
                                        <Pencil size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal show={isModalOpen} onClose={closeModal} maxWidth="md">
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{editingPanchayat ? 'Update Panchayat' : 'New Panchayat'}</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Taluk</label>
                            <select value={data.taluk_id} onChange={e => setData('taluk_id', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 font-black text-slate-900 uppercase text-xs" required>
                                <option value="">Select Taluk</option>
                                {taluks.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Panchayat Name</label>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 font-black text-slate-900 uppercase text-xs" required />
                        </div>
                    </div>
                    <button type="submit" disabled={processing} className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest">
                        {editingPanchayat ? 'SAVE CHANGES' : 'CREATE PANCHAYAT'}
                    </button>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
