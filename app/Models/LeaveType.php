<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeaveType extends Model
{

    protected $fillable = [
        'name',
        'code',
        'description',
        'max_days_per_year',
        'is_paid',
        'is_active',
        'payment_status',
    ];
}
