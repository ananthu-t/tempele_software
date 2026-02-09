<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $tables = [
            'users',
            'deities',
            'vazhipadus',
            'bookings',
            'donations',
            'assets',
            'asset_bookings',
            'inventory_items',
            'stock_logs',
            'ledgers',
            'staff'
        ];

        foreach ($tables as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->foreignId('temple_id')->after('id')->nullable()->constrained('temples')->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tables = [
            'users',
            'deities',
            'vazhipadus',
            'bookings',
            'donations',
            'assets',
            'asset_bookings',
            'inventory_items',
            'stock_logs',
            'ledgers',
            'staff'
        ];

        foreach ($tables as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->dropForeign(['temple_id']);
                $table->dropColumn('temple_id');
            });
        }
    }
};
