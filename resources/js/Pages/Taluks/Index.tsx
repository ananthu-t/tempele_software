import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Plus, Pencil, Trash2, X, MapPin } from 'lucide-react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

interface District {
    id: number;
    name: string;
}

interface Taluk {
    id: number;
    name: string;
    district_id: number;
    district?: District;
}

export default function Index({ auth, taluks, districts }: PageProps & { taluks: Taluk[], districts: District[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTaluk, setEditingTaluk] = useState<Taluk | null>(null);

    const { data, setData, post, put, processing, reset } = useForm({
        name: '',
        district_id: '',
    });

    const openCreateModal = () => {
        setEditingTaluk(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (taluk: Taluk) => {
        setEditingTaluk(taluk);
        setData({
            name: taluk.name,
            district_id: String(taluk.district_id),
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTaluk) {
            put(route('taluks.update', editingTaluk.id), { onSuccess: () => closeModal() });
        } else {
            post(route('taluks.store'), { onSuccess: () => closeModal() });
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTaluk(null);
        reset();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h2 className="font-black text-2xl text-slate-900 tracking-tight flex items-center gap-3">Taluks</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Administrative Sub-Divisions</p>
                    </div>
                    <button onClick={openCreateModal} className="bg-slate-900 hover:bg-black text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 shadow-xl">
                        <Plus size={18} /> Add Taluk
                    </button>
                </div>
            }
        >
            <Head title="Taluks" />

            <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-50">
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Taluk</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">District</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {taluks.map((taluk) => (
                            <tr key={taluk.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-10 py-8 font-black text-slate-900 uppercase tracking-tight">{taluk.name}</td>
                                <td className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">{taluk.district?.name}</td>
                                <td className="px-10 py-8 text-right">
                                    <button onClick={() => openEditModal(taluk)} className="p-3 text-slate-400 hover:text-orange-600">
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
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{editingTaluk ? 'Update Taluk' : 'New Taluk'}</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">District</label>
                            <select value={data.district_id} onChange={e => setData('district_id', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 font-black text-slate-900 uppercase text-xs" required>
                                <option value="">Select District</option>
                                {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Taluk Name</label>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 font-black text-slate-900 uppercase text-xs" required />
                        </div>
                    </div>
                    <button type="submit" disabled={processing} className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest">
                        {editingTaluk ? 'SAVE CHANGES' : 'CREATE TALUK'}
                    </button>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
