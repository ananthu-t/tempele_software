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
        Schema::create('vazhipadu_dependencies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vazhipadu_id')->constrained()->onDelete('cascade');
            $table->foreignId('required_vazhipadu_id')->constrained('vazhipadus')->onDelete('cascade');
            $table->integer('required_quantity')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vazhipadu_dependencies');
    }
};
