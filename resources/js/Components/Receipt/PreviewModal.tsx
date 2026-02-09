import React from 'react';
import { X, Printer, Bluetooth, Download } from 'lucide-react';
import Modal from '@/Components/Modal';

interface ReceiptData {
    type: string;
    receipt_number: string;
    name: string;
    name_ml?: string;
    star?: string;
    star_ml?: string;
    amount: string | number;
    vazhipadu?: string;
    vazhipadu_ml?: string;
    purpose?: string;
    date: string;
    temple_name: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    data: ReceiptData | null;
    onBluetoothPrint?: () => void;
}

export default function BillPreviewModal({ isOpen, onClose, data, onBluetoothPrint }: Props) {
    if (!data) return null;

    const handleBrowserPrint = () => {
        window.print();
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="md">
            <div className="bg-slate-50 p-6 sm:p-10 relative overflow-hidden">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 bg-white rounded-xl text-slate-400 hover:text-slate-900 shadow-sm transition-all z-10"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center gap-2 mb-8">
                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                        <Printer size={24} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Receipt Preview</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic font-mono">Verify details before printing</p>
                </div>

                {/* Thermal Bill Look */}
                <div className="bg-white p-8 rounded-[1.5rem] shadow-xl border border-slate-200 relative font-mono text-slate-800">
                    {/* Decorative Zig-Zag edge top */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[radial-gradient(circle_at_2px_0,_#F1F5F9_2px,_transparent_0)] bg-[length:8px_4px] bg-repeat-x -translate-y-[2px]" />

                    <div className="text-center space-y-1 mb-6">
                        <h4 className="font-black text-lg uppercase leading-tight">{data.temple_name}</h4>
                        <p className="text-[10px] opacity-70">SREE DHARMA SASTHA TEMPLE</p>
                        <div className="border-b border-dashed border-slate-300 my-4" />
                    </div>

                    <div className="space-y-4 text-xs uppercase font-black tracking-tight">
                        <div className="flex justify-between">
                            <span className="opacity-50 font-sans tracking-widest text-[9px]">Receipt #</span>
                            <span>{data.receipt_number}</span>
                        </div>
                        <div className="flex justify-between border-b border-dotted border-slate-100 pb-2">
                            <span className="opacity-50 font-sans tracking-widest text-[9px]">Date</span>
                            <span>{data.date}</span>
                        </div>

                        <div className="space-y-1 pt-2">
                            <span className="opacity-50 font-sans tracking-widest text-[9px]">Devotee Profile</span>
                            <div className="text-sm">{data.name}</div>
                            {data.name_ml && <div className="font-semibold text-orange-600">{data.name_ml}</div>}
                        </div>

                        {data.star && (
                            <div className="space-y-1">
                                <span className="opacity-50 font-sans tracking-widest text-[9px]">Nakshatra/Star</span>
                                <div className="text-sm">{data.star}</div>
                                {data.star_ml && <div className="font-semibold text-orange-600">{data.star_ml}</div>}
                            </div>
                        )}

                        {data.type === 'Vazhipadu' ? (
                            <div className="space-y-1">
                                <span className="opacity-50 font-sans tracking-widest text-[9px]">Offering (Vazhipadu)</span>
                                <div className="text-sm">{data.vazhipadu}</div>
                                {data.vazhipadu_ml && <div className="font-bold text-slate-900 border-l-2 border-slate-900 pl-2">{data.vazhipadu_ml}</div>}
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <span className="opacity-50 font-sans tracking-widest text-[9px]">Donation Purpose</span>
                                <div className="text-sm">{data.purpose}</div>
                            </div>
                        )}

                        <div className="border-t-2 border-dashed border-slate-900 my-6 pt-6 flex justify-between items-center">
                            <span className="text-lg">TOTAL</span>
                            <span className="text-2xl font-black italic">₹{parseFloat(String(data.amount)).toLocaleString('en-IN')}</span>
                        </div>
                    </div>

                    <div className="text-center mt-8 space-y-2 opacity-50">
                        <p className="text-[8px] italic tracking-widest">DIGITALLY SIGNED SECURE RECEIPT</p>
                        <p className="text-[8px]">OM NAMAH SHIVAYA</p>
                    </div>

                    {/* Decorative Zig-Zag edge bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[radial-gradient(circle_at_2px_4px,_#F1F5F9_2px,_transparent_0)] bg-[length:8px_4px] bg-repeat-x translate-y-[2px]" />
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-4 mt-10 print:hidden">
                    <button
                        onClick={handleBrowserPrint}
                        className="flex items-center justify-center gap-3 px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                    >
                        <Download size={18} /> Browser Print
                    </button>
                    <button
                        onClick={onBluetoothPrint}
                        className="flex items-center justify-center gap-3 px-6 py-4 bg-orange-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-700 transition-all shadow-xl shadow-orange-100 active:scale-95"
                    >
                        <Bluetooth size={18} /> Bluetooth Print
                    </button>
                </div>
                <p className="text-center text-[9px] font-black text-slate-400 uppercase tracking-widest mt-6 opacity-50 uppercase">
                    Requires ESC/POS compatible Thermal Printer
                </p>
            </div>

            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .font-mono {
                        visibility: visible;
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    .font-mono * {
                        visibility: visible;
                    }
                }
            `}</style>
        </Modal>
    );
}
