<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_bank_id')
                  ->constrained('question_banks')
                  ->cascadeOnDelete();
            $table->foreignId('subject_id')
                  ->constrained('subjects')
                  ->cascadeOnDelete();
            $table->enum('question_type', ['mcq', 'true_false']);
            $table->text('question_text');
            $table->unsignedInteger('difficulty_level')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
