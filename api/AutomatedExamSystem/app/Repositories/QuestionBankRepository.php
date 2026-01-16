<?php

namespace App\Repositories;

use App\Models\QuestionBank;

class QuestionBankRepository
{
    public function create(array $data): QuestionBank
    {
        return QuestionBank::create($data);
    }

    public function getByTeacher(int $teacherId)
    {
        return QuestionBank::where('teacher_id', $teacherId)
            ->with('subject')
            ->get();
    }

    public function findWithQuestions(int $id): ?QuestionBank
    {
        return QuestionBank::with(['subject', 'questions.options'])->find($id);
    }

    public function update($id, array $data)
    {
        $bank = QuestionBank::findOrFail($id);
        $bank->update($data);
        return $bank;
    }

    public function delete($id): bool
    {
        $bank = QuestionBank::findOrFail($id);
        return (bool) $bank->delete();
    }
}
