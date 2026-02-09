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
        Schema::create('vazhipadu_rates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vazhipadu_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 10, 2);
            $table->date('effective_from');
            $table->date('effective_to')->nullable();
            $table->string('rule_type')->default('base'); // base, festival, star, etc.
            $table->json('rule_config')->nullable(); // For complex logic storage
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vazhipadu_rates');
    }
};
