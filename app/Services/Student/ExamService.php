<?php

namespace App\Services\Student;

use App\Repositories\ExamAssignmentRepository;
use App\Repositories\StudentAnswerRepository;
use App\Traits\ApiResponseTrait;
use Illuminate\Support\Facades\DB;
use Exception;

class ExamService
{
    use ApiResponseTrait;

    protected $assignmentRepo;
    protected $answerRepo;

    public function __construct(
        ExamAssignmentRepository $assignmentRepo,
        StudentAnswerRepository $answerRepo
    ) {
        $this->assignmentRepo = $assignmentRepo;
        $this->answerRepo     = $answerRepo;
    }

    public function listCurrentExams($studentId)
    {
        $assignments = $this->assignmentRepo->forStudentCurrent($studentId);
        return $this->unifiedResponse(true, 'Current exams.', $assignments);
    }

    public function listHistory($studentId)
    {
        $assignments = $this->assignmentRepo->forStudentHistory($studentId);
        return $this->unifiedResponse(true, 'Exams history.', $assignments);
    }

    public function getExamForStudent($assignmentId, $studentId)
    {
        $assignment = $this->assignmentRepo->findForStudent($assignmentId, $studentId);
        if (!$assignment) {
            return $this->unifiedResponse(false, 'Exam not found.', [], [], 404);
        }

        return $this->unifiedResponse(true, 'Exam details.', $assignment);
    }

    public function submitAnswers($request, $studentId)
    {
        try {
            DB::beginTransaction();

            $assignmentId = $request->exam_assignment_id;
            $assignment   = $this->assignmentRepo->findForStudent($assignmentId, $studentId);

            if (!$assignment) {
                return $this->unifiedResponse(false, 'Exam assignment not found.', [], [], 404);
            }

            if (in_array($assignment->status, ['submitted', 'graded'])) {
                return $this->unifiedResponse(false, 'Exam already submitted.', [], [], 400);
            }

            $totalScore = 0;
            $answers    = $request->answers ?? [];

            $examQuestions = $assignment->exam->examQuestions->keyBy('question_id');

            foreach ($answers as $ans) {
                $qid  = $ans['question_id'];
                $optId= $ans['selected_option_id'] ?? null;

                $eq = $examQuestions->get($qid);
                if (!$eq) {
                    continue;
                }

                $question = $eq->question()->with('options')->first();
                $correctOption = $question->options->firstWhere('is_correct', true);

                $isCorrect = $correctOption && $correctOption->id == $optId;
                $mark      = $isCorrect ? $eq->mark : 0;

                $this->answerRepo->create([
                    'exam_assignment_id' => $assignment->id,
                    'question_id'        => $qid,
                    'selected_option_id' => $optId,
                    'is_correct'         => $isCorrect,
                    'mark_obtained'      => $mark,
                ]);

                $totalScore += $mark;
            }

            $assignment->score       = $totalScore;
            $assignment->status      = 'graded';
            $assignment->submitted_at= now();
            $assignment->save();

            DB::commit();

            return $this->unifiedResponse(true, 'Answers submitted successfully.', [
                'score' => $totalScore,
            ], [], 200);

        } catch (Exception $e) {
            DB::rollBack();
            return $this->unifiedResponse(false, 'Failed to submit answers.', [], [$e->getMessage()], 500);
        }
    }
}
