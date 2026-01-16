<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Services\ObjectionService;
use Illuminate\Http\Request;

class ObjectionController extends Controller
{
    protected $service;

    public function __construct(ObjectionService $service)
    {
        $this->middleware(['auth:sanctum', 'role:student']);
        $this->service = $service;
    }

    public function store(Request $request)
    {
        $request->validate([
            'exam_assignment_id' => 'required|integer|exists:exam_assignments,id',
            'question_id'        => 'nullable|integer|exists:questions,id',
            'message'            => 'required|string',
        ]);

        return $this->service->createObjection($request, $request->user()->id);
    }
}
