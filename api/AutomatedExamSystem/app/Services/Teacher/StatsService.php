<?php

namespace App\Services\Teacher;

use App\Repositories\StatsRepository;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class StatsService
{
    use ApiResponseTrait;

    public function __construct(protected StatsRepository $repo) {}

    public function studentsExamsStats(Request $request): \Illuminate\Http\JsonResponse
    {
        $teacherId = $request->user()->id;
        $passMark = (float)($request->query('pass_mark', 50));

        $data = $this->repo->studentsExamsStats($teacherId, $passMark);

        return $this->unifiedResponse(true, 'Teacher students exams statistics.', $data);
    }
}
