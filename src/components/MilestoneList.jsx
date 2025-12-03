import { useProject } from '../context/ProjectContext';
import { useTheme } from '../context/ThemeContext';
import { Calendar, Flag, Trash2 } from 'lucide-react';

const MilestoneList = () => {
    const { milestones, tasks, deleteMilestone } = useProject();
    const { isDarkMode } = useTheme();

    const getProgress = (milestoneId) => {
        const milestoneTasks = tasks.filter(t => t.milestoneId === milestoneId);
        if (milestoneTasks.length === 0) return 0;
        const completed = milestoneTasks.filter(t => t.status === 'done').length;
        return Math.round((completed / milestoneTasks.length) * 100);
    };

    if (milestones.length === 0) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                color: isDarkMode ? '#A3A3A3' : '#737373',
                backgroundColor: isDarkMode ? '#171717' : 'white',
                borderRadius: 'var(--radius-lg)',
                border: isDarkMode ? '1px solid #404040' : '1px solid #E5E5E5'
            }}>
                <Flag size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <h3>No milestones yet</h3>
                <p>Create a milestone to track major project goals.</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {milestones.map(milestone => {
                const progress = getProgress(milestone.id);

                return (
                    <div key={milestone.id} style={{
                        backgroundColor: isDarkMode ? '#171717' : 'white',
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-lg)',
                        border: isDarkMode ? '1px solid #404040' : '1px solid #E5E5E5',
                        transition: 'all 0.3s ease'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: isDarkMode ? '#F5F5F5' : '#171717' }}>{milestone.title}</h3>
                                <p style={{ color: isDarkMode ? '#A3A3A3' : '#737373', marginBottom: '0.5rem' }}>{milestone.description}</p>
                                {milestone.dueDate && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isDarkMode ? '#A3A3A3' : '#737373', fontSize: '0.875rem' }}>
                                        <Calendar size={16} />
                                        <span>Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => {
                                    if (confirm('Are you sure you want to delete this milestone?')) {
                                        deleteMilestone(milestone.id);
                                    }
                                }}
                                style={{
                                    color: isDarkMode ? '#A3A3A3' : '#737373',
                                    padding: '0.5rem',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer',
                                    border: 'none',
                                    background: 'transparent'
                                }}
                                onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                                onMouseLeave={(e) => e.target.style.color = isDarkMode ? '#A3A3A3' : '#737373'}
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', color: isDarkMode ? '#A3A3A3' : '#737373' }}>
                                <span>Progress</span>
                                <span>{progress}%</span>
                            </div>
                            <div style={{
                                width: '100%',
                                height: '8px',
                                backgroundColor: isDarkMode ? '#404040' : '#E5E5E5',
                                borderRadius: '999px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: `${progress}%`,
                                    height: '100%',
                                    backgroundColor: progress === 100 ? 'var(--color-success)' : 'var(--color-primary)',
                                    transition: 'width 0.3s ease'
                                }} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default MilestoneList;
