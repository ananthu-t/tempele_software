<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\VazhipaduController;
use App\Http\Controllers\VazhipaduCategoryController;
use App\Http\Controllers\VazhipaduRateController;
use App\Http\Controllers\FiscalYearController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\CounterController;
use App\Http\Controllers\ReceiptTemplateController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\DevoteeController;
use App\Http\Controllers\DeityController;
use App\Http\Controllers\TempleController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\AssetBookingController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\LedgerController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\PrintController;
use App\Http\Controllers\DistrictController;
use App\Http\Controllers\TalukController;
use App\Http\Controllers\PanchayatController;
use App\Http\Controllers\DevaswomController;
use App\Http\Controllers\ReceiptDataController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\ReminderController;
use App\Http\Controllers\QuickSaleController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Booking & Counter (Counter Staff / Admin)
    Route::middleware('can:create booking')->group(function () {
        Route::get('counter', [CounterController::class, 'index'])->name('counter.index');
        Route::get('counter/history', [CounterController::class, 'history'])->name('counter.history');
        Route::get('api/devotees/search', [CounterController::class, 'searchDevotees'])->name('api.devotees.search');
        Route::resource('bookings', BookingController::class);
        Route::resource('devotees', DevoteeController::class);
        Route::get('print/booking/{booking}', [PrintController::class, 'printBooking'])->name('print.booking');
        Route::get('api/receipt-data/booking/{booking}', [ReceiptDataController::class, 'getBookingData'])->name('api.receipt-data.booking');
    });

    // Financials & Accounting (Accountant / Admin)
    Route::middleware('can:manage accounting')->group(function () {
        Route::resource('accounts', AccountController::class);
        Route::resource('ledgers', LedgerController::class);
        Route::get('financial-reports', [LedgerController::class, 'report'])->name('ledgers.report');

        Route::middleware('can:view financial reports')->group(function () {
            Route::get('reports/trial-balance', [ReportController::class, 'trialBalance'])->name('reports.trial-balance');
            Route::get('reports/income-statement', [ReportController::class, 'incomeStatement'])->name('reports.income-statement');
            Route::get('reports/consolidated-collection', [ReportController::class, 'consolidatedCollection'])->name('reports.consolidated-collection');
        });
    });

    // Donations
    Route::middleware('can:manage donations')->group(function () {
        Route::resource('donations', DonationController::class);
        Route::get('print/donation/{donation}', [PrintController::class, 'printDonation'])->name('print.donation');
        Route::get('api/receipt-data/donation/{donation}', [ReceiptDataController::class, 'getDonationData'])->name('api.receipt-data.donation');
    });

    // Inventory
    Route::middleware('can:manage inventory')->group(function () {
        Route::get('inventory', [InventoryController::class, 'index'])->name('inventory.index');
        Route::post('inventory', [InventoryController::class, 'store'])->name('inventory.store');
        Route::post('inventory/{item}/stock', [InventoryController::class, 'updateStock'])->name('inventory.stock');
        Route::get('purchases', [PurchaseController::class, 'index'])->name('purchases.index');
        Route::post('purchases', [PurchaseController::class, 'store'])->name('purchases.store');
    });

    // Assets
    Route::middleware('can:manage assets')->group(function () {
        Route::resource('assets', AssetController::class);
        Route::resource('asset-bookings', AssetBookingController::class);
        Route::post('asset-bookings/{booking}/status', [AssetBookingController::class, 'updateStatus'])->name('asset-bookings.status');
    });

    // Staff & Users
    Route::middleware('can:manage staff')->group(function () {
        Route::resource('staff', StaffController::class);
    });

    Route::middleware('can:manage users')->group(function () {
        Route::resource('users', UserController::class);
    });

    // Master Setup (Admin only)
    Route::middleware('can:manage temple master')->group(function () {
        Route::resource('temples', TempleController::class);
        Route::resource('deities', DeityController::class);
        Route::resource('devaswoms', DevaswomController::class);
        Route::resource('districts', DistrictController::class);
        Route::resource('taluks', TalukController::class);
        Route::resource('panchayats', PanchayatController::class);
        Route::resource('fiscal-years', FiscalYearController::class);
        Route::get('settings', [SettingsController::class, 'index'])->name('settings.index');
        Route::post('settings', [SettingsController::class, 'update'])->name('settings.update');
        Route::resource('receipt-templates', ReceiptTemplateController::class)->except(['create', 'edit', 'show']);

        Route::middleware('can:audit records')->group(function () {
            Route::get('audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');
        });
    });

    // Vazhipadu Master Setup
    Route::middleware('can:manage vazhipadu')->group(function () {
        Route::resource('vazhipadus', VazhipaduController::class);
        Route::resource('vazhipadu-categories', VazhipaduCategoryController::class);
        Route::resource('vazhipadu-rates', VazhipaduRateController::class);
        Route::resource('receipt-templates', ReceiptTemplateController::class);
    });

    // Reminders & Quick Commerce
    Route::middleware(['can:manage inventory', 'can:manage bookings'])->group(function () {
        Route::get('/api/accounts', [AccountController::class, 'list'])->name('api.accounts.list');
        Route::get('/api/reminders', [ReminderController::class, 'getReminders'])->name('api.reminders');
        Route::post('/api/reminders/book/{pooja}', [ReminderController::class, 'book'])->name('api.reminders.book');

        Route::get('/api/quick-sale/search', [QuickSaleController::class, 'search'])->name('api.quick-sale.search');
        Route::post('/api/quick-sale', [QuickSaleController::class, 'store'])->name('api.quick-sale.store');
    });

    // Exports
    Route::get('exports/{type}/{report}', [ExportController::class, 'generate'])->name('exports.generate');

    // Public / Shared Verified Routes
    Route::get('verify/receipt', function (\Illuminate\Http\Request $request) {
        return "Receipt Verified: " . $request->get('id');
    })->name('verify.receipt')->middleware('signed');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
