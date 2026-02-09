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
        Schema::table('donations', function (Blueprint $table) {
            $table->string('donor_name')->nullable()->after('deity_id');
            $table->string('phone')->nullable()->after('donor_name');
            $table->boolean('is_anonymous')->default(false)->after('phone');
            $table->date('donation_date')->nullable()->after('receipt_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('donations', function (Blueprint $table) {
            $table->dropColumn(['donor_name', 'phone', 'is_anonymous', 'donation_date']);
        });
    }
};
