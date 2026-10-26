import { useState, useEffect } from "react";
import "./TaskManage.css";

import api from "../../api";

const TaskManage = () => {
    const [tasks, setTasks] = useState([]);

    const [filterStatus, setFilterStatus] = useState("all");
    const [newStatus, setNewStatus] = useState("active");
    const [newLabel, setNewLabel] = useState("default");
    const [newPriority, setNewPriority] = useState("low");

    const [form, setForm] = useState({
        title: "",
        status: "active",
        label: "yellow",
        priority: "low",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const fetchTasks = async () => {
        try {
            const response = await api.get("/tasks");

            const data = response.data;
            setTasks(Array.isArray(data.data) ? data.data : []);
            setMessage(data.message || "");
        } catch (error) {
            setMessage(error.message || "Unable to load tasks");
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const addTask = async (e) => {
        e.preventDefault();

        if (!form.title.trim()) {
            setMessage("Please enter a task title.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const insert = await api.post("/tasks", form);

            if (insert.data.success == true) {
                setForm({
                    title: "",
                    status: "active",
                    label: "yellow",
                    priority: "low",
                });

                await fetchTasks();
            }
        } catch (error) {
            setMessage(error.message || "Unable to add task");
        } finally {
            setLoading(false);
        }
    };

    const deleteTask = async (id) => {
        if (!window.confirm("Delete this task?")) return;

        try {
            const response = await fetch(`/api/admin/tasks/${id}/delete`, {
                method: "DELETE",
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete task");
            }

            setTasks((previousTasks) =>
                previousTasks.filter((task) => task.id !== id),
            );

            setMessage(data.message || "Task deleted successfully");
        } catch (error) {
            setMessage(error.message || "Unable to delete task");
        }
    };

    const updateTask = async (task) => {
        if (!window.confirm("Update this task?")) return;

        try {
            const response = await fetch(`/api/admin/tasks/${task.id}/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: task.status,
                    label: task.label,
                    priority: task.priority,
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.message || "Failed to update task");
            }

            if (data.task) {
                setTasks((previousTasks) =>
                    previousTasks.map((item) =>
                        item.id === task.id ? data.task : item,
                    ),
                );
            } else {
                await fetchTasks(filterStatus);
            }

            setMessage(data.message || "Task updated successfully");
        } catch (error) {
            setMessage(error.message || "Unable to update task");
        }
    };

    return (
        <div className="taskmanage-container">
            <h2 className="title">Task Management</h2>

            {message && (
                <div
                    className={`message ${
                        /success/i.test(message) ? "success" : "error"
                    }`}
                    role="status"
                >
                    {message}
                </div>
            )}

            <div className="filters">
                <label>
                    Filter by Status:
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="done">Done</option>
                        <option value="pending">Pending</option>
                    </select>
                </label>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Label</th>
                            <th>Priority</th>
                            <th>Date Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tasks.length === 0 ? (
                            <tr>
                                <td colSpan={6}>No tasks found</td>
                            </tr>
                        ) : (
                            tasks.map((task) => (
                                <tr key={task.id}>
                                    <td>{task.title}</td>
                                    <td>
                                        {task.status.charAt(0).toUpperCase() +
                                            task.status.slice(1)}
                                    </td>
                                    <td>{task.label}</td>
                                    <td>{task.priority}</td>
                                    <td>
                                        {task.created_at
                                            ? new Date(
                                                  task.created_at,
                                              ).toLocaleDateString()
                                            : "—"}
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className="edit-btn"
                                            onClick={() => updateTask(task)}
                                            aria-label={`Update ${task.title}`}
                                        >
                                            ✎
                                        </button>

                                        <button
                                            type="button"
                                            className="delete-btn"
                                            onClick={() => deleteTask(task.id)}
                                            aria-label={`Delete ${task.title}`}
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <form className="new-task-form" onSubmit={addTask}>
                <input
                    type="text"
                    placeholder="Task Title"
                    value={form.title}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            title: e.target.value,
                        })
                    }
                    required
                />

                <label>
                    Status:
                    <select
                        value={form.status}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                status: e.target.value,
                            })
                        }
                    >
                        <option value="active">Active</option>
                        <option value="done">Done</option>
                        <option value="pending">Pending</option>
                    </select>
                </label>

                <label>
                    Label:
                    <select
                        value={form.label}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                label: e.target.value,
                            })
                        }
                    >
                        <option value="yellow">Yellow</option>
                        <option value="green">Green</option>
                        <option value="red">Red</option>
                    </select>
                </label>

                <label>
                    Priority:
                    <select
                        value={form.priority}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                priority: e.target.value,
                            })
                        }
                    >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                    </select>
                </label>

                <button type="submit" disabled={loading}>
                    {loading ? "Adding..." : "Add Task"}
                </button>
            </form>
        </div>
    );
};

export default TaskManage;
