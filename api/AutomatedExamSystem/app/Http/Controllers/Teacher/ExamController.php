<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Services\Teacher\ExamService;
use Illuminate\Http\Request;

class ExamController extends Controller
{
    protected $service;

    public function __construct(ExamService $service)
    {
        $this->middleware(['auth:sanctum', 'role:teacher']);
        $this->service = $service;
    }

    // GET /api/teacher/exams
    public function index(Request $request)
    {
        return $this->service->listExamsForTeacher($request->user()->id);
    }

    // POST /api/teacher/exams
    public function store(Request $request)
    {
        $request->validate([
            'subject_id'       => 'required|integer|exists:subjects,id',
            'title'            => 'required|string|max:255',
            'description'      => 'nullable|string',
            'start_time'       => 'nullable|date',
            'end_time'         => 'nullable|date|after_or_equal:start_time',
            'duration_minutes' => 'nullable|integer|min:1',
            'question_ids'     => 'required|array|min:1',
            'question_ids.*'   => 'integer|exists:questions,id',
            'student_ids'      => 'nullable|array',
            'student_ids.*'    => 'integer|exists:users,id',
        ]);

        return $this->service->createExam($request, $request->user()->id);
    }

    // GET /api/teacher/exams/{id}
    public function show($id, Request $request)
    {
        return $this->service->getExamDetails((int)$id, $request->user()->id);
    }

    // PUT /api/teacher/exams/{id}
    public function update($id, Request $request)
    {
        $request->validate([
            'subject_id'       => 'nullable|integer|exists:subjects,id',
            'title'            => 'nullable|string|max:255',
            'description'      => 'nullable|string',
            'start_time'       => 'nullable|date',
            'end_time'         => 'nullable|date|after_or_equal:start_time',
            'duration_minutes' => 'nullable|integer|min:1',
            'question_ids'     => 'nullable|array|min:1',
            'question_ids.*'   => 'integer|exists:questions,id',
        ]);

        return $this->service->updateExam($request, $request->user()->id, (int)$id);
    }

    // DELETE /api/teacher/exams/{id}
    public function destroy($id, Request $request)
    {
        return $this->service->deleteExam($request->user()->id, (int)$id);
    }
}
