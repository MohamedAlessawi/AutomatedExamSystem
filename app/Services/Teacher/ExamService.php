<?php

namespace App\Services\Teacher;

use App\Repositories\ExamRepository;
use App\Repositories\QuestionRepository;
use App\Repositories\ExamAssignmentRepository;
use App\Traits\ApiResponseTrait;
use Illuminate\Support\Facades\DB;
use Exception;

class ExamService
{
    use ApiResponseTrait;

    protected $examRepo;
    protected $questionRepo;
    protected $assignmentRepo;

    public function __construct(
        ExamRepository $examRepo,
        QuestionRepository $questionRepo,
        ExamAssignmentRepository $assignmentRepo
    ) {
        $this->examRepo       = $examRepo;
        $this->questionRepo   = $questionRepo;
        $this->assignmentRepo = $assignmentRepo;
    }

    public function createExam($request, $teacherId)
    {
        try {
            DB::beginTransaction();

            $exam = $this->examRepo->create([
                'teacher_id'       => $teacherId,
                'subject_id'       => $request->subject_id,
                'title'            => $request->title,
                'description'      => $request->description,
                'total_marks'      => 100,
                'start_time'       => $request->start_time,
                'end_time'         => $request->end_time,
                'duration_minutes' => $request->duration_minutes,
                'status'           => 'published',
            ]);

            $questionIds = $request->question_ids ?? [];
            if (!count($questionIds)) {
                throw new Exception('At least one question is required.');
            }

            $markPerQuestion = round(100 / count($questionIds), 2);

            foreach ($questionIds as $qid) {
                \App\Models\ExamQuestion::create([
                    'exam_id'    => $exam->id,
                    'question_id'=> $qid,
                    'mark'       => $markPerQuestion,
                ]);
            }

            $studentIds = $request->student_ids ?? [];
            if (count($studentIds)) {
                $this->assignmentRepo->createMany($exam->id, $studentIds);
            }

            DB::commit();

            $exam = $this->examRepo->findWithRelations($exam->id);

            return $this->unifiedResponse(true, 'Exam created successfully.', $exam, [], 201);
        } catch (Exception $e) {
            DB::rollBack();
            return $this->unifiedResponse(false, 'Failed to create exam.', [], [$e->getMessage()], 500);
        }
    }

    public function listExamsForTeacher($teacherId)
    {
        $exams = $this->examRepo->forTeacher($teacherId);
        return $this->unifiedResponse(true, 'Exams retrieved.', $exams);
    }

    public function getExamDetails($examId, $teacherId)
    {
        $exam = $this->examRepo->findWithRelations($examId);
        if (!$exam || $exam->teacher_id !== $teacherId) {
            return $this->unifiedResponse(false, 'Exam not found.', [], [], 404);
        }

        return $this->unifiedResponse(true, 'Exam details.', $exam);
    }


    public function updateExam($request, $teacherId, $examId)
    {
        try {
            DB::beginTransaction();

            $exam = \App\Models\Exam::with('examQuestions')->find($examId);

            if (!$exam || $exam->teacher_id !== $teacherId) {
                return $this->unifiedResponse(false, 'Exam not found.', [], [], 404);
            }

            $data = [
                'title'       => $request->title ?? $exam->title,
                'description' => $request->description ?? $exam->description,
            ];

            if ($request->filled('subject_id')) {
                $data['subject_id'] = $request->subject_id;
            }
            if ($request->filled('start_time')) {
                $data['start_time'] = $request->start_time;
            }
            if ($request->filled('end_time')) {
                $data['end_time'] = $request->end_time;
            }
            if ($request->filled('duration_minutes')) {
                $data['duration_minutes'] = $request->duration_minutes;
            }

            $exam->update($data);

            // لو بعت question_ids جديدة → نعيد ربط الأسئلة ونحسب العلامات
            if ($request->has('question_ids')) {
                $questionIds = $request->question_ids;
                if (!count($questionIds)) {
                    throw new \Exception('At least one question is required.');
                }

                \App\Models\ExamQuestion::where('exam_id', $exam->id)->delete();

                $markPerQuestion = round(100 / count($questionIds), 2);

                foreach ($questionIds as $qid) {
                    \App\Models\ExamQuestion::create([
                        'exam_id'    => $exam->id,
                        'question_id'=> $qid,
                        'mark'       => $markPerQuestion,
                    ]);
                }
            }

            DB::commit();

            $exam = $this->examRepo->findWithRelations($exam->id);

            return $this->unifiedResponse(true, 'Exam updated successfully.', $exam);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->unifiedResponse(false, 'Failed to update exam.', [], [$e->getMessage()], 500);
        }
    }

    public function deleteExam($teacherId, $examId)
    {
        try {
            $exam = \App\Models\Exam::find($examId);

            if (!$exam || $exam->teacher_id !== $teacherId) {
                return $this->unifiedResponse(false, 'Exam not found.', [], [], 404);
            }

            $exam->delete();

            return $this->unifiedResponse(true, 'Exam deleted successfully.', []);
        } catch (\Exception $e) {
            return $this->unifiedResponse(false, 'Failed to delete exam.', [], [$e->getMessage()], 500);
        }
    }

}
