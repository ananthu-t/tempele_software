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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('devotee_id')->constrained();
            $table->foreignId('vazhipadu_id')->constrained();
            $table->foreignId('deity_id')->constrained();
            $table->date('booking_date')->index();
            $table->time('booking_time')->nullable();
            $table->decimal('rate', 10, 2);
            $table->string('receipt_number')->unique();
            $table->decimal('total_amount', 10, 2);
            $table->decimal('discount', 10, 2)->default(0);
            $table->decimal('net_amount', 10, 2);
            $table->string('payment_mode')->default('Cash'); // Cash, UPI, Card, Bank
            $table->string('payment_status')->default('Paid'); // Paid, Pending, Refunded
            $table->string('status')->default('Confirmed'); // Confirmed, Cancelled, Completed
            $table->text('remarks')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
