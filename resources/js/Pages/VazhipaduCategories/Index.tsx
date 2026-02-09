import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Plus, Search, Sparkles, Pencil, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

interface Category {
    id: number;
    name: string;
    name_ml: string | null;
    description: string | null;
}

export default function Index({ auth, categories }: PageProps & { categories: Category[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        name_ml: '',
        description: '',
    });

    const openCreateModal = () => {
        setEditingCategory(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (category: Category) => {
        setEditingCategory(category);
        setData({
            name: category.name,
            name_ml: category.name_ml || '',
            description: category.description || '',
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCategory) {
            put(route('vazhipadu-categories.update', editingCategory.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('vazhipadu-categories.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this category?')) {
            destroy(route('vazhipadu-categories.destroy', id));
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        reset();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h2 className="font-black text-2xl text-slate-900 tracking-tight flex items-center gap-3">
                            Vazhipadu Categories
                        </h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Ritual Grouping & Classification</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-xl shadow-orange-100 hover:scale-[1.02] active:scale-95"
                    >
                        <Plus size={18} /> Add Category
                    </button>
                </div>
            }
        >
            <Head title="Vazhipadu Categories" />

            <div className="space-y-8">
                <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">ID</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Category Name</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Description</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {categories.map((category) => (
                                <tr key={category.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-10 py-8 font-mono text-[10px] font-black text-slate-300">#{category.id}</td>
                                    <td className="px-10 py-8">
                                        <div className="font-black text-slate-900 uppercase tracking-tight leading-tight group-hover:text-orange-600 transition-colors">
                                            {category.name}
                                        </div>
                                        {category.name_ml && (
                                            <div className="text-[10px] text-orange-600 font-bold mt-1 malayalam-font italic">
                                                {category.name_ml}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed line-clamp-1 max-w-xs">
                                            {category.description || 'No description provided'}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(category)}
                                                className="p-3 bg-white text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all border border-slate-100 hover:border-orange-100 shadow-sm"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category.id)}
                                                className="p-3 bg-white text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-slate-100 hover:border-red-100 shadow-sm"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Modal */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="md">
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                            {editingCategory ? 'Update Category' : 'Create Category'}
                        </h3>
                        <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-900">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Category Name (English/Manglish)</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 focus:ring-4 focus:ring-orange-500/10 font-black text-slate-900 uppercase tracking-widest text-xs"
                                placeholder="E.G. PUSHPANJALI..."
                                required
                            />
                            {errors.name && <div className="text-red-500 text-[10px] font-black uppercase mt-1">{errors.name}</div>}
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Category Name (Malayalam)</label>
                            <input
                                type="text"
                                value={data.name_ml}
                                onChange={e => setData('name_ml', e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 focus:ring-4 focus:ring-orange-500/10 font-bold text-slate-900 text-sm"
                                placeholder="ഉദാ: പുഷ്പാഞ്ജലി..."
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Description (Optional)</label>
                            <textarea
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 focus:ring-4 focus:ring-orange-500/10 font-black text-slate-900 uppercase tracking-widest text-xs h-32"
                                placeholder="CATEGORY NOTES..."
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-800 transition-all shadow-xl active:scale-95 disabled:opacity-50"
                        >
                            {editingCategory ? 'SAVE CHANGES' : 'CREATE CATEGORY'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
