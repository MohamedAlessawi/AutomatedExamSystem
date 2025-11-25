<?php

namespace App\Repositories;

use App\Models\Question;

class QuestionRepository
{
    public function create(array $data): Question
    {
        return Question::create($data);
    }

    public function findWithOptions(int $id): ?Question
    {
        return Question::with('options')->find($id);
    }

    public function getManyByIds(array $ids)
    {
        return Question::whereIn('id', $ids)->get();
    }

    public function update($id, array $data)
    {
        $question = Question::findOrFail($id);
        $question->update($data);
        return $question;
    }

    public function delete($id): bool
    {
        $question = Question::findOrFail($id);
        return (bool) $question->delete();
    }

    public function getForTeacher(int $teacherId, ?int $subjectId = null, ?int $bankId = null)
    {
        return \App\Models\Question::whereHas('questionBank', function ($q) use ($teacherId, $bankId) {
                $q->where('teacher_id', $teacherId);
                if ($bankId) {
                    $q->where('id', $bankId);
                }
            })
            ->when($subjectId, function ($q) use ($subjectId) {
                $q->where('subject_id', $subjectId);
            })
            ->with(['options', 'questionBank'])
            ->get();
    }

}
