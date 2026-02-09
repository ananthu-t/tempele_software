import { useForm } from '@inertiajs/react';
import {
    FileText,
    Plus,
    Trash2,
    Layout,
    CheckCircle2,
    Check,
    MoreVertical,
    Settings2,
    Receipt
} from 'lucide-react';
import { useState } from 'react';

interface ReceiptTemplate {
    id: number;
    name: string;
    type: string;
    header_content: string | null;
    footer_content: string | null;
    layout_config: any;
    is_default: boolean;
}

interface Props {
    templates: ReceiptTemplate[];
}

export default function ReceiptTemplateManager({ templates }: Props) {
    const [isCreating, setIsCreating] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<ReceiptTemplate | null>(null);

    const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
        name: '',
        type: 'Vazhipadu',
        header_content: '',
        footer_content: '',
        layout_config: {},
        is_default: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTemplate) {
            put(route('receipt-templates.update', editingTemplate.id), {
                onSuccess: () => {
                    setEditingTemplate(null);
                    reset();
                }
            });
        } else {
            post(route('receipt-templates.store'), {
                onSuccess: () => {
                    setIsCreating(false);
                    reset();
                }
            });
        }
    };

    const startEdit = (template: ReceiptTemplate) => {
        setEditingTemplate(template);
        setData({
            name: template.name,
            type: template.type,
            header_content: template.header_content || '',
            footer_content: template.footer_content || '',
            layout_config: template.layout_config || {},
            is_default: template.is_default,
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to remove this receipt layout? This action is irreversible.')) {
            destroy(route('receipt-templates.destroy', id));
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                <div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
                        <Receipt className="text-orange-500" size={24} /> Template Archive
                    </h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Manage ritual, donation, and refund layouts</p>
                </div>
                {!isCreating && !editingTemplate && (
                    <button
                        onClick={() => { setIsCreating(true); reset(); }}
                        className="bg-slate-900 hover:bg-orange-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-xl active:scale-95"
                    >
                        <Plus size={16} /> New Layout
                    </button>
                )}
            </div>

            {(isCreating || editingTemplate) ? (
                <form onSubmit={handleSubmit} className="bg-white border-2 border-slate-100 rounded-[3rem] p-10 space-y-10 animate-in zoom-in-95 duration-300">
                    <div className="flex justify-between items-center border-b border-slate-50 pb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                                <Settings2 size={24} />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 uppercase tracking-tighter">
                                    {editingTemplate ? 'Modify Layout' : 'Enshrine New Template'}
                                </h4>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5 italic">Configure aesthetics and metadata</p>
                            </div>
                        </div>
                        <button type="button" onClick={() => { setIsCreating(false); setEditingTemplate(null); reset(); }} className="text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest">Discard Changes</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Internal Name / Alias</label>
                            <input
                                type="text"
                                className="w-full rounded-2xl border-slate-100 bg-slate-50 p-5 font-black text-slate-900 uppercase tracking-tight focus:ring-4 focus:ring-orange-500/10 placeholder:text-slate-200"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="E.G. FESTIVAL VAZHIPADU RECEIPT"
                                required
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Application Realm (Type)</label>
                            <select
                                className="w-full rounded-2xl border-slate-100 bg-slate-50 p-5 font-black text-slate-900 uppercase tracking-widest focus:ring-4 focus:ring-orange-500/10"
                                value={data.type}
                                onChange={e => setData('type', e.target.value)}
                            >
                                <option value="Vazhipadu">VAZHIPADU (RITUALS)</option>
                                <option value="Donation">DONATION (OFFERING)</option>
                                <option value="Advance">ADVANCE (BOOKING)</option>
                                <option value="Refund">REFUND (CANCELLATION)</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">Header Proclomation</label>
                            <textarea
                                className="w-full rounded-2xl border-slate-100 bg-slate-50 p-6 font-bold text-xs text-slate-700 min-h-[150px] focus:ring-4 focus:ring-orange-500/10 transition-all"
                                value={data.header_content}
                                onChange={e => setData('header_content', e.target.value)}
                                placeholder="Custom text to appear below temple name..."
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">Footer Benediction</label>
                            <textarea
                                className="w-full rounded-2xl border-slate-100 bg-slate-50 p-6 font-bold text-xs text-slate-700 min-h-[150px] focus:ring-4 focus:ring-orange-500/10 transition-all"
                                value={data.footer_content}
                                onChange={e => setData('footer_content', e.target.value)}
                                placeholder="Custom note or instruction at the bottom..."
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                        <button
                            type="button"
                            onClick={() => setData('is_default', !data.is_default)}
                            className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${data.is_default ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white border-slate-200'}`}
                        >
                            {data.is_default && <Check size={14} strokeWidth={4} />}
                        </button>
                        <div>
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest block">Designate as Primary Layout</span>
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter block mt-0.5">This will override any existing default for the selected realm</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-slate-900 hover:bg-orange-600 text-white font-black py-6 rounded-3xl shadow-2xl transition-all scale-100 hover:scale-[1.01] active:scale-95 disabled:opacity-50 uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-4"
                    >
                        {processing ? 'CALIBRATING...' : editingTemplate ? 'UPDATE TEMPLE MANUSCRIPT' : 'RECORD NEW TEMPLATE'}
                    </button>
                </form>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {templates.map(tmp => (
                        <div key={tmp.id} className="group bg-white border border-slate-100 p-8 rounded-[3rem] hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all relative overflow-hidden">
                            {tmp.is_default && (
                                <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full">
                                    <CheckCircle2 size={12} />
                                    <span className="text-[8px] font-black uppercase tracking-widest">Primary</span>
                                </div>
                            )}
                            <div className="flex items-start gap-5">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${tmp.type === 'Vazhipadu' ? 'bg-orange-500' :
                                        tmp.type === 'Donation' ? 'bg-amber-500' :
                                            tmp.type === 'Advance' ? 'bg-blue-500' : 'bg-red-500'
                                    }`}>
                                    <FileText size={24} />
                                </div>
                                <div className="flex-1">
                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 italic">{tmp.type} Protocol</div>
                                    <h4 className="font-black text-slate-900 uppercase tracking-tighter truncate max-w-[200px] leading-tight">{tmp.name}</h4>
                                    <div className="flex items-center gap-4 mt-4">
                                        <button
                                            onClick={() => startEdit(tmp)}
                                            className="text-[9px] font-black text-slate-500 hover:text-orange-600 uppercase tracking-widest flex items-center gap-2"
                                        >
                                            <Layout size={12} /> Reconfigure
                                        </button>
                                        <button
                                            onClick={() => handleDelete(tmp.id)}
                                            className="text-[9px] font-black text-slate-300 hover:text-red-500 uppercase tracking-widest flex items-center gap-2"
                                        >
                                            <Trash2 size={12} /> Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {templates.length === 0 && (
                        <div className="md:col-span-2 py-20 text-center bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
                            <div className="flex flex-col items-center gap-4 text-slate-300">
                                <Layout size={48} strokeWidth={1} />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em]">No custom layouts in the archive</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
