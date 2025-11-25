<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_assignment_id')
                  ->constrained('exam_assignments')
                  ->cascadeOnDelete();
            $table->foreignId('question_id')
                  ->constrained('questions')
                  ->cascadeOnDelete();
            $table->foreignId('selected_option_id')
                  ->nullable()
                  ->constrained('question_options')
                  ->nullOnDelete();
            $table->boolean('is_correct')->default(false);
            $table->unsignedDecimal('mark_obtained', 5, 2)->default(0);
            $table->timestamps();

            $table->unique(['exam_assignment_id', 'question_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_answers');
    }
};
