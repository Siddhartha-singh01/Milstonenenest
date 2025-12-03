import { useState } from 'react';
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import TaskColumn from './TaskColumn';
import TaskCard from './TaskCard';
import { useProject } from '../context/ProjectContext';

const TaskBoard = ({ onEditTask, tasks: propTasks }) => {
    const { tasks: contextTasks, updateTask } = useProject();
    const tasks = propTasks || contextTasks;
    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const columns = [
        { id: 'todo', title: 'To Do' },
        { id: 'in-progress', title: 'In Progress' },
        { id: 'done', title: 'Done' }
    ];

    const getTasksByStatus = (status) => tasks.filter(task => task.status === status);

    const onDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const onDragOver = (event) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveTask = active.data.current?.type === 'Task';
        const isOverTask = over.data.current?.type === 'Task';
        const isOverColumn = over.data.current?.type === 'Column';

        if (!isActiveTask) return;

        // Dropping over a column
        if (isOverColumn) {
            const task = tasks.find(t => t.id === activeId);
            if (task && task.status !== overId) {
                updateTask(activeId, { status: overId });
            }
        }

        // Dropping over another task
        if (isOverTask) {
            const activeTask = tasks.find(t => t.id === activeId);
            const overTask = tasks.find(t => t.id === overId);

            if (activeTask && overTask && activeTask.status !== overTask.status) {
                updateTask(activeId, { status: overTask.status });
            }
        }
    };

    const onDragEnd = (event) => {
        setActiveId(null);
    };

    const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
        >
            <div style={{
                display: 'flex',
                gap: '1.5rem',
                height: 'calc(100vh - 150px)',
                overflowX: 'auto',
                paddingBottom: '1rem'
            }}>
                {columns.map(col => (
                    <TaskColumn
                        key={col.id}
                        id={col.id}
                        title={col.title}
                        tasks={getTasksByStatus(col.id)}
                        onEditTask={onEditTask}
                    />
                ))}
            </div>

            <DragOverlay>
                {activeTask ? <TaskCard task={activeTask} /> : null}
            </DragOverlay>
        </DndContext>
    );
};

export default TaskBoard;
