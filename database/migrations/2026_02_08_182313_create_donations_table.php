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
        Schema::create('donations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('devotee_id')->nullable()->constrained(); // Nullable for anonymous
            $table->foreignId('deity_id')->nullable()->constrained();
            $table->string('purpose')->nullable(); // Anna-danam, Construction, etc.
            $table->decimal('amount', 12, 2);
            $table->string('receipt_number')->unique();
            $table->string('payment_mode')->default('Cash');
            $table->string('payment_status')->default('Paid');
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
        Schema::dropIfExists('donations');
    }
};
