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
        Schema::create('temple_details', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('name_ml')->nullable();
            $table->text('address')->nullable();
            $table->text('address_ml')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('registration_number')->nullable();
            $table->string('logo')->nullable();
            $table->string('website')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('temple_details');
    }
};
