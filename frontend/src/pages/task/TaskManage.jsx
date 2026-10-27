import { useState, useEffect } from "react";
import "./TaskManage.css";
import api from "../../api";
import TaskLabel from "../../components/TaskLabel";

const TaskManage = () => {
    const [tasks, setTasks] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [id, setId] = useState(null);

    const [filterStatus, setFilterStatus] = useState("all");
    const [newStatus, setNewStatus] = useState("active");
    const [newLabel, setNewLabel] = useState("default");
    const [newPriority, setNewPriority] = useState("low");

    const [form, setForm] = useState({
        title: "",
        status: "",
        label: "",
        priority: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const fetchTasks = async () => {
        try {
            const response = await api.get("/tasks");
            console.log(response);

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

    const fetchTaskById = async (id) => {
        if (!window.confirm("Update this task?")) return;

        try {
            const data = await api.get(`/tasks/${id}`);

            if (data.data.success) {
                setIsEditing(true);
                const { title, status, label, priority, id } = data.data.data;
                setId(id);
                setForm({
                    title: title,
                    status: status,
                    label: label,
                    priority: priority,
                });
            }

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

    const updateTask = async (e) => {
        e.preventDefault();

        if (!id) {
            setMessage("Please select a task to update.");
            return;
        }

        setLoading(true);

        try {
            const update = await api.patch(`/tasks/${id}`, form);

            if (update.data.success) {
                setMessage(update.data.message || "Task updated successfully");

                setIsEditing(false);
                setId(null);

                setForm({
                    title: "",
                    status: "active",
                    label: "yellow",
                    priority: "low",
                });

                await fetchTasks();
            }
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Unable to update task",
            );
        } finally {
            setLoading(false);
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
                                    <td>
                                        <TaskLabel label={task.label} />
                                    </td>
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
                                            onClick={() =>
                                                fetchTaskById(task.id)
                                            }
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

            <form
                className="new-task-form"
                onSubmit={!isEditing ? addTask : updateTask}
            >
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
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="done">Done</option>
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

                <button type="submit" id="submit" disabled={loading}>
                    {loading
                        ? isEditing
                            ? "Updating..."
                            : "Adding..."
                        : isEditing
                          ? "Update Task"
                          : "Add Task"}
                </button>
            </form>
        </div>
    );
};

export default TaskManage;
