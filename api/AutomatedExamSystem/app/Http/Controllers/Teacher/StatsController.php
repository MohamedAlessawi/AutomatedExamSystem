<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Services\Teacher\StatsService;
use Illuminate\Http\Request;

class StatsController extends Controller
{
    public function __construct(protected StatsService $service)
    {
        $this->middleware(['auth:sanctum', 'role:teacher']);
    }

    public function studentsExamsStats(Request $request)
    {
        return $this->service->studentsExamsStats($request);
    }
}
