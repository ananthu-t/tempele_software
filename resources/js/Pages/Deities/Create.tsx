import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    ChevronLeft,
    Save,
    Languages,
    Info
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { transliterate } from '@/Helper/transliterate';

export default function Create({ auth }: PageProps) {
    const [isManglish, setIsManglish] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        name_ml: '',
        description: '',
    });

    // Auto-transliterate Name if Manglish is enabled
    useEffect(() => {
        if (isManglish && data.name) {
            const mlText = transliterate(data.name);
            if (mlText !== data.name.toLowerCase()) {
                setData('name_ml', mlText);
            }
        }
    }, [data.name, isManglish]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // @ts-ignore
        post(route('deities.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href={route('deities.index')}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    >
                        <ChevronLeft size={20} />
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Add New Deity</h2>
                </div>
            }
        >
            <Head title="Create Deity" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 space-y-6">

                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                    General Information
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setIsManglish(!isManglish)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${isManglish ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'}`}
                                >
                                    <Languages size={14} /> {isManglish ? 'Manglish Helper ON' : 'English Only'}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Deity Name (English)</label>
                                    <input
                                        type="text"
                                        className={`w-full rounded-xl border-gray-100 bg-gray-50 focus:border-orange-500 focus:ring-orange-500 transition-all ${errors.name ? 'border-red-500' : ''}`}
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="e.g. Lord Shiva"
                                    />
                                    {errors.name && <p className="mt-1 text-xs text-red-500 font-medium">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Name in Malayalam</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-xl border-gray-100 bg-gray-50 focus:border-orange-500 focus:ring-orange-500 transition-all font-malayalam text-lg"
                                        value={data.name_ml}
                                        onChange={e => setData('name_ml', e.target.value)}
                                        placeholder="പ്രതിഷ്ഠയുടെ പേര്"
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
                                    placeholder="Deity details, history, or special significance..."
                                />
                                {errors.description && <p className="mt-1 text-xs text-red-500 font-medium">{errors.description}</p>}
                            </div>

                            <div className="bg-orange-50 rounded-xl p-4 flex gap-3 text-orange-800 border border-orange-100">
                                <Info className="w-5 h-5 shrink-0" />
                                <p className="text-sm font-medium">Deity and Malayalam names will appear on all Vazhipadu receipts. Please ensure transliteration is accurate.</p>
                            </div>
                        </div>

                        <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <Link
                                href={route('deities.index')}
                                className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold py-2.5 px-8 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-orange-100"
                            >
                                <Save size={20} /> Save Deity
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
