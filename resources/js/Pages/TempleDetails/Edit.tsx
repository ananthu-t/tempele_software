import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    Save,
    Building,
    Phone,
    Mail,
    MapPin,
    Image as ImageIcon
} from 'lucide-react';

interface Temple {
    id: number;
    name: string;
    name_ml: string;
    address: string;
    address_ml: string;
    phone: string;
    email: string;
    logo_path: string;
}

export default function Edit({ auth, temple }: PageProps & { temple: Temple | null }) {
    const { data, setData, post, processing, errors } = useForm({
        name: temple?.name || '',
        name_ml: temple?.name_ml || '',
        address: temple?.address || '',
        address_ml: temple?.address_ml || '',
        phone: temple?.phone || '',
        email: temple?.email || '',
        logo_path: temple?.logo_path || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // @ts-ignore
        post(route('temple.update'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Temple Configuration</h2>}
        >
            <Head title="Temple Settings" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                        <div className="p-8 space-y-8">

                            <div className="flex items-center gap-4 pb-6 border-b border-gray-50">
                                <div className="bg-orange-600 p-4 rounded-2xl shadow-lg shadow-orange-100">
                                    <Building className="text-white w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900">Temple Master Details</h3>
                                    <p className="text-gray-500 text-sm">Configure the basic identity of the temple for receipts and reports.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* English Name */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-black text-gray-700 uppercase tracking-wider flex items-center gap-2 mb-2">
                                            <Building size={16} className="text-gray-400" />
                                            Temple Name (English)
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full rounded-2xl border-gray-100 bg-gray-50 p-4 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-semibold"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            placeholder="Enter Temple Name"
                                        />
                                        {errors.name && <p className="text-xs text-red-500 mt-2">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="text-sm font-black text-gray-700 uppercase tracking-wider flex items-center gap-2 mb-2">
                                            <Building size={16} className="text-gray-400" />
                                            Malayalam Name (മലയാളം പേര്)
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full rounded-2xl border-gray-100 bg-gray-50 p-4 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-malayalam text-xl font-bold"
                                            value={data.name_ml}
                                            onChange={e => setData('name_ml', e.target.value)}
                                            placeholder="ക്ഷേത്രത്തിന്റെ പേര്"
                                        />
                                    </div>
                                </div>

                                {/* Contact Details */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-black text-gray-700 uppercase tracking-wider flex items-center gap-2 mb-2">
                                            <Phone size={16} className="text-gray-400" />
                                            Phone Number
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full rounded-2xl border-gray-100 bg-gray-50 p-4 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-semibold"
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                            placeholder="Contact Phone"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-black text-gray-700 uppercase tracking-wider flex items-center gap-2 mb-2">
                                            <Mail size={16} className="text-gray-400" />
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            className="w-full rounded-2xl border-gray-100 bg-gray-50 p-4 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-semibold"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            placeholder="Email for communications"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Address Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                <div>
                                    <label className="text-sm font-black text-gray-700 uppercase tracking-wider flex items-center gap-2 mb-2">
                                        <MapPin size={16} className="text-gray-400" />
                                        Address (English)
                                    </label>
                                    <textarea
                                        rows={4}
                                        className="w-full rounded-2xl border-gray-100 bg-gray-50 p-4 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-semibold"
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                        placeholder="Full address of the temple"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-black text-gray-700 uppercase tracking-wider flex items-center gap-2 mb-2">
                                        <MapPin size={16} className="text-gray-400" />
                                        Address (Malayalam)
                                    </label>
                                    <textarea
                                        rows={4}
                                        className="w-full rounded-2xl border-gray-100 bg-gray-50 p-4 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-malayalam text-lg"
                                        value={data.address_ml}
                                        onChange={e => setData('address_ml', e.target.value)}
                                        placeholder="ക്ഷേത്രത്തിന്റെ വിലാസം"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Last updated: Just now</p>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-black py-4 px-12 rounded-2xl flex items-center gap-3 transition-all shadow-xl shadow-orange-100 scale-100 hover:scale-105 active:scale-100"
                            >
                                <Save size={20} /> SAVE SETTINGS
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
