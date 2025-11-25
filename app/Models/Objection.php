<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Objection extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_assignment_id',
        'student_id',
        'teacher_id',
        'question_id',
        'message',
        'status',
        'teacher_response',
    ];

    public function examAssignment(): BelongsTo
    {
        return $this->belongsTo(ExamAssignment::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }
}
