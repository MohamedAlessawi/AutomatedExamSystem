<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exam_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')
                  ->constrained('exams')
                  ->cascadeOnDelete();
            $table->foreignId('student_id')
                  ->constrained('users')
                  ->cascadeOnDelete();
            $table->enum('status', ['assigned', 'in_progress', 'submitted', 'graded'])
                  ->default('assigned');
            $table->unsignedDecimal('score', 5, 2)->nullable();
            $table->dateTime('started_at')->nullable();
            $table->dateTime('submitted_at')->nullable();
            $table->timestamps();

            $table->unique(['exam_id', 'student_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exam_assignments');
    }
};
