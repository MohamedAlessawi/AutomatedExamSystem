<?php

namespace App\Services\Teacher;

use App\Repositories\UserRepository;
use App\Traits\ApiResponseTrait;

class StudentService
{
    use ApiResponseTrait;

    protected $userRepo;

    public function __construct(UserRepository $userRepo)
    {
        $this->userRepo = $userRepo;
    }

    public function listStudents()
    {
        $students = $this->userRepo->getByRole('student');

        return $this->unifiedResponse(true, 'Students list.', $students);
    }

    public function showStudent(int $id)
    {
        $student = $this->userRepo->findByIdAndRole($id, 'student');

        if (!$student) {
            return $this->unifiedResponse(false, 'Student not found.', [], [], 404);
        }

        return $this->unifiedResponse(true, 'Student details.', $student);
    }
}
