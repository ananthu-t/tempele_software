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

Route::get('counter', [CounterController::class, 'index'])->name('counter.index');
Route::get('api/devotees/search', [CounterController::class, 'searchDevotees'])->name('api.devotees.search');

Route::middleware('auth')->group(function () {
    Route::resource('vazhipadu-categories', VazhipaduCategoryController::class);
    Route::resource('vazhipadu-rates', VazhipaduRateController::class);
    Route::resource('fiscal-years', FiscalYearController::class);
    Route::resource('accounts', AccountController::class);

    Route::get('reports/trial-balance', [ReportController::class, 'trialBalance'])->name('reports.trial-balance');
    Route::get('reports/income-statement', [ReportController::class, 'incomeStatement'])->name('reports.income-statement');
    Route::get('reports/consolidated-collection', [ReportController::class, 'consolidatedCollection'])->name('reports.consolidated-collection');

    Route::resource('receipt-templates', ReceiptTemplateController::class);
    Route::get('verify/receipt', function (\Illuminate\Http\Request $request) {
        return "Receipt Verified: " . $request->get('id');
    })->name('verify.receipt')->middleware('signed');

    Route::resource('vazhipadus', VazhipaduController::class);
    Route::resource('bookings', BookingController::class);
    Route::resource('devotees', DevoteeController::class);
    Route::resource('deities', DeityController::class);
    Route::resource('temples', TempleController::class);
    Route::resource('devaswoms', DevaswomController::class);
    Route::resource('districts', DistrictController::class);
    Route::resource('taluks', TalukController::class);
    Route::resource('panchayats', PanchayatController::class);

    // Alias for legacy compatibility if needed
    Route::get('temple-settings', [TempleController::class, 'index'])->name('temple.settings');
    Route::resource('donations', DonationController::class);
    Route::resource('assets', AssetController::class);
    Route::resource('inventory', InventoryController::class);
    Route::post('inventory/{item}/stock', [InventoryController::class, 'updateStock'])->name('inventory.stock');
    Route::resource('ledgers', LedgerController::class);
    Route::get('financial-reports', [LedgerController::class, 'report'])->name('ledgers.report');
    Route::resource('staff', StaffController::class);
    Route::get('print/donation/{donation}', [PrintController::class, 'printDonation'])->name('print.donation');
    Route::get('print/booking/{booking}', [PrintController::class, 'printBooking'])->name('print.booking');

    Route::get('api/receipt-data/booking/{booking}', [ReceiptDataController::class, 'getBookingData'])->name('api.receipt-data.booking');
    Route::get('api/receipt-data/donation/{donation}', [ReceiptDataController::class, 'getDonationData'])->name('api.receipt-data.donation');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
