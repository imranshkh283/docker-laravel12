<?php
// app/Models/LeaveRequest.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeaveRequest extends Model
{
    use HasFactory;

    /**
     * These are the columns Laravel is allowed to mass-assign.
     * If a column is NOT here, create() will silently ignore it.
     */
    protected $fillable = [
        'user_id',
        'leave_type_id',
        'start_date',
        'end_date',
        'total_days',
        'reason',
        'attachment_path',
        'status',
        'approved_by',
        'approved_at',
        'manager_comment',
        'cancelled_at',
    ];

    protected $casts = [
        'start_date'  => 'date',
        'end_date'    => 'date',
        'approved_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'total_days'  => 'decimal:2',
    ];

    protected $appends = ['formatted_start_date', 'formatted_end_date'];

    public function getFormattedStartDateAttribute()
    {
        return $this->start_date?->format('d M Y');
    }

    public function getFormattedEndDateAttribute()
    {
        return $this->end_date?->format('d M Y');
    }

    // ---- Relationships ----

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function leaveType()
    {
        return $this->belongsTo(LeaveType::class);
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function approvals()
    {
        return $this->hasMany(LeaveRequestApproval::class);
    }

    // ---- Helpers ----

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }
}
