import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Plus, Pencil, Trash2, X, Shield } from 'lucide-react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

interface Devaswom {
    id: number;
    name: string;
    description: string | null;
}

export default function Index({ auth, devaswoms }: PageProps & { devaswoms: Devaswom[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDevaswom, setEditingDevaswom] = useState<Devaswom | null>(null);

    const { data, setData, post, put, processing, reset } = useForm({
        name: '',
        description: '',
    });

    const openCreateModal = () => {
        setEditingDevaswom(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (devaswom: Devaswom) => {
        setEditingDevaswom(devaswom);
        setData({
            name: devaswom.name,
            description: devaswom.description || '',
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingDevaswom) {
            put(route('devaswoms.update', editingDevaswom.id), { onSuccess: () => closeModal() });
        } else {
            post(route('devaswoms.store'), { onSuccess: () => closeModal() });
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingDevaswom(null);
        reset();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h2 className="font-black text-2xl text-slate-900 tracking-tight flex items-center gap-3">Devaswoms</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Temple Administration Boards</p>
                    </div>
                    <button onClick={openCreateModal} className="bg-slate-900 hover:bg-black text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 shadow-xl">
                        <Plus size={18} /> Add Devaswom
                    </button>
                </div>
            }
        >
            <Head title="Devaswoms" />

            <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-50">
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Devaswom Name</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Description</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {devaswoms.map((devaswom) => (
                            <tr key={devaswom.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-10 py-8">
                                    <div className="font-black text-slate-900 uppercase tracking-tight">{devaswom.name}</div>
                                </td>
                                <td className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest line-clamp-1">{devaswom.description || 'No description'}</td>
                                <td className="px-10 py-8 text-right">
                                    <button onClick={() => openEditModal(devaswom)} className="p-3 text-slate-400 hover:text-orange-600">
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
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{editingDevaswom ? 'Update Devaswom' : 'New Devaswom'}</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Name</label>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 font-black text-slate-900 uppercase text-xs" required />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Description</label>
                            <textarea value={data.description} onChange={e => setData('description', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 font-black text-slate-900 uppercase text-xs" />
                        </div>
                    </div>
                    <button type="submit" disabled={processing} className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest">
                        {editingDevaswom ? 'SAVE CHANGES' : 'CREATE DEVASWOM'}
                    </button>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
