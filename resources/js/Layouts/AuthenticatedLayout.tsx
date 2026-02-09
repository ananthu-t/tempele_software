import { useState, PropsWithChildren, ReactNode } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import SidebarItem from '@/Components/SidebarItem';
import { Link, usePage } from '@inertiajs/react';
import { User } from '@/types';
import {
    LayoutDashboard,
    Users,
    CalendarCheck,
    HandHeart,
    BookOpen,
    BarChart3,
    Warehouse,
    Package,
    UsersRound,
    Settings,
    Flame,
    Sparkles,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    LogOut,
    User as UserIcon,
    Bell
} from 'lucide-react';

export default function Authenticated({ user, header, children }: PropsWithChildren<{ user: User, header?: ReactNode }>) {
    const { url } = usePage();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navGroups = [
        {
            label: 'Main',
            items: [
                { title: 'Dashboard', href: route('dashboard'), icon: <LayoutDashboard size={20} />, id: 'dashboard' },
                { title: 'Devotee Database', href: route('devotees.index'), icon: <Users size={20} />, id: 'devotees' },
                { title: 'Vazhipadu Booking', href: route('bookings.index'), icon: <CalendarCheck size={20} />, id: 'bookings' },
                { title: 'Counter Interface', href: route('counter.index'), icon: <Menu size={20} />, id: 'counter' },
            ]
        },
        {
            label: 'Financials',
            items: [
                { title: 'Donations', href: route('donations.index'), icon: <HandHeart size={20} />, id: 'donations' },
                { title: 'Daily Ledger', href: route('ledgers.index'), icon: <BookOpen size={20} />, id: 'ledgers' },
                { title: 'Trial Balance', href: route('reports.trial-balance'), icon: <BarChart3 size={20} />, id: 'trial-balance' },
                { title: 'Income Statement', href: route('reports.income-statement'), icon: <BarChart3 size={20} />, id: 'income-statement' },
            ]
        },
        {
            label: 'Management',
            items: [
                { title: 'Halls & Assets', href: route('assets.index'), icon: <Warehouse size={20} />, id: 'assets' },
                { title: 'Inventory & Store', href: route('inventory.index'), icon: <Package size={20} />, id: 'inventory' },
                { title: 'Staff & Priests', href: route('staff.index'), icon: <UsersRound size={20} />, id: 'staff' },
            ]
        },
        {
            label: 'Master Setup',
            items: [
                { title: 'Temple Master', href: route('temples.index'), icon: <Settings size={20} />, id: 'temple' },
                { title: 'Deity Master', href: route('deities.index'), icon: <Flame size={20} />, id: 'deities' },
                { title: 'Vazhipadu Master', href: route('vazhipadus.index'), icon: <Sparkles size={20} />, id: 'vazhipadus' },
                { title: 'Vazhipadu Categories', href: route('vazhipadu-categories.index'), icon: <Sparkles size={20} />, id: 'categories' },
                { title: 'Vazhipadu Rates', href: route('vazhipadu-rates.index'), icon: <Sparkles size={20} />, id: 'rates' },
                { title: 'Receipt Templates', href: route('receipt-templates.index'), icon: <Settings size={20} />, id: 'receipt-templates' },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased text-slate-900">
            {/* Sidebar Shell */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 transition-all duration-500 ease-in-out lg:static lg:block shadow-[0_0_40px_rgba(0,0,0,0.02)]
                    ${collapsed ? 'w-20' : 'w-72'} 
                    ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Logo Section */}
                <div className={`h-24 flex items-center px-6 mb-4 ${collapsed ? 'justify-center' : 'justify-start'}`}>
                    <Link href="/dashboard" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-tr from-orange-600 to-amber-400 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-100 group-hover:rotate-12 transition-transform duration-500">
                            <ApplicationLogo className="w-6 h-6 fill-white" />
                        </div>
                        {!collapsed && (
                            <div className="flex flex-col">
                                <span className="font-black text-xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 uppercase">Temple ERP</span>
                                <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] leading-none">Management System</span>
                            </div>
                        )}
                    </Link>
                </div>

                {/* Nav Groups */}
                <div className="px-4 space-y-8 overflow-y-auto max-h-[calc(100vh-180px)] custom-scrollbar pb-10">
                    {navGroups.map((group, gIdx) => (
                        <div key={gIdx} className="space-y-2">
                            {!collapsed && (
                                <h3 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">{group.label}</h3>
                            )}
                            {group.items.map((item, iIdx) => (
                                <SidebarItem
                                    key={iIdx}
                                    href={item.href}
                                    icon={item.icon}
                                    title={item.title}
                                    active={url === item.href || url.startsWith(item.href + '/')}
                                    collapsed={collapsed}
                                />
                            ))}
                        </div>
                    ))}
                </div>

                {/* User Section at Bottom */}
                <div className="absolute bottom-6 left-0 right-0 px-4">
                    <div className={`bg-slate-50 border border-slate-200 p-3 rounded-2xl flex items-center gap-3 transition-all duration-300 ${collapsed ? 'justify-center' : 'justify-start'}`}>
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm shrink-0">
                            <UserIcon size={20} />
                        </div>
                        {!collapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-black text-slate-800 truncate">{user.name}</p>
                                <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-wider">Administrator</p>
                            </div>
                        )}
                        {!collapsed && (
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                            >
                                <LogOut size={18} />
                            </Link>
                        )}
                    </div>
                </div>

                {/* Desktop Collapse Toggle */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="hidden lg:flex absolute -right-4 top-10 w-8 h-8 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-400 hover:text-orange-600 shadow-lg hover:shadow-orange-100 transition-all z-50 group"
                >
                    {collapsed ? <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" /> : <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />}
                </button>
            </aside>

            {/* Backdrop for mobile */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-all duration-500"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header Navbar */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between z-30 sticky top-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="p-2 lg:hidden text-slate-500 hover:text-slate-900"
                        >
                            <Menu size={24} />
                        </button>
                        {header}
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-slate-500 group cursor-pointer border border-transparent hover:border-slate-200 transition-all">
                            <span className="text-xs font-bold uppercase tracking-widest bg-white px-2 py-0.5 rounded shadow-sm">CTRL + K</span>
                            <span className="text-sm font-medium">Quick Search...</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="p-2.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all relative">
                                <Bell size={20} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                            </button>
                            <div className="h-8 w-px bg-slate-200" />
                            <Link href={route('profile.edit')} className="flex items-center gap-3 pl-2 group">
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs font-black text-slate-800 group-hover:text-orange-600 transition-colors uppercase tracking-wider">{user.name}</p>
                                    <p className="text-[10px] font-bold text-slate-400 group-hover:text-slate-500 transition-colors uppercase tracking-[0.2em]">{user.email}</p>
                                </div>
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm group-hover:scale-105 transition-all">
                                    <UserIcon size={20} />
                                </div>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-12 bg-[#F8FAFC]">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {children}
                    </div>
                </main>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E2E8F0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #CBD5E1;
                }
            `}</style>
        </div>
    );
}
