import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { History, User as UserIcon, Calendar, Activity, Zap } from 'lucide-react';
import ExportToolbar from '@/Components/ExportToolbar';
import { PageProps } from '@/types';

interface AuditLog {
    id: number;
    log_name: string;
    description: string;
    subject_type: string;
    event?: string;
    causer_id: number;
    properties: any;
    created_at: string;
    user?: {
        name: string;
    };
}

interface Props extends PageProps {
    logs: {
        data: AuditLog[];
        links: any[];
        total: number;
    };
}

export default function AuditLogs({ auth, logs }: Props) {
    const getEventColor = (event?: string) => {
        if (!event) return 'bg-slate-50 text-slate-600 border-slate-100';

        switch (event.toLowerCase()) {
            case 'created': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'updated': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'deleted': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center w-full">
                    <h2 className="font-black text-2xl text-slate-800 uppercase tracking-tighter">System Activity Logs</h2>
                    <ExportToolbar reportName="audit-logs" />
                </div>
            }
        >
            <Head title="Audit Logs" />

            <div className="space-y-8">
                {/* Stats Header */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6">
                        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                            <History size={32} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Lifetime Events</p>
                            <h4 className="text-3xl font-black text-slate-800">{logs.total || logs.data.length}</h4>
                        </div>
                    </div>
                </div>

                {/* Audit Timeline */}
                <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden">
                    <div className="p-10 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Activity className="text-orange-500" size={20} />
                            <h3 className="font-black text-sm uppercase tracking-widest text-slate-800">Activity Timeline</h3>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Events (Page 1)</span>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {logs.data.map((log) => (
                            <div key={log.id} className="p-10 hover:bg-slate-50 transition-all group">
                                <div className="flex items-start justify-between gap-8">
                                    <div className="flex items-start gap-6">
                                        <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 ${getEventColor(log.event)} shadow-sm transition-transform group-hover:scale-110`}>
                                            <Zap size={20} />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${getEventColor(log.event)}`}>
                                                    {log.event || 'General'}
                                                </span>
                                                <h4 className="font-black text-slate-800 uppercase tracking-tight text-lg">
                                                    {log.description}
                                                </h4>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-6">
                                                <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-600 transition-colors">
                                                    <UserIcon size={14} />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">{log.user?.name || 'System Auto'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <Calendar size={14} />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">{new Date(log.created_at).toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-orange-500/50">
                                                    <span className="text-[8px] font-black uppercase tracking-[0.3em]">ID: {log.id}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hidden lg:block">
                                        <pre className="text-[10px] font-medium text-slate-400 bg-slate-50 p-4 rounded-xl border border-slate-100 max-w-md overflow-x-auto whitespace-pre-wrap">
                                            {JSON.stringify(log.properties, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pagination Placeholder */}
                <div className="flex justify-center pb-10">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Scroll for historical entries</p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
