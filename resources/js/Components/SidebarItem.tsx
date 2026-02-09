import { Link } from '@inertiajs/react';
import { ReactNode } from 'react';

interface SidebarItemProps {
    href: string;
    icon: ReactNode;
    title: string;
    active: boolean;
    collapsed?: boolean;
}

export default function SidebarItem({ href, icon, title, active, collapsed }: SidebarItemProps) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-5 py-4 rounded-[1.5rem] transition-all duration-300 group relative ${active
                ? 'bg-slate-900 text-white shadow-2xl shadow-slate-200'
                : 'text-slate-500 hover:bg-orange-50 hover:text-orange-600'
                }`}
        >
            {active && (
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-500 rounded-[1.5rem] opacity-10 blur-xl -z-10" />
            )}
            <div className={`transition-all duration-500 ${active ? 'scale-110 text-orange-500' : 'group-hover:scale-110 group-hover:text-orange-600'}`}>
                {icon}
            </div>
            {!collapsed && (
                <span className={`font-black text-[11px] uppercase tracking-[0.15em] transition-all duration-300 ${active ? 'opacity-100 translate-x-1' : 'opacity-70 group-hover:opacity-100 group-hover:translate-x-1'}`}>
                    {title}
                </span>
            )}
            {active && !collapsed && (
                <div className="ml-auto flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)] animate-pulse" />
                    <div className="w-1 h-8 bg-orange-500/20 rounded-full" />
                </div>
            )}
        </Link>
    );
}
