import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, User, AlertCircle, Lock } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useTheme } from '../context/ThemeContext';

const TaskCard = ({ task, onEdit }) => {
    const { tasks } = useProject();
    const { isDarkMode } = useTheme();

    const isBlocked = task.dependencies?.some(depId => {
        const depTask = tasks.find(t => t.id === depId);
        return depTask && depTask.status !== 'done';
    });

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: task.id, data: { type: 'Task', task } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const priorityColors = {
        low: 'var(--color-success)',
        medium: 'var(--color-warning)',
        high: 'var(--color-danger)'
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="task-card"
            onClick={() => onEdit && onEdit(task)}
        >
            <div style={{
                padding: '1rem',
                backgroundColor: isDarkMode ? '#171717' : 'white',
                borderRadius: '12px',
                border: isDarkMode ? '1px solid #404040' : '1px solid #E5E5E5',
                marginBottom: '0.75rem',
                cursor: 'grab',
                boxShadow: isDragging ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                transition: 'all 0.2s ease'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h4 style={{ fontWeight: 600, fontSize: '0.95rem', color: isDarkMode ? '#F5F5F5' : '#171717' }}>{task.title}</h4>
                        {isBlocked && <Lock size={14} color={isDarkMode ? '#A3A3A3' : '#737373'} />}
                    </div>
                    {task.priority && (
                        <AlertCircle size={16} color={priorityColors[task.priority]} />
                    )}
                </div>

                <p style={{ fontSize: '0.875rem', color: isDarkMode ? '#A3A3A3' : '#737373', marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {task.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: isDarkMode ? '#A3A3A3' : '#737373' }}>
                    {task.dueDate && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Calendar size={14} />
                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                    )}
                    {task.assignee && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <User size={14} />
                            <span>{task.assignee}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
