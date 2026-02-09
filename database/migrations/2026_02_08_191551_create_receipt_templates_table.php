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
        Schema::create('receipt_templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('temple_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('type');
            $table->text('header_content')->nullable();
            $table->text('footer_content')->nullable();
            $table->json('layout_config')->nullable();
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('receipt_templates');
    }
};
