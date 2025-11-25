<?php

namespace App\Services;

use App\Repositories\ObjectionRepository;
use App\Traits\ApiResponseTrait;
use App\Models\ExamAssignment;
use Exception;

class ObjectionService
{
    use ApiResponseTrait;

    protected $objectionRepo;

    public function __construct(ObjectionRepository $objectionRepo)
    {
        $this->objectionRepo = $objectionRepo;
    }

    public function createObjection($request, $studentId)
    {
        try {
            $assignment = ExamAssignment::with('exam')->find($request->exam_assignment_id);
            if (!$assignment || $assignment->student_id !== $studentId) {
                return $this->unifiedResponse(false, 'Exam not found.', [], [], 404);
            }

            $objection = $this->objectionRepo->create([
                'exam_assignment_id' => $assignment->id,
                'student_id'         => $studentId,
                'teacher_id'         => $assignment->exam->teacher_id,
                'question_id'        => $request->question_id,
                'message'            => $request->message,
                'status'             => 'pending',
            ]);

            return $this->unifiedResponse(true, 'Objection created.', $objection, [], 201);
        } catch (Exception $e) {
            return $this->unifiedResponse(false, 'Failed to create objection.', [], [$e->getMessage()], 500);
        }
    }

    public function listForTeacher($teacherId)
    {
        $items = $this->objectionRepo->forTeacher($teacherId);
        return $this->unifiedResponse(true, 'Objections list.', $items);
    }

    public function respond($request, $teacherId, $objectionId)
    {
        $obj = \App\Models\Objection::find($objectionId);
        if (!$obj || $obj->teacher_id !== $teacherId) {
            return $this->unifiedResponse(false, 'Objection not found.', [], [], 404);
        }

        $obj = $this->objectionRepo->updateStatus($obj, $request->status, $request->teacher_response);

        return $this->unifiedResponse(true, 'Objection updated.', $obj);
    }
}
