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
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${active
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-200'
                    : 'text-gray-500 hover:bg-orange-50 hover:text-orange-600'
                }`}
        >
            <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                {icon}
            </div>
            {!collapsed && (
                <span className={`font-bold text-sm tracking-wide transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}>
                    {title}
                </span>
            )}
            {active && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
            )}
        </Link>
    );
}
