<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Services\Teacher\StudentService;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    protected $service;

    public function __construct(StudentService $service)
    {
        $this->middleware(['auth:sanctum', 'role:teacher']);
        $this->service = $service;
    }

    // GET /api/teacher/students
    public function index()
    {
        return $this->service->listStudents();
    }

    // GET /api/teacher/students/{id}
    public function show($id)
    {
        return $this->service->showStudent((int)$id);
    }
}
