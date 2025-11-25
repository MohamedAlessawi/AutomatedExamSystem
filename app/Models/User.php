<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'full_name',
        'email',
        'phone',
        'profile_photo',
        'password',
        'ip_address',
        'two_factor_enabled',
    ];




    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
        'email_verified_at' => 'datetime',
    ];

    public function teacherProfile(): HasOne
    {
        return $this->hasOne(TeacherProfile::class);
    }

    public function studentProfile(): HasOne
    {
        return $this->hasOne(StudentProfile::class);
    }

    // المواد اللي بيدرّسها (لما يكون role = teacher)
    public function subjectsTaught(): BelongsToMany
    {
        return $this->belongsToMany(Subject::class, 'teacher_subject', 'teacher_id', 'subject_id')
                    ->withTimestamps();
    }

    // بنوك الأسئلة تبعو (teacher)
    public function questionBanks(): HasMany
    {
        return $this->hasMany(QuestionBank::class, 'teacher_id');
    }

    // الامتحانات اللي أنشأها (teacher)
    public function exams(): HasMany
    {
        return $this->hasMany(Exam::class, 'teacher_id');
    }

    // الامتحانات التي عُيِّن لها كطالب
    public function examAssignments(): HasMany
    {
        return $this->hasMany(ExamAssignment::class, 'student_id');
    }

    // الاعتراضات اللي قدّمها كـ طالب
    public function objectionsAsStudent(): HasMany
    {
        return $this->hasMany(Objection::class, 'student_id');
    }

    // الاعتراضات اللي استلمها كـ مدرس
    public function objectionsAsTeacher(): HasMany
    {
        return $this->hasMany(Objection::class, 'teacher_id');
    }

}
