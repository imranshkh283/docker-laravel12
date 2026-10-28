<?php

namespace App\Http\Controllers;

use App\Support\ApiResponse;
use App\Models\LeaveType;

class LeaveTypeController extends Controller
{
    public function __construct() {}

    public function index()
    {
        $leavetype = LeaveType::select('id', 'name')
            ->where('is_active', true)
            ->orderBy('id', 'asc')
            ->get()
            ->mapWithKeys(function ($value) {
                return [
                    $value->id => [
                        'id' => $value->id,
                        'name' => $value->name,
                    ],
                ];
            })
            ->toArray();

        if (!empty($leavetype)) {
            return ApiResponse::success(
                data: $leavetype,
                message: 'All Leave Type',
                status: 200
            );
        }

        return ApiResponse::notFound('Leave not found');
    }
}
