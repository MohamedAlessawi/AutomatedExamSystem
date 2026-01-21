<?php

namespace App\Repositories;

use Illuminate\Support\Facades\DB;

class StatsRepository
{
    /**
     * Global stats for assignments + scores.
     * $teacherId = null => admin (all)
     * $teacherId != null => teacher (only his exams)
     */
    public function studentsExamsStats(?int $teacherId, float $passMark = 60.0): array
    {

        $base = DB::table('exam_assignments as ea')
            ->join('exams as e', 'e.id', '=', 'ea.exam_id');

        if ($teacherId) {
            $base->where('e.teacher_id', $teacherId);
        }

        $totalAssignments = (clone $base)->count('ea.id');

        $submittedCount = (clone $base)->whereNotNull('ea.submitted_at')->count('ea.id');
        $notSubmittedCount = $totalAssignments - $submittedCount;

        $scoreAgg = (clone $base)
            ->whereNotNull('ea.submitted_at')
            ->selectRaw('AVG(ea.score) as avg_score, MIN(ea.score) as min_score, MAX(ea.score) as max_score')
            ->first();

        $avg = $scoreAgg?->avg_score !== null ? (float)$scoreAgg->avg_score : null;
        $min = $scoreAgg?->min_score !== null ? (float)$scoreAgg->min_score : null;
        $max = $scoreAgg?->max_score !== null ? (float)$scoreAgg->max_score : null;

        $passed = (clone $base)
            ->whereNotNull('ea.submitted_at')
            ->where('ea.score', '>=', $passMark)
            ->count('ea.id');

        $passRate = $submittedCount > 0 ? round($passed / $submittedCount, 4) : null;

        $distribution = (clone $base)
            ->whereNotNull('ea.submitted_at')
            ->selectRaw("
                SUM(CASE WHEN ea.score < 50 THEN 1 ELSE 0 END) as r_0_49,
                SUM(CASE WHEN ea.score >= 50 AND ea.score < 70 THEN 1 ELSE 0 END) as r_50_69,
                SUM(CASE WHEN ea.score >= 70 AND ea.score < 85 THEN 1 ELSE 0 END) as r_70_84,
                SUM(CASE WHEN ea.score >= 85 THEN 1 ELSE 0 END) as r_85_100
            ")
            ->first();

        return [
            'total_assignments' => $totalAssignments,
            'submitted' => $submittedCount,
            'not_submitted' => $notSubmittedCount,
            'avg_score' => $avg !== null ? round($avg, 2) : null,
            'min_score' => $min,
            'max_score' => $max,
            'pass_mark' => $passMark,
            'pass_rate' => $passRate,
            'score_distribution' => [
                '0_49' => (int)($distribution->r_0_49 ?? 0),
                '50_69' => (int)($distribution->r_50_69 ?? 0),
                '70_84' => (int)($distribution->r_70_84 ?? 0),
                '85_100' => (int)($distribution->r_85_100 ?? 0),
            ],
        ];
    }

    /**
     * Admin only: stats for a single student across all exams
     */
    public function studentExamsStats(int $studentId, float $passMark = 50.0): array
    {
        $base = DB::table('exam_assignments as ea')
            ->join('exams as e', 'e.id', '=', 'ea.exam_id')
            ->leftJoin('subjects as s', 's.id', '=', 'e.subject_id')
            ->where('ea.student_id', $studentId);

        $totalAssignments = (clone $base)->count('ea.id');
        $submittedCount = (clone $base)->whereNotNull('ea.submitted_at')->count('ea.id');
        $notSubmittedCount = $totalAssignments - $submittedCount;

        $scoreAgg = (clone $base)
            ->whereNotNull('ea.submitted_at')
            ->selectRaw('AVG(ea.score) as avg_score, MIN(ea.score) as min_score, MAX(ea.score) as max_score')
            ->first();

        $avg = $scoreAgg?->avg_score !== null ? (float)$scoreAgg->avg_score : null;
        $min = $scoreAgg?->min_score !== null ? (float)$scoreAgg->min_score : null;
        $max = $scoreAgg?->max_score !== null ? (float)$scoreAgg->max_score : null;

        $passed = (clone $base)
            ->whereNotNull('ea.submitted_at')
            ->where('ea.score', '>=', $passMark)
            ->count('ea.id');

        $passRate = $submittedCount > 0 ? round($passed / $submittedCount, 4) : null;

        $recent = (clone $base)
            ->whereNotNull('ea.submitted_at')
            ->orderByDesc('ea.submitted_at')
            ->limit(10)
            ->get([
                'ea.exam_id',
                'e.title as exam_title',
                'e.subject_id',
                's.name as subject_name',
                'ea.score',
                'ea.submitted_at',
            ]);

        return [
            'student_id' => $studentId,
            'total_assigned' => $totalAssignments,
            'submitted' => $submittedCount,
            'not_submitted' => $notSubmittedCount,
            'avg_score' => $avg !== null ? round($avg, 2) : null,
            'min_score' => $min,
            'max_score' => $max,
            'pass_mark' => $passMark,
            'pass_rate' => $passRate,
            'recent_exams' => $recent,
        ];
    }
}
