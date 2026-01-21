<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\StatsService;
use Illuminate\Http\Request;

class StatsController extends Controller
{
    public function __construct(protected StatsService $service)
    {
        $this->middleware(['auth:sanctum', 'role:admin']);
    }

    public function studentsExamsStats(Request $request)
    {
        return $this->service->studentsExamsStats($request);
    }

    public function studentExamsStats(Request $request, $studentId)
    {
        return $this->service->studentExamsStats($request, (int)$studentId);
    }
}
