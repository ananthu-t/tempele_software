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
        Schema::create('staff', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('name_ml')->nullable();
            $table->string('role'); // Priest, Staff, Cleaner, etc.
            $table->string('phone')->nullable();
            $table->decimal('salary', 10, 2)->default(0);
            $table->string('status')->default('Active'); // Active, On Leave, Resigned
            $table->text('duty_timing')->nullable(); // JSON or text
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('staff');
    }
};
