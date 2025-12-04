import { useState } from 'react';
import { X } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useTheme } from '../context/ThemeContext';
//Add task -> details
const TaskModal = ({ onClose, taskToEdit = null }) => {
    const { addTask, updateTask, deleteTask, tasks } = useProject();
    const { isDarkMode } = useTheme();
    const [formData, setFormData] = useState(taskToEdit || {
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: '',
        assignee: '',
        dependencies: []
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (taskToEdit) {
            updateTask(taskToEdit.id, formData);
        } else {
            addTask(formData);
        }
        onClose();
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem',
        borderRadius: 'var(--radius-md)',
        border: isDarkMode ? '1px solid #404040' : '1px solid #E5E5E5',
        backgroundColor: isDarkMode ? '#171717' : 'white',
        color: isDarkMode ? '#F5F5F5' : '#171717',
        outline: 'none'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '0.5rem',
        fontSize: '0.875rem',
        color: isDarkMode ? '#D4D4D4' : '#374151'
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            backdropFilter: 'blur(4px)'
        }}>
            <div style={{
                backgroundColor: isDarkMode ? '#262626' : 'white',
                padding: '2rem',
                borderRadius: 'var(--radius-lg)',
                width: '100%',
                maxWidth: '500px',
                border: isDarkMode ? '1px solid #404040' : '1px solid #E5E5E5',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: isDarkMode ? '#F5F5F5' : '#171717' }}>{taskToEdit ? 'Edit Task' : 'New Task'}</h2>
                    <button onClick={onClose} style={{ color: isDarkMode ? '#A3A3A3' : '#737373', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={labelStyle}>Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Description</label>
                        <textarea
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            style={{ ...inputStyle, resize: 'vertical' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={labelStyle}>Status</label>
                            <select
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                                style={inputStyle}
                            >
                                <option value="todo">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>Priority</label>
                            <select
                                value={formData.priority}
                                onChange={e => setFormData({ ...formData, priority: e.target.value })}
                                style={inputStyle}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>Due Date</label>
                        <input
                            type="date"
                            required
                            value={formData.dueDate ? formData.dueDate.split('T')[0] : ''}
                            onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Assign To</label>
                        <select
                            value={formData.assignee}
                            onChange={e => setFormData({ ...formData, assignee: e.target.value })}
                            style={inputStyle}
                        >
                            <option value="">Unassigned</option>
                            <option value="Sarah Chen">Sarah Chen</option>
                            <option value="Mike Johnson">Mike Johnson</option>
                            <option value="Alex Kim">Alex Kim</option>
                            <option value="Emma Davis">Emma Davis</option>
                            <option value="James Wilson">James Wilson</option>
                        </select>
                    </div>

                    <div>
                        <label style={labelStyle}>Dependencies</label>
                        <select
                            multiple
                            value={formData.dependencies || []}
                            onChange={e => {
                                const selected = Array.from(e.target.selectedOptions, option => option.value);
                                setFormData({ ...formData, dependencies: selected });
                            }}
                            style={{ ...inputStyle, height: '100px' }}
                        >
                            {tasks.filter(t => t.id !== (taskToEdit?.id)).map(task => (
                                <option key={task.id} value={task.id}>
                                    {task.title}
                                </option>
                            ))}
                        </select>
                        <p style={{ fontSize: '0.75rem', color: isDarkMode ? '#A3A3A3' : 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                            Hold Ctrl/Cmd to select multiple
                        </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                        {taskToEdit && (
                            <button
                                type="button"
                                onClick={() => {
                                    if (confirm('Are you sure you want to delete this task?')) {
                                        deleteTask(taskToEdit.id);
                                        onClose();
                                    }
                                }}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--color-danger)',
                                    border: '1px solid var(--color-danger)',
                                    backgroundColor: 'transparent',
                                    cursor: 'pointer'
                                }}
                            >
                                Delete
                            </button>
                        )}
                        <div style={{ display: 'flex', gap: '1rem', marginLeft: 'auto' }}>
                            <button
                                type="button"
                                onClick={onClose}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: 'var(--radius-md)',
                                    color: isDarkMode ? '#A3A3A3' : 'var(--color-text-muted)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: 'var(--radius-md)',
                                    backgroundColor: isDarkMode ? '#6366f1' : 'var(--color-primary)',
                                    color: 'white',
                                    fontWeight: 500,
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                {taskToEdit ? 'Save Changes' : 'Create Task'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
