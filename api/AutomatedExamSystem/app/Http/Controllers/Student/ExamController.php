<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Services\Student\ExamService;
use Illuminate\Http\Request;

class ExamController extends Controller
{
    protected $service;

    public function __construct(ExamService $service)
    {
        $this->middleware(['auth:sanctum', 'role:student']);
        $this->service = $service;
    }

    public function current(Request $request)
    {
        return $this->service->listCurrentExams($request->user()->id);
    }

    public function history(Request $request)
    {
        return $this->service->listHistory($request->user()->id);
    }

    public function show($assignmentId, Request $request)
    {
        return $this->service->getExamForStudent((int)$assignmentId, $request->user()->id);
    }

    public function submit(Request $request)
    {
        $request->validate([
            'exam_assignment_id'    => 'required|integer|exists:exam_assignments,id',
            'answers'               => 'required|array|min:1',
            'answers.*.question_id' => 'required|integer|exists:questions,id',
            'answers.*.selected_option_id' => 'required|integer|exists:question_options,id',
        ]);

        return $this->service->submitAnswers($request, $request->user()->id);
    }
}
