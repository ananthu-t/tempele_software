import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import {
    Settings as SettingsIcon,
    Printer,
    Image as ImageIcon,
    Building2,
    Save,
    Smartphone,
    Type,
    CheckCircle2,
    Info,
    Layout
} from 'lucide-react';
import { PageProps } from '@/types';
import ReceiptTemplateManager from '@/Components/ReceiptTemplateManager';

interface Settings {
    id: number;
    name: string;
    name_ml: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    address_ml: string | null;
    logo: string | null;
    printer_id: string | null;
    printer_type: 'USB' | 'Bluetooth' | 'Network';
    paper_size: '58mm' | '80mm';
    receipt_header: string | null;
    receipt_footer: string | null;
}

interface ReceiptTemplate {
    id: number;
    name: string;
    type: string;
    header_content: string | null;
    footer_content: string | null;
    layout_config: any;
    is_default: boolean;
}

interface Props extends PageProps {
    settings: Settings;
    receipt_templates: ReceiptTemplate[];
}

export default function Index({ auth, settings, receipt_templates }: Props) {
    const [activeTab, setActiveTab] = useState<'general' | 'branding' | 'hardware' | 'templates'>('general');

    const { data, setData, post, processing, errors } = useForm({
        name: settings.name || '',
        name_ml: settings.name_ml || '',
        phone: settings.phone || '',
        email: settings.email || '',
        address: settings.address || '',
        address_ml: settings.address_ml || '',
        printer_id: settings.printer_id || '',
        printer_type: settings.printer_type || 'USB',
        paper_size: settings.paper_size || '58mm',
        receipt_header: settings.receipt_header || '',
        receipt_footer: settings.receipt_footer || '',
        logo_file: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Use post for multipart data (logo upload)
        post(route('settings.update'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const tabs = [
        { id: 'general', label: 'Identity & Vitality', icon: <Building2 size={18} /> },
        { id: 'branding', label: 'Branding & Master Receipt', icon: <ImageIcon size={18} /> },
        { id: 'templates', label: 'Advanced Layouts', icon: <Layout size={18} /> },
        { id: 'hardware', label: 'Hardware & Printing', icon: <Printer size={18} /> },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h2 className="font-black text-2xl text-slate-900 tracking-tight flex items-center gap-3">
                            <SettingsIcon className="text-orange-600" /> Master Settings
                        </h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Centralized ERP Configuration</p>
                    </div>
                    <button
                        onClick={submit}
                        disabled={processing}
                        className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-orange-600 transition-all shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-50"
                    >
                        <Save size={18} /> {processing ? 'Enshrining...' : 'Save Configuration'}
                    </button>
                </div>
            }
        >
            <Head title="Master Settings" />

            <div className="py-12 flex flex-col md:flex-row gap-12">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-80 space-y-4">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`w-full p-6 rounded-[2rem] flex items-center gap-4 transition-all border ${activeTab === tab.id
                                ? 'bg-white border-orange-100 shadow-xl shadow-slate-100 text-orange-600'
                                : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-50'
                                }`}
                        >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${activeTab === tab.id ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-400'
                                }`}>
                                {tab.icon}
                            </div>
                            <span className="font-black text-[10px] uppercase tracking-widest">{tab.label}</span>
                        </button>
                    ))}

                    <div className="bg-orange-50/50 p-8 rounded-[2rem] border border-orange-100/50 mt-8">
                        <div className="flex items-center gap-3 text-orange-600 mb-4">
                            <Info size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">System Note</span>
                        </div>
                        <p className="text-[10px] font-bold text-orange-400 leading-relaxed uppercase tracking-tight">
                            Identity and bilingual settings affect all generated receipts and external communication.
                        </p>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] min-h-[600px]">
                    <form onSubmit={submit} className="space-y-12">
                        {activeTab === 'general' && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                                            <Building2 size={12} /> Temple Primary Name
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full p-5 bg-slate-50 border-none rounded-2xl font-black text-slate-900 uppercase tracking-tight focus:ring-4 focus:ring-orange-500/10 text-lg transition-all"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            placeholder="ENGLISH NAME"
                                        />
                                        {errors.name && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1 px-1">{errors.name}</p>}
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                                            <Type size={12} /> Temple Malayalam Name
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full p-5 bg-slate-50 border-none rounded-2xl font-black text-slate-900 tracking-tight focus:ring-4 focus:ring-orange-500/10 text-lg transition-all"
                                            value={data.name_ml}
                                            onChange={e => setData('name_ml', e.target.value)}
                                            placeholder="മലയാളം നാമം"
                                        />
                                    </div>

                                    <div className="space-y-4 md:col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                                            Contact Information
                                        </label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <input
                                                type="text"
                                                className="w-full p-4 bg-slate-50 border-none rounded-xl font-black text-slate-900 text-xs focus:ring-4 focus:ring-orange-500/10"
                                                value={data.phone}
                                                onChange={e => setData('phone', e.target.value)}
                                                placeholder="PRIMARY PHONE"
                                            />
                                            <input
                                                type="email"
                                                className="w-full p-4 bg-slate-50 border-none rounded-xl font-black text-slate-900 text-xs focus:ring-4 focus:ring-orange-500/10"
                                                value={data.email}
                                                onChange={e => setData('email', e.target.value)}
                                                placeholder="OFFICIAL EMAIL"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Administrative Address (EN)</label>
                                        <textarea
                                            rows={4}
                                            className="w-full p-5 bg-slate-50 border-none rounded-2xl font-bold text-slate-600 text-xs focus:ring-4 focus:ring-orange-500/10"
                                            value={data.address}
                                            onChange={e => setData('address', e.target.value)}
                                            placeholder="Detailed temple address..."
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Administrative Address (ML)</label>
                                        <textarea
                                            rows={4}
                                            className="w-full p-5 bg-slate-50 border-none rounded-2xl font-bold text-slate-600 text-xs focus:ring-4 focus:ring-orange-500/10"
                                            value={data.address_ml}
                                            onChange={e => setData('address_ml', e.target.value)}
                                            placeholder="മലയാളം വിലാസം..."
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'branding' && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="p-10 border-2 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center gap-6 group hover:border-orange-200 transition-colors">
                                    <div className="w-40 h-40 bg-slate-50 rounded-[2.5rem] flex items-center justify-center overflow-hidden border border-slate-100 group-hover:scale-105 transition-transform duration-500 shadow-sm relative">
                                        {settings.logo ? (
                                            <img src={`/storage/${settings.logo}`} alt="Logo" className="w-full h-full object-contain p-4" />
                                        ) : (
                                            <ImageIcon size={48} className="text-slate-200" />
                                        )}
                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <p className="text-[8px] font-black text-white uppercase tracking-widest">Update Logo</p>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-2">Temple Seal / Logo</h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-6">Maximum size: 2MB (PNG/JPG preferred)</p>
                                        <input
                                            type="file"
                                            className="hidden"
                                            id="logo-upload"
                                            onChange={e => setData('logo_file', e.target.files ? e.target.files[0] : null)}
                                        />
                                        <label
                                            htmlFor="logo-upload"
                                            className="bg-white border border-slate-200 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 cursor-pointer transition-all shadow-sm"
                                        >
                                            Browse Asset Library
                                        </label>
                                        {data.logo_file && <p className="mt-4 text-[10px] font-black text-orange-600 uppercase tracking-widest">Selected: {data.logo_file.name}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Global Receipt Header Note</label>
                                        <textarea
                                            className="w-full p-5 bg-slate-50 border-none rounded-2xl font-black text-slate-900 text-[10px] tracking-widest uppercase focus:ring-4 focus:ring-orange-500/10 px-8"
                                            rows={2}
                                            value={data.receipt_header}
                                            onChange={e => setData('receipt_header', e.target.value)}
                                            placeholder="E.G. LOKA SAMASTHA SUKHINO BHAVANTHU"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Global Receipt Footer Note</label>
                                        <textarea
                                            className="w-full p-5 bg-slate-50 border-none rounded-2xl font-black text-slate-900 text-[10px] tracking-widest uppercase focus:ring-4 focus:ring-orange-500/10 px-8"
                                            rows={2}
                                            value={data.receipt_footer}
                                            onChange={e => setData('receipt_footer', e.target.value)}
                                            placeholder="E.G. THANK YOU FOR YOUR DEVOTION"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Hardware & Printing Tab */}
                        {activeTab === 'hardware' && (
                            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 flex items-center justify-between group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl shadow-slate-100 group-hover:scale-110 transition-transform">
                                            <Printer className="text-orange-600" size={32} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 text-lg uppercase tracking-tight">Active Printer Node</h4>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Hardware Binding & Communication Protocol</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Printer Connectivity</label>
                                        <select
                                            className="w-full rounded-2xl border-slate-100 bg-slate-50 p-6 font-black text-slate-900 uppercase tracking-widest focus:ring-4 focus:ring-orange-500/10"
                                            value={data.printer_type}
                                            onChange={e => setData('printer_type', e.target.value as any)}
                                        >
                                            <option value="USB">USB DIRECT</option>
                                            <option value="Bluetooth">BLUETOOTH WIRELESS</option>
                                            <option value="Network">NETWORK / ETHERNET</option>
                                        </select>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Hardware ID / MAC Address</label>
                                        <input
                                            type="text"
                                            className="w-full rounded-2xl border-slate-100 bg-slate-50 p-6 font-black text-slate-900 uppercase tracking-widest focus:ring-4 focus:ring-orange-500/10 placeholder:text-slate-200"
                                            value={data.printer_id}
                                            onChange={e => setData('printer_id', e.target.value)}
                                            placeholder="E.G. 00:11:22:33:44:55"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Paper Dimensions</label>
                                    <div className="flex gap-6">
                                        {['58mm', '80mm'].map((size) => (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => setData('paper_size', size as any)}
                                                className={`flex-1 p-6 rounded-[2rem] border-2 font-black text-sm transition-all ${data.paper_size === size
                                                    ? 'border-orange-500 bg-orange-50 text-orange-600 shadow-lg shadow-orange-500/10'
                                                    : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                                                    }`}
                                            >
                                                {size} STANDARD
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-slate-900 hover:bg-orange-600 text-white font-black py-8 rounded-[2.5rem] shadow-2xl transition-all scale-100 hover:scale-[1.02] active:scale-95 disabled:opacity-50 uppercase tracking-[0.4em] text-xs"
                                >
                                    {processing ? 'SYNCING METADATA...' : 'AUTHORIZE HARDWARE CHANGES'}
                                </button>
                            </div>
                        )}

                        {/* Advanced Layouts Tab */}
                        {activeTab === 'templates' && (
                            <ReceiptTemplateManager templates={receipt_templates} />
                        )}
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
