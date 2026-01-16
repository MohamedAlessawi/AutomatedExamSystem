<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use App\Traits\ApiResponseTrait;

class SubjectController extends Controller
{
    use ApiResponseTrait;

    public function __construct()
    {
        // أي يوزر عامل login (admin, teacher, student) بيقدر يشوف المواد
        $this->middleware('auth:sanctum');
    }

    // GET /api/subjects
    public function index()
    {
        $subjects = Subject::all(['id', 'name', 'code']);
        return $this->unifiedResponse(true, 'Subjects list.', $subjects);
    }

    // GET /api/subjects/{id}
    public function show($id)
    {
        $subject = Subject::find($id);

        if (!$subject) {
            return $this->unifiedResponse(false, 'Subject not found.', [], [], 404);
        }

        return $this->unifiedResponse(true, 'Subject details.', $subject);
    }
}
