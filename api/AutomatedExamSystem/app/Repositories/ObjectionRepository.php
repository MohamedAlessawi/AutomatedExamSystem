<?php

namespace App\Repositories;

use App\Models\Objection;

class ObjectionRepository
{
    public function create(array $data): Objection
    {
        return Objection::create($data);
    }

    public function forTeacher(int $teacherId)
    {
        return Objection::with(['examAssignment.exam', 'student', 'question'])
            ->where('teacher_id', $teacherId)
            ->orderBy('status')
            ->latest()
            ->get();
    }

    public function updateStatus(Objection $objection, string $status, ?string $response = null): Objection
    {
        $objection->status = $status;
        $objection->teacher_response = $response;
        $objection->save();

        return $objection;
    }
}
