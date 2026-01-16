<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\UserManagementService;
use Illuminate\Http\Request;

class UserController extends Controller
{
    protected $service;

    public function __construct(UserManagementService $service)
    {
        $this->middleware(['auth:sanctum', 'role:admin']);
        $this->service = $service;
    }

    // GET /api/admin/teachers
    public function indexTeachers()
    {
        return $this->service->listTeachers();
    }

    // GET /api/admin/students
    public function indexStudents()
    {
        return $this->service->listStudents();
    }

    // GET /api/admin/teachers/{id}
    public function showTeacher($id)
    {
        return $this->service->showTeacher((int)$id);
    }

    // GET /api/admin/students/{id}
    public function showStudent($id)
    {
        return $this->service->showStudent((int)$id);
    }

    // POST /api/admin/users  (teacher/student)
    public function store(Request $request)
    {
        return $this->service->createUser($request);
    }

    // PATCH /api/admin/users/{id}/toggle-active
    public function toggleActive($id)
    {
        return $this->service->toggleActive((int)$id);
    }
}
