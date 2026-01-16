<?php

namespace App\Repositories;

use App\Models\Exam;

class ExamRepository
{
    public function create(array $data): Exam
    {
        return Exam::create($data);
    }

    public function findWithRelations(int $id): ?Exam
    {
        return Exam::with(['subject', 'teacher', 'questions.options'])->find($id);
    }

    public function forTeacher(int $teacherId)
    {
        return Exam::where('teacher_id', $teacherId)->withCount('assignments')->get();
    }

    public function update($id, array $data): Exam
    {
        $exam = Exam::findOrFail($id);
        $exam->update($data);
        return $exam;
    }

    public function delete($id): bool
    {
        $exam = Exam::findOrFail($id);
        return (bool) $exam->delete();
    }
}
