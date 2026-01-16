<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Services\ObjectionService;
use Illuminate\Http\Request;

class ObjectionController extends Controller
{
    protected $service;

    public function __construct(ObjectionService $service)
    {
        $this->middleware(['auth:sanctum', 'role:teacher']);
        $this->service = $service;
    }

    public function index(Request $request)
    {
        return $this->service->listForTeacher($request->user()->id);
    }

    public function update($id, Request $request)
    {
        $request->validate([
            'status'           => 'required|in:pending,accepted,rejected',
            'teacher_response' => 'nullable|string',
        ]);

        return $this->service->respond($request, $request->user()->id, (int)$id);
    }
}
