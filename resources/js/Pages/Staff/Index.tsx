import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    Users,
    UserCircle,
    Phone,
    Clock,
    Plus,
    Edit2,
    Trash2,
    ShieldCheck,
    IndianRupee,
    ChevronRight,
    Star
} from 'lucide-react';
import { useState } from 'react';

interface StaffMember {
    id: number;
    name: string;
    name_ml: string;
    role: string;
    phone: string;
    salary: string;
    status: string;
    duty_timing: string;
}

export default function Index({ auth, staff_list }: PageProps & { staff_list: StaffMember[] }) {
    const { data, setData, post, patch, delete: destroy, processing, reset } = useForm({
        name: '',
        name_ml: '',
        role: 'Staff',
        phone: '',
        salary: '',
        status: 'Active',
        duty_timing: '',
    });

    const [showModal, setShowModal] = useState(false);
    const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingStaff) {
            // @ts-ignore
            patch(route('staff.update', editingStaff.id), {
                onSuccess: () => { setShowModal(false); reset(); setEditingStaff(null); }
            });
        } else {
            // @ts-ignore
            post(route('staff.store'), {
                onSuccess: () => { setShowModal(false); reset(); }
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to remove this staff record?')) {
            // @ts-ignore
            destroy(route('staff.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h2 className="font-black text-2xl text-slate-900 tracking-tight flex items-center gap-3">
                            Staff & Clergy Management
                        </h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Human Resources & Duty Rosters</p>
                    </div>
                    <button
                        onClick={() => { setShowModal(true); setEditingStaff(null); reset(); }}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-xl shadow-orange-100 hover:scale-[1.02] active:scale-95"
                    >
                        <Plus size={18} /> Enroll New Staff
                    </button>
                </div>
            }
        >
            <Head title="Staff Management" />

            <div className="space-y-12">

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-1 h-full bg-slate-900" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Registry Size</p>
                        <p className="text-4xl font-black text-slate-900">{staff_list.length} <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Members</span></p>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-1 h-full bg-emerald-500" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Duty Ready</p>
                        <p className="text-4xl font-black text-slate-900">{staff_list.filter(s => s.status === 'Active').length} <span className="text-xs text-emerald-500 font-bold uppercase tracking-widest">Live</span></p>
                    </div>
                </div>

                {/* Staff Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                    {staff_list.map(staff => (
                        <div key={staff.id} className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
                            {/* Role Badge */}
                            <div className="absolute top-0 right-0 px-8 py-3 bg-slate-50 border-b border-l border-slate-100 rounded-bl-3xl flex items-center gap-2">
                                <ShieldCheck size={14} className="text-orange-500" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">{staff.role}</span>
                            </div>

                            <div className="flex items-center gap-6 mb-10 mt-2">
                                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 group-hover:bg-orange-50 group-hover:text-orange-500 transition-all duration-500 border border-slate-100">
                                    <UserCircle size={48} />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-2xl font-black text-slate-900 leading-tight uppercase tracking-tighter truncate">{staff.name}</h3>
                                    <p className="font-malayalam text-lg font-bold text-orange-600 mt-1 truncate">{staff.name_ml}</p>
                                </div>
                            </div>

                            <div className="space-y-5 relative z-10">
                                <div className="flex items-center gap-4 py-3 border-b border-slate-50">
                                    <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                                        <Phone size={16} />
                                    </div>
                                    <span className="text-xs font-black text-slate-600 tracking-widest uppercase">{staff.phone || 'NO CONTACT'}</span>
                                </div>
                                <div className="flex items-center gap-4 py-3 border-b border-slate-50">
                                    <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                                        <Clock size={16} />
                                    </div>
                                    <span className="text-xs font-black text-slate-600 tracking-widest uppercase">{staff.duty_timing || 'FLEXI SCHEDULE'}</span>
                                </div>

                                <div className="pt-6 flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Scale (Monthly)</p>
                                        <p className="text-2xl font-black text-slate-900 tabular-nums flex items-center gap-1">
                                            <span className="text-orange-600">₹</span>{parseFloat(staff.salary).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setEditingStaff(staff); setData(staff); setShowModal(true); }}
                                            className="p-3 bg-slate-50 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-2xl transition-all border border-transparent hover:border-orange-100"
                                            title="Edit Profile"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(staff.id)}
                                            className="p-3 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100"
                                            title="Delete Record"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Staff Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <form onSubmit={submit} className="bg-white rounded-[3rem] p-12 max-w-2xl w-full shadow-[0_40px_100px_rgba(0,0,0,0.2)] animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-12">
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                                    {editingStaff ? 'Modify Profile' : 'Enroll Clergy'}
                                </h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 italic">Legal Registry Entry</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all font-black"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Full Legal Name</label>
                                <input
                                    type="text"
                                    className="w-full rounded-2xl bg-slate-50 border-slate-100 p-5 font-black text-slate-900 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all placeholder:text-slate-300 uppercase tracking-tight"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="E.G. RAMAN NAMBOOTHIRI"
                                    required
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 italic">പേര് (MALAYALAM)</label>
                                <input
                                    type="text"
                                    className="w-full rounded-2xl bg-slate-50 border-slate-100 p-5 font-bold text-slate-900 font-malayalam focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all placeholder:text-slate-300"
                                    value={data.name_ml}
                                    onChange={e => setData('name_ml', e.target.value)}
                                    placeholder="മലയാളത്തിൽ ടൈപ്പ് ചെയ്യുക"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Ecclesiastical Designation</label>
                                <select
                                    className="w-full rounded-2xl bg-slate-50 border-slate-100 p-5 font-black text-slate-900 text-xs focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all cursor-pointer uppercase tracking-widest"
                                    value={data.role}
                                    onChange={e => setData('role', e.target.value)}
                                >
                                    <option value="Priest">Melsanthi (Head Priest)</option>
                                    <option value="Keezhsanthi">Keezhsanthi (Assistant Priest)</option>
                                    <option value="Staff">Administrative Staff</option>
                                    <option value="Kazhakam">Kazhakam</option>
                                    <option value="Security">Security / Watchman</option>
                                    <option value="Cleaner">Cleaning Staff</option>
                                </select>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Secure Contact</label>
                                <input
                                    type="text"
                                    className="w-full rounded-2xl bg-slate-50 border-slate-100 p-5 font-black text-slate-900 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all placeholder:text-slate-300 uppercase tracking-widest"
                                    value={data.phone}
                                    onChange={e => setData('phone', e.target.value)}
                                    placeholder="PRIMARY PHONE"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Approved Remuneration (₹)</label>
                                <div className="relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-500 font-black text-xl">₹</div>
                                    <input
                                        type="number"
                                        className="w-full pl-12 pr-6 py-5 bg-slate-50 border-slate-100 rounded-2xl font-black text-2xl text-slate-900 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all tabular-nums"
                                        value={data.salary}
                                        onChange={e => setData('salary', e.target.value)}
                                        placeholder="0"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Operational Windows</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 border-slate-100 rounded-2xl p-5 font-black text-slate-900 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all placeholder:text-slate-300 uppercase tracking-widest text-xs"
                                    value={data.duty_timing}
                                    onChange={e => setData('duty_timing', e.target.value)}
                                    placeholder="E.G. 5:00 AM - 1:00 PM"
                                />
                            </div>
                        </div>

                        <div className="mt-12 flex gap-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 bg-slate-900 text-white font-black py-6 rounded-3xl shadow-2xl transition-all scale-100 hover:scale-[1.02] active:scale-95 disabled:opacity-50 uppercase tracking-[0.3em] text-xs"
                            >
                                {processing ? 'Processing...' : (editingStaff ? 'Save Adjustments' : 'Enshrine Record')}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
