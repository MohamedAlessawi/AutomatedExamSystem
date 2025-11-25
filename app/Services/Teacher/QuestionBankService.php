<?php

namespace App\Services\Teacher;

use App\Repositories\QuestionBankRepository;
use App\Repositories\QuestionRepository;
use App\Traits\ApiResponseTrait;
use Illuminate\Support\Facades\DB;
use Exception;

class QuestionBankService
{
    use ApiResponseTrait;

    protected $bankRepo;
    protected $questionRepo;

    public function __construct(QuestionBankRepository $bankRepo, QuestionRepository $questionRepo)
    {
        $this->bankRepo     = $bankRepo;
        $this->questionRepo = $questionRepo;
    }

    public function createBank($request, $teacherId)
    {
        try {
            $bank = $this->bankRepo->create([
                'teacher_id'  => $teacherId,
                'subject_id'  => $request->subject_id,
                'title'       => $request->title,
                'description' => $request->description,
            ]);

            return $this->unifiedResponse(true, 'Question bank created successfully.', $bank, [], 201);
        } catch (Exception $e) {
            return $this->unifiedResponse(false, 'Failed to create question bank.', [], [$e->getMessage()], 500);
        }
    }

    public function listBanks($teacherId)
    {
        $banks = $this->bankRepo->getByTeacher($teacherId);
        return $this->unifiedResponse(true, 'Question banks retrieved.', $banks);
    }

    public function addQuestionWithOptions($request, $teacherId)
    {
        try {
            DB::beginTransaction();

            // ممكن تتحققي إنو هذا البنك تابع لهالمدرس

            $question = $this->questionRepo->create([
                'question_bank_id' => $request->question_bank_id,
                'subject_id'       => $request->subject_id,
                'question_type'    => $request->question_type, // 'mcq' or 'true_false'
                'question_text'    => $request->question_text,
                'difficulty_level' => $request->difficulty_level,
            ]);

            $optionsData = [];
            foreach ($request->options as $opt) {
                $optionsData[] = [
                    'question_id' => $question->id,
                    'option_text' => $opt['text'],
                    'is_correct'  => $opt['is_correct'] ?? false,
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ];
            }

            \App\Models\QuestionOption::insert($optionsData);

            DB::commit();

            $question = $this->questionRepo->findWithOptions($question->id);

            return $this->unifiedResponse(true, 'Question created successfully.', $question, [], 201);
        } catch (Exception $e) {
            DB::rollBack();
            return $this->unifiedResponse(false, 'Failed to create question.', [], [$e->getMessage()], 500);
        }
    }


    public function updateBank($request, $teacherId, $bankId)
    {
        try {
            $bank = \App\Models\QuestionBank::where('id', $bankId)
                ->where('teacher_id', $teacherId)
                ->first();

            if (!$bank) {
                return $this->unifiedResponse(false, 'Question bank not found.', [], [], 404);
            }

            $data = [
                'title'       => $request->title ?? $bank->title,
                'description' => $request->description ?? $bank->description,
            ];

            if ($request->filled('subject_id')) {
                $data['subject_id'] = $request->subject_id;
            }

            $bank->update($data);

            return $this->unifiedResponse(true, 'Question bank updated successfully.', $bank);
        } catch (\Exception $e) {
            return $this->unifiedResponse(false, 'Failed to update question bank.', [], [$e->getMessage()], 500);
        }
    }

    public function deleteBank($teacherId, $bankId)
    {
        try {
            $bank = \App\Models\QuestionBank::where('id', $bankId)
                ->where('teacher_id', $teacherId)
                ->first();

            if (!$bank) {
                return $this->unifiedResponse(false, 'Question bank not found.', [], [], 404);
            }

            $bank->delete();

            return $this->unifiedResponse(true, 'Question bank deleted successfully.', []);
        } catch (\Exception $e) {
            return $this->unifiedResponse(false, 'Failed to delete question bank.', [], [$e->getMessage()], 500);
        }
    }

    public function updateQuestion($request, $teacherId, $questionId)
    {
        try {
            DB::beginTransaction();

            $question = \App\Models\Question::with('questionBank')
                ->find($questionId);

            if (!$question || $question->questionBank->teacher_id !== $teacherId) {
                return $this->unifiedResponse(false, 'Question not found.', [], [], 404);
            }

            $data = [
                'question_text'    => $request->question_text ?? $question->question_text,
                'difficulty_level' => $request->difficulty_level ?? $question->difficulty_level,
            ];

            if ($request->filled('question_type')) {
                $data['question_type'] = $request->question_type;
            }
            if ($request->filled('subject_id')) {
                $data['subject_id'] = $request->subject_id;
            }

            $question->update($data);

            // لو بعت options جديدين → نمسح القدام وننشيء من جديد
            if ($request->has('options')) {
                $question->options()->delete();

                $optionsData = [];
                foreach ($request->options as $opt) {
                    $optionsData[] = [
                        'question_id' => $question->id,
                        'option_text' => $opt['text'],
                        'is_correct'  => $opt['is_correct'] ?? false,
                        'created_at'  => now(),
                        'updated_at'  => now(),
                    ];
                }
                \App\Models\QuestionOption::insert($optionsData);
            }

            DB::commit();

            $question->load('options');

            return $this->unifiedResponse(true, 'Question updated successfully.', $question);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->unifiedResponse(false, 'Failed to update question.', [], [$e->getMessage()], 500);
        }
    }

    public function deleteQuestion($teacherId, $questionId)
    {
        try {
            $question = \App\Models\Question::with('questionBank')
                ->find($questionId);

            if (!$question || $question->questionBank->teacher_id !== $teacherId) {
                return $this->unifiedResponse(false, 'Question not found.', [], [], 404);
            }

            $question->delete();

            return $this->unifiedResponse(true, 'Question deleted successfully.', []);
        } catch (\Exception $e) {
            return $this->unifiedResponse(false, 'Failed to delete question.', [], [$e->getMessage()], 500);
        }
    }
    
    public function showBank(int $bankId, int $teacherId)
    {
        $bank = $this->bankRepo->findWithQuestions($bankId);

        if (!$bank || $bank->teacher_id !== $teacherId) {
            return $this->unifiedResponse(false, 'Question bank not found.', [], [], 404);
        }

        return $this->unifiedResponse(true, 'Question bank details.', $bank);
    }

    public function listQuestions($request, int $teacherId)
    {
        $subjectId = $request->query('subject_id');
        $bankId    = $request->query('question_bank_id');

        $questions = $this->questionRepo->getForTeacher($teacherId, $subjectId, $bankId);

        return $this->unifiedResponse(true, 'Questions list.', $questions);
    }

    public function showQuestion(int $questionId, int $teacherId)
    {
        $question = $this->questionRepo->findWithOptions($questionId);

        if (
            !$question ||
            !$question->questionBank ||
            $question->questionBank->teacher_id !== $teacherId
        ) {
            return $this->unifiedResponse(false, 'Question not found.', [], [], 404);
        }

        return $this->unifiedResponse(true, 'Question details.', $question);
    }


}
