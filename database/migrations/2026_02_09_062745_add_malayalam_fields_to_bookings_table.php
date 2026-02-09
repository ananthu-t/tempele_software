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
        Schema::table('bookings', function (Blueprint $table) {
            if (!Schema::hasColumn('bookings', 'beneficiary_name_ml')) {
                $table->string('beneficiary_name_ml')->nullable()->after('beneficiary_name');
            }
            if (!Schema::hasColumn('bookings', 'beneficiary_nakshatra_ml')) {
                $table->string('beneficiary_nakshatra_ml')->nullable()->after('beneficiary_nakshatra');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn(['beneficiary_name_ml', 'beneficiary_nakshatra_ml']);
        });
    }
};
