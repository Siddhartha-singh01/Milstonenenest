import { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import TaskBoard from '../components/TaskBoard';
import TaskModal from '../components/TaskModal';
import TaskSummary from '../components/TaskSummary';
import ThreeBackground from '../components/ThreeBackground';
import { useTheme } from '../context/ThemeContext';
import { useProject } from '../context/ProjectContext';

const Tasks = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSummaryOpen, setIsSummaryOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const { isDarkMode } = useTheme();
    const { tasks } = useProject();

    const handleEditTask = (task) => {
        setTaskToEdit(task);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTaskToEdit(null);
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh' }}>
            <ThreeBackground />

            <div style={{ position: 'relative', zIndex: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: isDarkMode ? '#F5F5F5' : '#171717' }}>Tasks</h1>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={() => setIsSummaryOpen(true)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                padding: '0.75rem 1.25rem',
                                borderRadius: '12px',
                                fontWeight: 500,
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                            }}
                        >
                            <Sparkles size={20} />
                            Get Summary
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                backgroundColor: isDarkMode ? '#6366f1' : '#171717',
                                color: 'white',
                                padding: '0.75rem 1.25rem',
                                borderRadius: '12px',
                                fontWeight: 500,
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Plus size={20} />
                            New Task
                        </button>
                    </div>
                </div>

                <TaskBoard onEditTask={handleEditTask} />

                {isModalOpen && (
                    <TaskModal onClose={handleCloseModal} taskToEdit={taskToEdit} />
                )}

                {isSummaryOpen && (
                    <TaskSummary tasks={tasks} onClose={() => setIsSummaryOpen(false)} />
                )}
            </div>
        </div>
    );
};

export default Tasks;
