import React, { useState, useEffect, useCallback } from 'react';
import {
    Bell,
    X,
    Zap,
    ShoppingCart,
    Package,
    Search,
    CheckCircle2,
    Printer,
    Plus,
    Minus,
    Trash2,
    Loader2,
    CalendarClock,
    Sparkles
} from 'lucide-react';
import axios from 'axios';
import { bluetoothPrinter } from '@/Services/BluetoothPrinterService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Item {
    id: number;
    name: string;
    unit: string;
    current_stock: number;
    sale_price?: number; // Added if available in DB, using unit_price as default
}

interface CartItem extends Item {
    quantity: number;
    unit_price: number;
}

interface RecurringPooja {
    id: number;
    devotee: { name: string; name_ml?: string };
    vazhipadu: { name: string; name_ml?: string; rate: string };
    deity: { name: string };
    beneficiary_name: string;
    next_due_date: string;
}

interface Props {
    accounts: { id: number; name: string; code: string }[];
}

export default function GlobalQuickAction() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'reminders' | 'sell'>('reminders');
    const [reminders, setReminders] = useState<{ due_poojas: RecurringPooja[], low_stock: any[] }>({ due_poojas: [], low_stock: [] });
    const [accounts, setAccounts] = useState<{ id: number; name: string; code: string }[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Item[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [accountID, setAccountID] = useState<number | ''>('');
    const [paymentMode, setPaymentMode] = useState('Cash');

    const fetchReminders = useCallback(async () => {
        setIsLoading(true);
        try {
            const [remRes, accRes] = await Promise.all([
                axios.get(route('api.reminders')),
                axios.get(route('api.accounts.list'))
            ]);
            setReminders(remRes.data);
            setAccounts(accRes.data);
            if (accRes.data.length > 0 && !accountID) {
                setAccountID(accRes.data[0].id);
            }
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setIsLoading(false);
        }
    }, [accountID]);

    useEffect(() => {
        if (isOpen) {
            fetchReminders();
        }
    }, [isOpen, fetchReminders]);

    const handleSearch = async (q: string) => {
        setSearchQuery(q);
        if (q.length < 2) {
            setSearchResults([]);
            return;
        }
        try {
            const response = await axios.get(route('api.quick-sale.search'), { params: { q } });
            setSearchResults(response.data);
        } catch (error) {
            console.error('Search failed', error);
        }
    };

    const addToCart = (item: Item) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1, unit_price: 10 }]; // Default 10 if no price
        });
        setSearchQuery('');
        setSearchResults([]);
    };

    const updateQuantity = (id: number, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(0.1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (id: number) => {
        setCart(prev => prev.filter(i => i.id !== id));
    };

    const handleBookPooja = async (pooja: RecurringPooja) => {
        setIsProcessing(true);
        try {
            const response = await axios.post(route('api.reminders.book', pooja.id));
            // Trigger Print
            const receiptData = await axios.get(route('api.receipt.booking', response.data.booking.id));
            await bluetoothPrinter.printReceipt(receiptData.data);

            // Refresh
            fetchReminders();
        } catch (error) {
            console.error('Booking failed', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleQuickSell = async () => {
        if (cart.length === 0) return;
        setIsProcessing(true);
        try {
            const total = cart.reduce((sum, i) => sum + (i.quantity * i.unit_price), 0);
            const response = await axios.post(route('api.quick-sale.store'), {
                items: cart.map(i => ({ id: i.id, quantity: i.quantity, unit_price: i.unit_price })),
                payment_mode: paymentMode,
                account_id: accountID,
                total_amount: total,
            });

            // Receipt? (If implementation exists)
            // await bluetoothPrinter.printReceipt(response.data.sale); 

            // Reset
            setCart([]);
            // setIsOpen(false); // Removed to allow rapid re-entry
            fetchReminders(); // Refresh in case stock levels changed
        } catch (error) {
            console.error('Sale failed', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);

    return (
        <>
            {/* Floating Trigger */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-10 right-10 z-[60] w-16 h-16 bg-slate-900 text-white rounded-full shadow-2xl shadow-slate-400 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-600 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                    <Zap className="group-hover:animate-pulse" size={28} />
                </div>
                {reminders.due_poojas.length > 0 && (
                    <span className="absolute top-3 right-3 w-4 h-4 bg-red-500 border-2 border-slate-900 rounded-full text-[8px] font-black flex items-center justify-center animate-bounce">
                        {reminders.due_poojas.length}
                    </span>
                )}
            </button>

            {/* Side Panel Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[70] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Side Panel */}
            <div className={cn(
                "fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-[-20px_0_60px_rgba(0,0,0,0.1)] z-[80] transform transition-transform duration-500 ease-in-out flex flex-col",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}>
                {/* Header */}
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Quick Operations</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 italic">Divine Efficiency Engine</p>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all shadow-sm"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex px-8 pt-6 gap-2">
                    <button
                        onClick={() => setActiveTab('reminders')}
                        className={cn(
                            "flex-1 py-4 px-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                            activeTab === 'reminders' ? "bg-slate-900 text-white shadow-xl shadow-slate-200" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                        )}
                    >
                        <Bell size={14} /> Due Poojas
                    </button>
                    <button
                        onClick={() => setActiveTab('sell')}
                        className={cn(
                            "flex-1 py-4 px-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                            activeTab === 'sell' ? "bg-slate-900 text-white shadow-xl shadow-slate-200" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                        )}
                    >
                        <ShoppingCart size={14} /> Quick Sell
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {activeTab === 'reminders' ? (
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <CalendarClock size={14} className="text-orange-500" /> Pending Obligations ({reminders.due_poojas.length})
                            </h3>
                            {reminders.due_poojas.length > 0 ? (
                                reminders.due_poojas.map(pooja => (
                                    <div key={pooja.id} className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm group hover:border-slate-300 transition-all">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <div className="font-black text-slate-900 uppercase tracking-tight text-sm">{pooja.vazhipadu.name}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{pooja.devotee.name} ({pooja.beneficiary_name})</div>
                                            </div>
                                            <div className="text-sm font-black text-orange-600">₹{pooja.vazhipadu.rate}</div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <button
                                                disabled={isProcessing}
                                                onClick={() => handleBookPooja(pooja)}
                                                className="flex-1 bg-slate-900 text-white font-black py-4 rounded-xl text-[9px] uppercase tracking-[0.2em] transition-all hover:bg-orange-600 active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                {isProcessing ? <Loader2 size={12} className="animate-spin" /> : <Printer size={12} />} Book & Print
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                                    <Sparkles size={48} className="mx-auto text-slate-200 mb-4" />
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Everything is in Divine Order</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Item Search */}
                            <div className="relative group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={18} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => handleSearch(e.target.value)}
                                    placeholder="SEARCH COMMODITY..."
                                    className="w-full bg-slate-50 border-none rounded-2xl py-5 pl-14 pr-6 font-black text-slate-900 uppercase tracking-wider text-[10px] focus:ring-2 focus:ring-slate-900/5 transition-all"
                                />
                                {searchResults.length > 0 && searchQuery && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-2xl border border-slate-100 z-50 overflow-hidden divide-y divide-slate-50">
                                        {searchResults.map(item => (
                                            <button
                                                key={item.id}
                                                onClick={() => addToCart(item)}
                                                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                                            >
                                                <div className="text-left">
                                                    <div className="font-black text-slate-900 uppercase tracking-tight text-[11px] group-hover:text-orange-600 transition-colors">{item.name}</div>
                                                    <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Stock Available: {item.current_stock} {item.unit}</div>
                                                </div>
                                                <Plus size={14} className="text-slate-300" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Cart */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-6">
                                    <Package size={14} /> Quick Basket ({cart.length})
                                </h3>
                                {cart.length > 0 ? (
                                    <>
                                        <div className="space-y-3">
                                            {cart.map(item => (
                                                <div key={item.id} className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between group">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-black text-slate-900 uppercase tracking-tight text-[11px] truncate">{item.name}</div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <input
                                                                type="number"
                                                                value={item.unit_price}
                                                                onChange={(e) => {
                                                                    const val = parseFloat(e.target.value) || 0;
                                                                    setCart(prev => prev.map(i => i.id === item.id ? { ...i, unit_price: val } : i));
                                                                }}
                                                                className="w-16 h-6 bg-white border-slate-100 rounded text-[9px] font-black text-emerald-600 focus:ring-0 p-1 text-center"
                                                            />
                                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">/ {item.unit}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center bg-white rounded-xl border border-slate-100 overflow-hidden">
                                                            <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-slate-50 text-slate-400"><Minus size={10} /></button>
                                                            <span className="w-8 text-center text-[10px] font-black text-slate-900 tabular-nums">{item.quantity}</span>
                                                            <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-slate-50 text-slate-400"><Plus size={10} /></button>
                                                        </div>
                                                        <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-10 p-6 bg-slate-900 rounded-[2rem] text-white shadow-xl shadow-slate-200">
                                            <div className="flex justify-between items-center mb-6">
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Total Value</p>
                                                <p className="text-2xl font-black tracking-tight tabular-nums">₹{cartTotal.toLocaleString()}</p>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <select
                                                        value={accountID}
                                                        onChange={e => setAccountID(parseInt(e.target.value))}
                                                        className="bg-white/5 border-white/10 rounded-xl text-[9px] font-black text-white p-3 uppercase tracking-widest focus:ring-1 focus:ring-orange-500"
                                                    >
                                                        {accounts.map(acc => <option key={acc.id} value={acc.id} className="text-slate-900">{acc.name}</option>)}
                                                    </select>
                                                    <select
                                                        value={paymentMode}
                                                        onChange={e => setPaymentMode(e.target.value)}
                                                        className="bg-white/5 border-white/10 rounded-xl text-[9px] font-black text-white p-3 uppercase tracking-widest focus:ring-1 focus:ring-orange-500"
                                                    >
                                                        <option value="Cash" className="text-slate-900">CASH</option>
                                                        <option value="UPI" className="text-slate-900">UPI</option>
                                                    </select>
                                                </div>
                                                <button
                                                    disabled={isProcessing}
                                                    onClick={handleQuickSell}
                                                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-5 rounded-2xl text-[10px] uppercase tracking-[0.3em] transition-all active:scale-95 shadow-xl shadow-orange-900/20 flex items-center justify-center gap-3"
                                                >
                                                    {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />} Enact Transaction
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                                        <Package size={48} className="mx-auto text-slate-200 mb-4" />
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Your Sacred Basket is Empty</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
