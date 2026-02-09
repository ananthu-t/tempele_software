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
        Schema::create('ledgers', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['Income', 'Expense'])->index();
            $table->string('category'); // Vazhipadu, Donation, Salary, Electricity, etc.
            $table->decimal('amount', 15, 2);
            $table->date('transaction_date')->index();
            $table->string('reference_type')->nullable(); // Booking, Donation, etc.
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->text('description')->nullable();
            $table->string('payment_mode')->default('Cash');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ledgers');
    }
};
