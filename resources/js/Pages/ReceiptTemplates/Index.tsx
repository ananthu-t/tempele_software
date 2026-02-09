import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Plus, Pencil, Trash2, X, FileText, Layout, Info } from 'lucide-react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

interface ReceiptTemplate {
    id: number;
    name: string;
    type: 'Vazhipadu' | 'Donation' | 'Advance' | 'Refund';
    header_content: string | null;
    footer_content: string | null;
    is_default: boolean;
}

export default function Index({ auth, templates }: PageProps & { templates: ReceiptTemplate[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        type: 'Vazhipadu',
        header_content: '',
        footer_content: '',
        is_default: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('receipt-templates.store'), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h2 className="font-black text-2xl text-slate-900 tracking-tight flex items-center gap-3">
                            Receipt Designer
                        </h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Thermal Template Customization</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-xl shadow-orange-100 hover:scale-[1.02] active:scale-95"
                    >
                        <Plus size={18} /> New Template
                    </button>
                </div>
            }
        >
            <Head title="Receipt Designer" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {templates.map((template) => (
                    <div key={template.id} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden group hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-500">
                        <div className="p-8 pb-4">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-slate-50 group-hover:bg-orange-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-orange-600 transition-colors">
                                    <FileText size={24} />
                                </div>
                                {template.is_default && (
                                    <span className="text-[8px] font-black bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full uppercase tracking-widest">Default</span>
                                )}
                            </div>
                            <h3 className="font-black text-slate-900 uppercase tracking-tight text-lg leading-tight mb-1">{template.name}</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{template.type} Template</p>
                        </div>

                        {/* Visual Skeleton of Template */}
                        <div className="mx-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                            <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto" />
                            <div className="h-2 bg-slate-100 rounded w-1/2 mx-auto" />
                            <div className="border-b border-dotted border-slate-200 my-4" />
                            <div className="space-y-2">
                                <div className="h-2 bg-slate-100 rounded w-full" />
                                <div className="h-2 bg-slate-100 rounded w-full" />
                            </div>
                            <div className="border-t border-dotted border-slate-200 mt-4 pt-4">
                                <div className="h-2 bg-slate-200 rounded w-2/3 mx-auto" />
                            </div>
                        </div>

                        <div className="p-8 pt-6 border-t border-slate-50 bg-slate-50/30 flex gap-4">
                            <button className="flex-1 bg-white hover:bg-slate-900 hover:text-white text-slate-900 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border border-slate-100 transition-all">
                                Edit Design
                            </button>
                        </div>
                    </div>
                ))}

                {templates.length === 0 && (
                    <div className="col-span-full py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center gap-6 opacity-50">
                        <Layout size={64} className="text-slate-200" />
                        <div className="text-center">
                            <p className="font-black text-slate-900 uppercase tracking-[.3em]">No templates designed yet</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 italic">Standard thermal layout will be used as fallback</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Template Modal */}
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="2xl">
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Create Receipt Template</h3>
                        <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2 sm:col-span-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Template Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 focus:ring-4 focus:ring-orange-500/10 font-black text-slate-900 uppercase tracking-widest text-xs"
                                placeholder="E.G. MAIN COUNTER SLIP..."
                                required
                            />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Receipt Type</label>
                            <select
                                value={data.type}
                                onChange={e => setData('type', e.target.value as any)}
                                className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 focus:ring-4 focus:ring-orange-500/10 font-black text-slate-900 uppercase tracking-widest text-xs"
                            >
                                <option value="Vazhipadu">VAZHIPADU SLIP</option>
                                <option value="Donation">DONATION RECEIPT</option>
                                <option value="Advance">ADVANCE VOUCHER</option>
                                <option value="Refund">REFUND SLIP</option>
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Header Content (Esc/Pos Supported)</label>
                            <textarea
                                value={data.header_content || ''}
                                onChange={e => setData('header_content', e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 focus:ring-4 focus:ring-orange-500/10 font-mono text-xs h-32"
                                placeholder="TEMPLE NAME, ADDRESS, PHONE..."
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Footer Content</label>
                            <textarea
                                value={data.footer_content || ''}
                                onChange={e => setData('footer_content', e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 focus:ring-4 focus:ring-orange-500/10 font-mono text-xs h-32"
                                placeholder="SHLOKAS, DEVOTIONAL QUOTES, SUPPORT INFO..."
                            />
                        </div>

                        <div className="col-span-2 flex items-center gap-3 bg-slate-50 p-4 rounded-xl">
                            <input
                                type="checkbox"
                                checked={data.is_default}
                                onChange={e => setData('is_default', e.target.checked)}
                                className="w-5 h-5 rounded border-slate-200 text-orange-600 focus:ring-orange-500"
                            />
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Set as Primary Template for this Category</span>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50"
                        >
                            PUBLISH TEMPLATE
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
