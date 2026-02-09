import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    ChevronLeft,
    Save,
    Info
} from 'lucide-react';

export default function Create({ auth }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        name_ml: '',
        rate: '',
        duration: '',
        description: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // @ts-ignore
        post(route('vazhipadus.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <Link
                        // @ts-ignore
                        href={route('vazhipadus.index')}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    >
                        <ChevronLeft size={20} />
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Add New Vazhipadu</h2>
                </div>
            }
        >
            <Head title="Create Vazhipadu" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Vazhipadu Name (English)</label>
                                    <input
                                        type="text"
                                        className={`w-full rounded-xl border-gray-100 bg-gray-50 focus:border-orange-500 focus:ring-orange-500 transition-all ${errors.name ? 'border-red-500' : ''}`}
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="e.g. Pushpanjali"
                                    />
                                    {errors.name && <p className="mt-1 text-xs text-red-500 font-medium">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Name in Malayalam</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-xl border-gray-100 bg-gray-50 focus:border-orange-500 focus:ring-orange-500 transition-all"
                                        value={data.name_ml}
                                        onChange={e => setData('name_ml', e.target.value)}
                                        placeholder="e.g. പുഷ്പാഞ്ജലി"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Rate (₹)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                        <input
                                            type="number"
                                            className={`w-full pl-8 rounded-xl border-gray-100 bg-gray-50 focus:border-orange-500 focus:ring-orange-500 transition-all ${errors.rate ? 'border-red-500' : ''}`}
                                            value={data.rate}
                                            onChange={e => setData('rate', e.target.value)}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    {errors.rate && <p className="mt-1 text-xs text-red-500 font-medium">{errors.rate}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Duration / Frequency</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-xl border-gray-100 bg-gray-50 focus:border-orange-500 focus:ring-orange-500 transition-all"
                                        value={data.duration}
                                        onChange={e => setData('duration', e.target.value)}
                                        placeholder="e.g. 10 mins or Daily"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                <textarea
                                    rows={4}
                                    className="w-full rounded-xl border-gray-100 bg-gray-50 focus:border-orange-500 focus:ring-orange-500 transition-all"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    placeholder="Brief description of the pooja..."
                                />
                            </div>

                            <div className="bg-orange-50 rounded-xl p-4 flex gap-3 text-orange-800 border border-orange-100">
                                <Info className="w-5 h-5 shrink-0" />
                                <p className="text-sm font-medium">This info will appear on receipts and booking screens. Double-check the Malayalam spelling for correct printing.</p>
                            </div>
                        </div>

                        <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <Link
                                // @ts-ignore
                                href={route('vazhipadus.index')}
                                className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold py-2.5 px-8 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-orange-100"
                            >
                                <Save size={20} /> Save Vazhipadu
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
