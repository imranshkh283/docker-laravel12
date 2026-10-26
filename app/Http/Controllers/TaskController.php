<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskRequest;
use App\Models\Task;

class TaskController extends Controller
{

    public function index()
    {

        $task = Task::latest()->get();

        if (!$task) {
            return response()->json([
                'message' => 'No task found'
            ]);
        } else {
            return response()->json([
                'success' => true,
                'message' => 'Task found',
                'data' => $task
            ]);
        }
    }

    public function store(TaskRequest $request)
    {
        $task = $request->user()->tasks()->create([
            'title' => $request->title,
            'status' => $request->status,
            'label' => $request->label,
            'priority' => $request->priority,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Task created successfully',
            'data' => $task,
        ], 201);
    }

    public function show(Task $task)
    {

        if ($task->user_id !== request()->user()->id) {
            abort(403, 'Unauthorized access');
        }

        return response()->json([
            'success' => true,
            'message' => 'Task fetched successfully',
            'data' => $task,
        ], 200);
    }

    public function update(TaskRequest $request, Task $task)
    {

        if ($task->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized access');
        }

        $task->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Task updated successfully',
            'data' => $task->fresh(),
        ]);
    }

    public function delete() {}
}
