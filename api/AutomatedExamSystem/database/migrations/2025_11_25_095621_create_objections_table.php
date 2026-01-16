<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('objections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_assignment_id')
                  ->constrained('exam_assignments')
                  ->cascadeOnDelete();
            $table->foreignId('student_id')
                  ->constrained('users')
                  ->cascadeOnDelete();
            $table->foreignId('teacher_id')
                  ->constrained('users')
                  ->cascadeOnDelete();
            $table->foreignId('question_id')
                  ->nullable()
                  ->constrained('questions')
                  ->nullOnDelete(); 
            $table->text('message');
            $table->enum('status', ['pending', 'accepted', 'rejected'])
                  ->default('pending');
            $table->text('teacher_response')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('objections');
    }
};
