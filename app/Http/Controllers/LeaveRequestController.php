<?php

namespace App\Http\Controllers;

use App\Http\Requests\LeaveRequest;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Support\ApiResponse;
use App\Models\LeaveRequest as LeaveRequestModel;
use GrahamCampbell\ResultType\Success;

class LeaveRequestController extends Controller
{
    public function __construct() {}

    public function index()
    {

        $query = LeaveRequestModel::with(['user', 'leaveType'])
            ->latest();

        if ($status = request('status')) {
            $query->where('status', $status);
        }

        if ($userId = request('user_id')) {
            $query->where('user_id', $userId);
        }

        return $query->paginate(15);
    }

    public function store(LeaveRequest $request)
    {
        $data = $request->validated();

        $user_id = $request->user()->id;

        $start = Carbon::parse($data['start_date']);
        $end = Carbon::parse($data['end_date']);

        $totalDays = $this->countWorkingDays($start, $end);

        if ($totalDays <= 0) {
            return response()->json([
                'message' => 'Selected range contains no working days.',
            ], 422);
        }

        try {

            $leaveRequest = $request->user()->leaveRequests()->create([
                'user_id'       => $user_id,
                'leave_type_id' => $data['leave_type_id'],
                'start_date'    => $data['start_date'],
                'end_date'      => $data['end_date'],
                'total_days'    => $totalDays,
                'reason'        => $data['reason'],
                // 'attachment_path' => $attachmentPath,
                'status'        => 'pending',
            ]);

            return ApiResponse::success(
                data: $leaveRequest,
                message: 'Leave Raise Successfully',
                status: 201,

            );
        } catch (\Throwable $th) {
            return ApiResponse::error(
                message: "Sometime went wrong",
                status: 401,
            );
        }
    }

    private function countWorkingDays(Carbon $start, Carbon $end): int
    {
        $days = 0;
        $cursor = $start->copy();
        while ($cursor->lte($end)) {
            if (!$cursor->isWeekend()) {
                $days++;
            }
            $cursor->addDay();
        }
        return $days;
    }
}
