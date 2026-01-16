<?php

namespace App\Repositories;

use App\Models\ExamAssignment;

class ExamAssignmentRepository
{
    public function createMany(int $examId, array $studentIds)
    {
        $rows = [];
        foreach ($studentIds as $id) {
            $rows[] = [
                'exam_id'    => $examId,
                'student_id' => $id,
                'status'     => 'assigned',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        ExamAssignment::insert($rows);
    }

    public function forStudentCurrent(int $studentId)
    {
        return ExamAssignment::with('exam.subject')
            ->where('student_id', $studentId)
            ->where('status', 'assigned')
            ->get();
    }

    public function forStudentHistory(int $studentId)
    {
        return ExamAssignment::with('exam.subject')
            ->where('student_id', $studentId)
            ->whereIn('status', ['submitted', 'graded'])
            ->get();
    }

    public function findForStudent(int $assignmentId, int $studentId): ?ExamAssignment
    {
        return ExamAssignment::with(['exam.questions.options', 'answers'])
            ->where('id', $assignmentId)
            ->where('student_id', $studentId)
            ->first();
    }
}
