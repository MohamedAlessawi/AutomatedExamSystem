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
}
