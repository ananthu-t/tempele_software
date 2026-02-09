import React from 'react';
import { FileText, Table, Printer, Download } from 'lucide-react';

interface ExportToolbarProps {
    reportName: string;
    data?: any;
    onPrint?: () => void;
}

const ExportToolbar: React.FC<ExportToolbarProps> = ({ reportName, data, onPrint }) => {

    const handleExport = (type: 'pdf' | 'csv') => {
        // Construct export URL with current filters if needed
        const url = route('exports.generate', { type, report: reportName });
        window.open(url, '_blank');
    };

    const handlePrint = () => {
        if (onPrint) {
            onPrint();
        } else {
            window.print();
        }
    };

    return (
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-sm">
            <button
                onClick={() => handleExport('pdf')}
                className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all group relative"
                title="Export as PDF"
            >
                <FileText size={20} />
                <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black py-1 px-3 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none uppercase tracking-widest">
                    Save as PDF
                </span>
            </button>
            <button
                onClick={() => handleExport('csv')}
                className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all group relative"
                title="Export as Excel/CSV"
            >
                <Table size={20} />
                <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black py-1 px-3 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none uppercase tracking-widest">
                    Save as CSV
                </span>
            </button>
            <div className="w-px h-6 bg-slate-200 mx-1" />
            <button
                onClick={handlePrint}
                className="p-2.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all group relative"
                title="Print View"
            >
                <Printer size={20} />
                <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black py-1 px-3 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none uppercase tracking-widest">
                    Print Page
                </span>
            </button>
        </div>
    );
};

export default ExportToolbar;
