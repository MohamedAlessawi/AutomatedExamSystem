<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Services\Teacher\QuestionBankService;
use Illuminate\Http\Request;

class QuestionBankController extends Controller
{
    protected $service;

    public function __construct(QuestionBankService $service)
    {
        $this->middleware(['auth:sanctum', 'role:teacher']);
        $this->service = $service;
    }

    // GET /api/teacher/question-banks
    public function index(Request $request)
    {
        return $this->service->listBanks($request->user()->id);
    }

    // POST /api/teacher/question-banks
    public function store(Request $request)
    {
        $request->validate([
            'subject_id'  => 'required|integer|exists:subjects,id',
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        return $this->service->createBank($request, $request->user()->id);
    }

    // PUT /api/teacher/question-banks/{id}
    public function update($id, Request $request)
    {
        $request->validate([
            'subject_id'  => 'nullable|integer|exists:subjects,id',
            'title'       => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        return $this->service->updateBank($request, $request->user()->id, (int)$id);
    }

    // DELETE /api/teacher/question-banks/{id}
    public function destroy($id, Request $request)
    {
        return $this->service->deleteBank($request->user()->id, (int)$id);
    }

    // POST /api/teacher/questions
    public function storeQuestion(Request $request)
    {
        $request->validate([
            'question_bank_id' => 'required|integer|exists:question_banks,id',
            'subject_id'       => 'required|integer|exists:subjects,id',
            'question_type'    => 'required|in:mcq,true_false',
            'question_text'    => 'required|string',
            'difficulty_level' => 'nullable|integer|min:1|max:5',
            'options'          => 'required|array|min:2',
            'options.*.text'   => 'required|string',
            'options.*.is_correct' => 'boolean',
        ]);

        return $this->service->addQuestionWithOptions($request, $request->user()->id);
    }

    // PUT /api/teacher/questions/{id}
    public function updateQuestion($id, Request $request)
    {
        $request->validate([
            'question_bank_id' => 'nullable|integer|exists:question_banks,id',
            'subject_id'       => 'nullable|integer|exists:subjects,id',
            'question_type'    => 'nullable|in:mcq,true_false',
            'question_text'    => 'nullable|string',
            'difficulty_level' => 'nullable|integer|min:1|max:5',
            'options'          => 'nullable|array|min:2',
            'options.*.text'   => 'required_with:options|string',
            'options.*.is_correct' => 'boolean',
        ]);

        return $this->service->updateQuestion($request, $request->user()->id, (int)$id);
    }

    // DELETE /api/teacher/questions/{id}
    public function destroyQuestion($id, Request $request)
    {
        return $this->service->deleteQuestion($request->user()->id, (int)$id);
    }

    // GET /api/teacher/question-banks/{id}
    public function show($id, Request $request)
    {
        return $this->service->showBank((int)$id, $request->user()->id);
    }

    // GET /api/teacher/questions  (?subject_id=&question_bank_id=)
    public function indexQuestions(Request $request)
    {
        return $this->service->listQuestions($request, $request->user()->id);
    }

    // GET /api/teacher/questions/{id}
    public function showQuestion($id, Request $request)
    {
        return $this->service->showQuestion((int)$id, $request->user()->id);
    }

}
