import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Plus, Pencil, Trash2, X, MapPin } from 'lucide-react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

interface District {
    id: number;
    name: string;
    state: string;
}

export default function Index({ auth, districts }: PageProps & { districts: District[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDistrict, setEditingDistrict] = useState<District | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        state: 'Kerala',
    });

    const openCreateModal = () => {
        setEditingDistrict(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (district: District) => {
        setEditingDistrict(district);
        setData({
            name: district.name,
            state: district.state,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingDistrict) {
            put(route('districts.update', editingDistrict.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('districts.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingDistrict(null);
        reset();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h2 className="font-black text-2xl text-slate-900 tracking-tight flex items-center gap-3">
                            Districts
                        </h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Regional Administration</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="bg-slate-900 hover:bg-black text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-xl active:scale-95"
                    >
                        <Plus size={18} /> Add District
                    </button>
                </div>
            }
        >
            <Head title="Districts" />

            <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-50">
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">ID</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">District Name</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">State</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {districts.map((district) => (
                            <tr key={district.id} className="group hover:bg-slate-50/50 transition-colors">
                                <td className="px-10 py-8 font-mono text-[10px] font-black text-slate-300">#{district.id}</td>
                                <td className="px-10 py-8 font-black text-slate-900 uppercase tracking-tight">{district.name}</td>
                                <td className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">{district.state}</td>
                                <td className="px-10 py-8 text-right">
                                    <button onClick={() => openEditModal(district)} className="p-3 text-slate-400 hover:text-orange-600 transition-all">
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
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                        {editingDistrict ? 'Update District' : 'New District'}
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 font-black text-slate-900 uppercase text-xs"
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest">
                        {editingDistrict ? 'SAVE CHANGES' : 'CREATE DISTRICT'}
                    </button>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
