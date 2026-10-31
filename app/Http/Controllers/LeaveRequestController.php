<?php

namespace App\Http\Controllers;

use App\Http\Requests\LeaveRequest;
use Carbon\Carbon;
use App\Support\ApiResponse;
use App\Models\LeaveRequest as LeaveRequestModel;
use Illuminate\Http\Request;

class LeaveRequestController extends Controller
{
    public function __construct() {}

    public function index()
    {
        $user = auth()->user();

        $query = LeaveRequestModel::with(['user', 'leaveType'])
            ->latest();

        if (!in_array($user->role, [1, 2, 3])) {

            $query->where('user_id', $user->id);
        }

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

        $role = auth()->user()->role;

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
                'role'          => $role ?? $request->user()->id,
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

    public function approve(Request $request, int $id)
    {

        $manager = $request->user();

        if (!in_array($manager->role, [1, 6])) {

            return response()->json([
                'message' => 'Only managers can approve leave requests.',
            ], 403);
        }

        $leave = LeaveRequestModel::with(['user'])->find($id);

        if (!$leave) {
            return response()->json([
                'message' => 'Leave request not found'
            ], 404);
        }

        if ($leave->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending requests can be approved. Current status: ' . $leave->status,
            ], 422);
        }

        try {
            $leave->update([
                'status'           => 'approved',
                'approved_by'      => $manager->id,
                'approved_at'      => now(),
                'manager_comment'  => $request->input('manager_comment'),
            ]);

            return response()->json([
                'message' => 'Leave request approved successfully.',
                'data'    => $leave->fresh(['user', 'leaveType', 'approver']),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to approve leave request.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
