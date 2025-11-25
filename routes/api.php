<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\TwoFactorController;

use App\Http\Controllers\Teacher\QuestionBankController;
use App\Http\Controllers\Teacher\ExamController as TeacherExamController;
use App\Http\Controllers\Teacher\ObjectionController as TeacherObjectionController;
use App\Http\Controllers\Student\ExamController as StudentExamController;
use App\Http\Controllers\Student\ObjectionController as StudentObjectionController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Auth routes
route::post('register',[RegisterController::class, 'register']);
Route::post('verify-email', [RegisterController::class, 'verifyEmail']);
Route::middleware('throttle:2,10')->post('resend-verification-code',[RegisterController::class,'resendVerificationCode'])
    ->name('resend.verification.code');;
Route::post('login', [LoginController::class, 'login'])
    ->name('login');
Route::post('refresh-token',[LoginController::class, 'refresh']);
Route::post('logout', [LoginController::class, 'logout'])->middleware('auth:sanctum');


Route::post('forgot-password', [ForgotPasswordController::class, 'sendResetCode']);
Route::post('reset-password', [ForgotPasswordController::class, 'reset']);


Route::middleware('auth:sanctum')->group(function () {
    Route::post('2fa/enable', [TwoFactorController::class, 'enable']);
    Route::post('2fa/disable', [TwoFactorController::class, 'disable']);
    Route::post('2fa/verify', [TwoFactorController::class, 'verify']);
});
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::middleware(['auth:sanctum', 'role:teacher'])->prefix('teacher')->group(function () {
    // Question banks
    Route::get('question-banks', [QuestionBankController::class, 'index']);
    Route::post('question-banks', [QuestionBankController::class, 'store']);
    Route::put('question-banks/{id}', [QuestionBankController::class, 'update']);
    Route::delete('question-banks/{id}', [QuestionBankController::class, 'destroy']);

    // Questions
    Route::post('questions', [QuestionBankController::class, 'storeQuestion']);
    Route::put('questions/{id}', [QuestionBankController::class, 'updateQuestion']);
    Route::delete('questions/{id}', [QuestionBankController::class, 'destroyQuestion']);

    // Exams
    Route::get('exams', [TeacherExamController::class, 'index']);
    Route::post('exams', [TeacherExamController::class, 'store']);
    Route::get('exams/{id}', [TeacherExamController::class, 'show']);
    Route::put('exams/{id}', [TeacherExamController::class, 'update']);
    Route::delete('exams/{id}', [TeacherExamController::class, 'destroy']);

    // Objections
    Route::get('objections', [TeacherObjectionController::class, 'index']);
    Route::put('objections/{id}', [TeacherObjectionController::class, 'update']);
});

Route::middleware(['auth:sanctum', 'role:student'])->prefix('student')->group(function () {
    // Exams
    Route::get('exams/current', [StudentExamController::class, 'current']);
    Route::get('exams/history', [StudentExamController::class, 'history']);
    Route::get('exams/{assignmentId}', [StudentExamController::class, 'show']);
    Route::post('exams/submit', [StudentExamController::class, 'submit']);

    // Objections
    Route::post('objections', [StudentObjectionController::class, 'store']);
});
