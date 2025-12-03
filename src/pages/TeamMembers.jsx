import { useRef, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { useTheme } from '../context/ThemeContext';
import ThreeBackground from '../components/ThreeBackground';
import gsap from 'gsap';
import {
    User,
    CheckCircle,
    Clock,
    AlertCircle
} from 'lucide-react';

const TeamMembers = () => {
    const { tasks } = useProject();
    const { isDarkMode } = useTheme();
    const containerRef = useRef(null);

    // Group tasks by assignee
    const membersMap = tasks.reduce((acc, task) => {
        const assignee = task.assignee || 'Unassigned';
        if (!acc[assignee]) {
            acc[assignee] = [];
        }
        acc[assignee].push(task);
        return acc;
    }, {});

    const members = Object.entries(membersMap).map(([name, memberTasks]) => ({
        name,
        tasks: memberTasks,
        stats: {
            total: memberTasks.length,
            completed: memberTasks.filter(t => t.status === 'done').length,
            inProgress: memberTasks.filter(t => t.status === 'in-progress').length,
            todo: memberTasks.filter(t => t.status === 'todo').length
        }
    }));

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.member-card',
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power3.out'
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'done': return '#22c55e';
            case 'in-progress': return '#3b82f6';
            case 'todo': return '#f59e0b';
            default: return '#737373';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'done': return <CheckCircle size={14} />;
            case 'in-progress': return <Clock size={14} />;
            case 'todo': return <AlertCircle size={14} />;
            default: return null;
        }
    };

    return (
        <div style={{
            backgroundColor: isDarkMode ? '#171717' : '#FAFAFA',
            minHeight: '100vh',
            padding: '2rem 5%',
            fontFamily: '"Inter", "Helvetica Neue", sans-serif',
            position: 'relative',
            transition: 'background-color 0.3s ease'
        }} ref={containerRef}>
            <ThreeBackground />

            <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
                <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                        fontWeight: '700',
                        letterSpacing: '-0.03em',
                        color: isDarkMode ? '#F5F5F5' : '#171717',
                        marginBottom: '0.5rem',
                        transition: 'color 0.3s ease'
                    }}>
                        Team Members
                    </h1>
                    <p style={{ fontSize: '1rem', color: isDarkMode ? '#A3A3A3' : '#737373', transition: 'color 0.3s ease' }}>
                        Overview of team members and their assigned tasks.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '2rem'
                }}>
                    {members.map((member) => (
                        <div key={member.name} className="member-card" style={{
                            backgroundColor: isDarkMode ? '#262626' : 'white',
                            borderRadius: '16px',
                            border: isDarkMode ? '1px solid #404040' : '1px solid #E5E5E5',
                            overflow: 'hidden',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}>
                            {/* Header */}
                            <div style={{
                                padding: '1.5rem',
                                borderBottom: isDarkMode ? '1px solid #404040' : '1px solid #E5E5E5',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    backgroundColor: '#6366f1',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.125rem',
                                    fontWeight: '700'
                                }}>
                                    {getInitials(member.name)}
                                </div>
                                <div>
                                    <h2 style={{
                                        fontSize: '1.25rem',
                                        fontWeight: '600',
                                        color: isDarkMode ? '#F5F5F5' : '#171717',
                                        marginBottom: '0.25rem'
                                    }}>
                                        {member.name}
                                    </h2>
                                    <div style={{
                                        fontSize: '0.875rem',
                                        color: isDarkMode ? '#A3A3A3' : '#737373',
                                        display: 'flex',
                                        gap: '0.75rem'
                                    }}>
                                        <span>{member.stats.total} Tasks</span>
                                        <span>•</span>
                                        <span style={{ color: '#22c55e' }}>{member.stats.completed} Done</span>
                                    </div>
                                </div>
                            </div>

                            {/* Tasks List */}
                            <div style={{ padding: '1.5rem' }}>
                                <h3 style={{
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    color: isDarkMode ? '#A3A3A3' : '#737373',
                                    marginBottom: '1rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    Assigned Tasks
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {member.tasks.map(task => (
                                        <div key={task.id} style={{
                                            padding: '0.75rem',
                                            backgroundColor: isDarkMode ? '#171717' : '#FAFAFA',
                                            borderRadius: '8px',
                                            border: isDarkMode ? '1px solid #404040' : '1px solid #E5E5E5'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                                marginBottom: '0.5rem'
                                            }}>
                                                <span style={{
                                                    fontSize: '0.95rem',
                                                    fontWeight: '500',
                                                    color: isDarkMode ? '#F5F5F5' : '#171717',
                                                    lineHeight: '1.4'
                                                }}>
                                                    {task.title}
                                                </span>
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between'
                                            }}>
                                                <span style={{
                                                    fontSize: '0.75rem',
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '4px',
                                                    backgroundColor: `${getStatusColor(task.status)}15`,
                                                    color: getStatusColor(task.status),
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.25rem',
                                                    fontWeight: '500'
                                                }}>
                                                    {getStatusIcon(task.status)}
                                                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                                </span>
                                                <span style={{
                                                    fontSize: '0.75rem',
                                                    color: isDarkMode ? '#737373' : '#A3A3A3'
                                                }}>
                                                    Due {new Date(task.dueDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeamMembers;
