import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    LayoutDashboard,
    Calendar,
    Users,
    HandCoins,
    TrendingUp,
    Clock,
    ArrowRight,
    Search,
    ChevronRight,
    Plus,
    Activity,
    CreditCard
} from 'lucide-react';

interface Stats {
    total_bookings: number;
    total_collection: number;
    total_devotees: number;
    vazhipadu_count: number;
}

interface Booking {
    id: number;
    devotee: { name: string; name_ml?: string };
    vazhipadu: { name: string; name_ml?: string };
    booking_date: string;
    net_amount: string;
    status: string;
}

export default function Dashboard({ auth, stats, recent_bookings }: PageProps & { stats: Stats, recent_bookings: Booking[] }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <h2 className="font-black text-3xl text-slate-900 tracking-tight">Temple Command Center</h2>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-1 italic">Real-time Analytics & Operations</p>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-12">

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <StatCard
                        title="Today's Bookings"
                        value={stats?.total_bookings || 0}
                        icon={<Calendar className="w-6 h-6 text-orange-600" />}
                        color="bg-orange-600 shadow-orange-100"
                        trend="+12% from yesterday"
                    />
                    <StatCard
                        title="Daily Collection"
                        value={`₹${parseFloat((stats?.total_collection || 0).toString()).toLocaleString('en-IN')}`}
                        icon={<TrendingUp className="w-6 h-6 text-emerald-600" />}
                        color="bg-emerald-600 shadow-emerald-100"
                        trend="On track for target"
                    />
                    <StatCard
                        title="Total Devotees"
                        value={stats.total_devotees}
                        icon={<Users className="w-6 h-6 text-blue-600" />}
                        color="bg-blue-600 shadow-blue-100"
                        trend="Active database"
                    />
                    <StatCard
                        title="Vazhipadu Master"
                        value={stats.vazhipadu_count}
                        icon={<HandCoins className="w-6 h-6 text-purple-600" />}
                        color="bg-purple-600 shadow-purple-100"
                        trend="Live catalog"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Recent Activities */}
                    <div className="lg:col-span-8 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
                        <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-2xl shadow-sm text-orange-500">
                                    <Activity size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 leading-tight">Live Booking Stream</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Most recent transactions</p>
                                </div>
                            </div>
                            <Link href="/bookings" className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:text-orange-600 hover:border-orange-200 transition-all flex items-center gap-2 uppercase tracking-widest shadow-sm">
                                View History <ChevronRight size={14} />
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#FCFDFF] text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                    <tr>
                                        <th className="px-10 py-5">Devotee Profile</th>
                                        <th className="px-10 py-5">Offerings (Vazhipadu)</th>
                                        <th className="px-10 py-5">Timestamp</th>
                                        <th className="px-10 py-5 text-right">Value</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {recent_bookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-slate-50/80 transition-all group">
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xs group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                                                        {booking.devotee.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-black text-slate-900">{booking.devotee.name}</div>
                                                        <div className="font-malayalam text-xs font-bold text-slate-400 mt-0.5">{booking.devotee.name_ml}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <div className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black bg-orange-50 text-orange-700 uppercase tracking-widest border border-orange-100">
                                                    {booking.vazhipadu.name}
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-xs font-bold text-slate-500 uppercase tracking-wider">{booking.booking_date}</td>
                                            <td className="px-10 py-6 text-sm font-black text-slate-900 text-right tabular-nums">₹{parseFloat(booking.net_amount).toLocaleString('en-IN')}</td>
                                        </tr>
                                    ))}
                                    {recent_bookings.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-10 py-24 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="p-6 bg-slate-50 rounded-full text-slate-200">
                                                        <LayoutDashboard size={64} />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-300 uppercase tracking-widest">No activities detected today</p>
                                                        <p className="text-xs text-slate-400 font-bold italic mt-1">Start by adding a new booking from the sidebar.</p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Side Sidebar - Quick Stats & Actions */}
                    <div className="lg:col-span-4 space-y-10">
                        {/* Action Card */}
                        <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-[2.5rem] p-10 text-white shadow-2xl shadow-slate-200 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700" />
                            <h3 className="text-3xl font-black mb-2 tracking-tight">Divine Efficiency</h3>
                            <p className="text-slate-400 text-sm font-medium mb-10 leading-relaxed italic">Manage every aspect of your temple with modern engineering.</p>

                            <div className="space-y-4">
                                <Link
                                    href="/bookings/create"
                                    className="flex items-center justify-between w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-5 px-8 rounded-2xl transition-all hover:scale-[1.02] shadow-xl shadow-orange-950/20 uppercase tracking-[0.2em] text-xs"
                                >
                                    New Booking <Plus size={20} />
                                </Link>
                                <Link
                                    href="/donations/create"
                                    className="flex items-center justify-between w-full bg-white/5 hover:bg-white/10 text-white font-black py-5 px-8 rounded-2xl transition-all border border-white/5 uppercase tracking-[0.2em] text-xs"
                                >
                                    Record Donation <CreditCard size={20} />
                                </Link>
                            </div>
                        </div>

                        {/* Additional Insight */}
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                            <h3 className="font-black text-xs uppercase tracking-[0.3em] text-slate-400 mb-8">System Intelligence</h3>
                            <div className="space-y-8">
                                <InsightItem title="Backup Status" status="Healthy" desc="Last synced 5m ago" color="text-emerald-500" />
                                <InsightItem title="Malayalam Font" status="Active" desc="Phonetic Ready" color="text-orange-500" />
                                <InsightItem title="Server Load" status="Minimal" desc="0.02ms latency" color="text-blue-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function StatCard({ title, value, icon, color, trend }: { title: string, value: string | number, icon: React.ReactNode, color: string, trend: string }) {
    return (
        <div className={`bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)] transition-all hover:scale-[1.02] active:scale-[0.98] group cursor-default relative overflow-hidden`}>
            {/* Background Hover Accent */}
            <div className={`absolute top-0 right-0 w-2 h-2 rounded-full ${color.split(' ')[0]} translate-x-1 -translate-y-1 opacity-10 group-hover:scale-[100] transition-transform duration-700`} />

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`p-4 bg-white border border-slate-50 rounded-2xl shadow-sm text-slate-900 group-hover:rotate-12 transition-all duration-500`}>
                    {icon}
                </div>
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{trend}</div>
            </div>
            <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
                <h4 className="text-4xl font-black text-slate-900 tracking-tighter">{value}</h4>
            </div>
        </div>
    );
}

function InsightItem({ title, status, desc, color }: { title: string, status: string, desc: string, color: string }) {
    return (
        <div className="flex items-center justify-between group cursor-help">
            <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${color.replace('text', 'bg')} animate-pulse`} />
                <div>
                    <p className="text-sm font-black text-slate-800">{title}</p>
                    <p className="text-[10px] font-bold text-slate-400 lowercase">{desc}</p>
                </div>
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-slate-50 rounded-lg ${color}`}>{status}</span>
        </div>
    );
}
