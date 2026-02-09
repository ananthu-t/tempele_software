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
        Schema::create('priest_duties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('temple_id')->constrained()->onDelete('cascade');
            $table->foreignId('staff_id')->constrained('staff')->onDelete('cascade');
            $table->date('duty_date');
            $table->string('shift');
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('priest_duties');
    }
};
