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
        Schema::rename('temple_details', 'temples');

        Schema::table('temples', function (Blueprint $table) {
            $table->foreignId('devaswom_id')->after('id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('district_id')->after('devaswom_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('taluk_id')->after('district_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('panchayat_id')->after('taluk_id')->nullable()->constrained()->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('temples', function (Blueprint $table) {
            $table->dropForeign(['devaswom_id']);
            $table->dropForeign(['district_id']);
            $table->dropForeign(['taluk_id']);
            $table->dropForeign(['panchayat_id']);
            $table->dropColumn(['devaswom_id', 'district_id', 'taluk_id', 'panchayat_id']);
        });

        Schema::rename('temples', 'temple_details');
    }
};
