<?php

namespace App\Services\Admin;

use App\Repositories\StatsRepository;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class StatsService
{
    use ApiResponseTrait;

    public function __construct(protected StatsRepository $repo) {}

    public function studentsExamsStats(Request $request): \Illuminate\Http\JsonResponse
    {
        $passMark = (float)($request->query('pass_mark', 50));
        $data = $this->repo->studentsExamsStats(null, $passMark);

        return $this->unifiedResponse(true, 'Admin students exams statistics.', $data);
    }

    public function studentExamsStats(Request $request, int $studentId): \Illuminate\Http\JsonResponse
    {
        $passMark = (float)($request->query('pass_mark', 50));
        $data = $this->repo->studentExamsStats($studentId, $passMark);

        return $this->unifiedResponse(true, 'Admin student exams statistics.', $data);
    }
}
