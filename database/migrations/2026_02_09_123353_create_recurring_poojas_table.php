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
        Schema::create('recurring_poojas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('temple_id')->constrained()->onDelete('cascade');
            $table->foreignId('devotee_id')->constrained()->onDelete('cascade');
            $table->foreignId('vazhipadu_id')->constrained()->onDelete('cascade');
            $table->foreignId('deity_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('beneficiary_name')->nullable();

            $table->enum('frequency', ['Daily', 'Monthly', 'Yearly', 'Custom']);
            $table->integer('day_of_month')->nullable(); // 1-31
            $table->integer('month_of_year')->nullable(); // 1-12
            $table->string('malayalam_month')->nullable(); // For future lunar logic
            $table->string('malayalam_star')->nullable();

            $table->date('start_date');
            $table->date('last_booked_date')->nullable();
            $table->date('next_due_date')->index();
            $table->boolean('is_active')->default(true);

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recurring_poojas');
    }
};
