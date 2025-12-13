<?php

namespace App\Services\Admin;

use App\Repositories\UserRepository;
use App\Services\Auth\RegisterService;
use App\Traits\ApiResponseTrait;
use Illuminate\Support\Facades\Validator;
use App\Models\StudentProfile;


class UserManagementService
{
    use ApiResponseTrait;

    protected $userRepo;
    protected $registerService;

    public function __construct(UserRepository $userRepo, RegisterService $registerService)
    {
        $this->userRepo        = $userRepo;
        $this->registerService = $registerService;
    }

    public function listTeachers()
    {
        $teachers = $this->userRepo->getByRole('teacher');
        return $this->unifiedResponse(true, 'Teachers list.', $teachers);
    }

    public function listStudents()
    {
        $students = $this->userRepo->getByRole('student');
        return $this->unifiedResponse(true, 'Students list.', $students);
    }

    public function showTeacher(int $id)
    {
        $teacher = $this->userRepo->findByIdAndRole($id, 'teacher');
        if (!$teacher) {
            return $this->unifiedResponse(false, 'Teacher not found.', [], [], 404);
        }
        return $this->unifiedResponse(true, 'Teacher details.', $teacher);
    }

    public function showStudent(int $id)
    {
        $student = $this->userRepo->findByIdAndRole($id, 'student');
        if (!$student) {
            return $this->unifiedResponse(false, 'Student not found.', [], [], 404);
        }
        return $this->unifiedResponse(true, 'Student details.', $student);
    }

    // إنشاء أستاذ / طالب من عند الأدمن (نستعمل RegisterService نفسه)
    public function createUser($request)
    {
        // هون فيكِ تعتمدي على RegisterRequest، أو تعملي validation بسيطة
        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:15|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'profile_photo' => 'nullable|file|image',
            'role' => 'required|in:teacher,student',
        ]);

        if ($validator->fails()) {
            return $this->unifiedResponse(false, 'Validation error.', [], $validator->errors()->toArray(), 422);
        }

        // نعيد استعمال RegisterService
        return $this->registerService->register($request);
    }

    public function toggleActive(int $id)
    {
        $user = \App\Models\User::find($id);
        if (!$user) {
            return $this->unifiedResponse(false, 'User not found.', [], [], 404);
        }

        $user->is_active = !$user->is_active;
        $user->save();

        return $this->unifiedResponse(true, 'User status updated.', [
            'id'        => $user->id,
            'is_active' => $user->is_active,
        ]);
    }
}
