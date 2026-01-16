<?php

namespace App\Repositories;

use App\Models\StudentAnswer;

class StudentAnswerRepository
{
    public function create(array $data): StudentAnswer
    {
        return StudentAnswer::create($data);
    }
}
