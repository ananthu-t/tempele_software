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
            if (!Schema::hasColumn('bookings', 'beneficiary_name')) {
                $table->string('beneficiary_name')->nullable();
            }
            if (!Schema::hasColumn('bookings', 'beneficiary_name_ml')) {
                $table->string('beneficiary_name_ml')->nullable();
            }
            if (!Schema::hasColumn('bookings', 'beneficiary_nakshatra')) {
                $table->string('beneficiary_nakshatra')->nullable();
            }
            if (!Schema::hasColumn('bookings', 'beneficiary_nakshatra_ml')) {
                $table->string('beneficiary_nakshatra_ml')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn([
                'beneficiary_name',
                'beneficiary_name_ml',
                'beneficiary_nakshatra',
                'beneficiary_nakshatra_ml'
            ]);
        });
    }
};
