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
        Schema::create('purchases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('temple_id')->constrained()->onDelete('cascade');
            $table->string('vendor_name')->nullable();
            $table->string('bill_number')->nullable();
            $table->date('bill_date');
            $table->decimal('total_amount', 15, 2);
            $table->string('payment_mode');
            $table->foreignId('account_id')->constrained('accounts')->onDelete('cascade'); // Source of funds
            $table->foreignId('expense_account_id')->constrained('accounts')->onDelete('cascade'); // Debit head
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
        Schema::dropIfExists('purchases');
    }
};
