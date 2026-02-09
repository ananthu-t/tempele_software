import React from 'react';
import { X, Command, Keyboard } from 'lucide-react';

interface ShortcutHelperProps {
    isOpen: boolean;
    onClose: () => void;
}

const ShortcutHelper: React.FC<ShortcutHelperProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const shortcuts = [
        { keys: ['Alt', 'D'], label: 'Dashboard' },
        { keys: ['Alt', 'C'], label: 'Counter Interface' },
        { keys: ['Alt', 'B'], label: 'Vazhipadu Bookings' },
        { keys: ['Alt', 'L'], label: 'Daily Ledger' },
        { keys: ['Alt', 'I'], label: 'Inventory & Store' },
        { keys: ['Alt', 'F'], label: 'Toggle Fullscreen' },
        { keys: ['Shift', '?'], label: 'Show/Hide Help' },
    ];

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="bg-slate-900 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                            <Keyboard size={20} />
                        </div>
                        <div>
                            <h2 className="text-white font-black uppercase tracking-widest text-sm">System Shortcuts</h2>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Quick Access Commands</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 space-y-4">
                    {shortcuts.map((s, idx) => (
                        <div key={idx} className="flex items-center justify-between group">
                            <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-tight">{s.label}</span>
                            <div className="flex items-center gap-1.5">
                                {s.keys.map((key, kIdx) => (
                                    <React.Fragment key={kIdx}>
                                        <kbd className="min-w-[2.5rem] h-8 flex items-center justify-center px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-black text-slate-500 shadow-sm uppercase">
                                            {key}
                                        </kbd>
                                        {kIdx < s.keys.length - 1 && <span className="text-slate-300 font-bold">+</span>}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Efficiency is the soul of performance</p>
                </div>
            </div>
        </div>
    );
};

export default ShortcutHelper;
