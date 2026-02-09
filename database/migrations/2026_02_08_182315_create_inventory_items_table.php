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
        Schema::create('inventory_items', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('name_ml')->nullable();
            $table->string('category')->nullable(); // Oil, Flowers, Prasadam, etc.
            $table->string('unit')->default('Kg'); // Kg, Ltr, Nos
            $table->decimal('current_stock', 12, 3)->default(0);
            $table->decimal('low_stock_threshold', 12, 3)->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_items');
    }
};
