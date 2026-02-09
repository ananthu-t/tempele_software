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
        Schema::table('temples', function (Blueprint $table) {
            $table->string('printer_id')->nullable()->after('website');
            $table->string('printer_type')->default('USB')->after('printer_id'); // USB, Bluetooth, Network
            $table->string('paper_size')->default('58mm')->after('printer_type'); // 58mm, 80mm
            $table->text('receipt_header')->nullable()->after('paper_size');
            $table->text('receipt_footer')->nullable()->after('receipt_header');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('temples', function (Blueprint $table) {
            $table->dropColumn(['printer_id', 'printer_type', 'paper_size', 'receipt_header', 'receipt_footer']);
        });
    }
};
