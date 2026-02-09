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
        Schema::create('stock_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inventory_item_id')->constrained();
            $table->enum('type', ['IN', 'OUT']);
            $table->decimal('quantity', 12, 3);
            $table->string('source_destination')->nullable(); // Supplier name or specific use
            $table->text('remarks')->nullable();
            $table->foreignId('user_id')->constrained(); // Staff who performed action
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_logs');
    }
};
