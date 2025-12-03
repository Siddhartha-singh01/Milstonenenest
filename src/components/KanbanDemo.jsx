import { useState } from 'react';
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Task Card Component
const TaskCard = ({ task, isDragging }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: isSortableDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isSortableDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`kanban-card ${isDragging ? 'dragging' : ''}`}
        >
            <div className="kanban-card-content">
                <h4>{task.title}</h4>
                {task.description && <p>{task.description}</p>}
                <div className="kanban-card-meta">
                    {task.priority && (
                        <span className={`priority priority-${task.priority}`}>
                            {task.priority}
                        </span>
                    )}
                    {task.assignee && (
                        <span className="assignee">{task.assignee}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

// Column Component
const KanbanColumn = ({ column, tasks }) => {
    const taskIds = tasks.map(task => task.id);

    return (
        <div className="kanban-column">
            <div className="kanban-column-header">
                <h3>{column.title}</h3>
                <span className="task-count">{tasks.length}</span>
            </div>
            <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                <div className="kanban-column-content">
                    {tasks.map(task => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>
            </SortableContext>
        </div>
    );
};

// Main Kanban Demo Component
const KanbanDemo = () => {
    const [tasks, setTasks] = useState([
        { id: '1', title: 'Design landing page', description: 'Create mockups and wireframes', status: 'todo', priority: 'high', assignee: 'Sarah' },
        { id: '2', title: 'Setup authentication', description: 'Implement JWT auth flow', status: 'todo', priority: 'medium', assignee: 'Mike' },
        { id: '3', title: 'Build API endpoints', description: 'Create REST API for tasks', status: 'in-progress', priority: 'high', assignee: 'Alex' },
        { id: '4', title: 'Database schema', description: 'Design MongoDB collections', status: 'in-progress', priority: 'medium', assignee: 'Sarah' },
        { id: '5', title: 'Project setup', description: 'Initialize React + Vite', status: 'done', priority: 'high', assignee: 'Mike' },
        { id: '6', title: 'Deploy to production', description: 'Configure hosting and CI/CD', status: 'done', priority: 'low', assignee: 'Alex' },
    ]);

    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const columns = [
        { id: 'todo', title: 'To Do', status: 'todo' },
        { id: 'in-progress', title: 'In Progress', status: 'in-progress' },
        { id: 'done', title: 'Done', status: 'done' },
    ];

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragOver = (event) => {
        const { active, over } = event;
        if (!over) return;

        const activeTask = tasks.find(t => t.id === active.id);
        const overTask = tasks.find(t => t.id === over.id);

        if (!activeTask) return;

        // Check if we're over a column or a task
        const overColumn = columns.find(c => c.id === over.id);

        if (overColumn) {
            // Moving to a different column
            if (activeTask.status !== overColumn.status) {
                setTasks(tasks.map(task =>
                    task.id === activeTask.id
                        ? { ...task, status: overColumn.status }
                        : task
                ));
            }
        } else if (overTask && activeTask.status !== overTask.status) {
            // Moving to a different column via task
            setTasks(tasks.map(task =>
                task.id === activeTask.id
                    ? { ...task, status: overTask.status }
                    : task
            ));
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeTask = tasks.find(t => t.id === active.id);
        const overTask = tasks.find(t => t.id === over.id);

        if (!activeTask || !overTask) return;

        if (activeTask.status === overTask.status) {
            // Reordering within the same column
            const activeIndex = tasks.findIndex(t => t.id === active.id);
            const overIndex = tasks.findIndex(t => t.id === over.id);
            setTasks(arrayMove(tasks, activeIndex, overIndex));
        }
    };

    const getTasksByStatus = (status) => {
        return tasks.filter(task => task.status === status);
    };

    const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

    return (
        <div className="kanban-demo">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="kanban-board">
                    {columns.map(column => (
                        <KanbanColumn
                            key={column.id}
                            column={column}
                            tasks={getTasksByStatus(column.status)}
                        />
                    ))}
                </div>
                <DragOverlay>
                    {activeTask ? (
                        <div className="kanban-card dragging">
                            <div className="kanban-card-content">
                                <h4>{activeTask.title}</h4>
                                {activeTask.description && <p>{activeTask.description}</p>}
                            </div>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};

export default KanbanDemo;
