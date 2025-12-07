import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    CheckCircle,
    TrendingUp,
    Calendar,
    Users,
    Target,
    Activity,
    Plus,
    ArrowRight
} from 'lucide-react';
import gsap from 'gsap';
import TaskBoard from '../components/TaskBoard';
import TaskModal from '../components/TaskModal';
import ThreeBackground from '../components/ThreeBackground';
import { useProject } from '../context/ProjectContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import useResponsive from '../hooks/useResponsive';

const Dashboard = () => {
    const navigate = useNavigate();
    const sectionsRef = useRef([]);
    const [selectedPeriod, setSelectedPeriod] = useState('week');
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const { tasks } = useProject();
    const { isDarkMode } = useTheme();
    const { user } = useAuth();
    const { isMobile } = useResponsive();

    // Calculate dynamic stats from tasks
    const activeTasks = tasks.filter(t => t.status === 'todo' || t.status === 'in-progress');
    const completedTasks = tasks.filter(t => t.status === 'done');
    const todoTasks = tasks.filter(t => t.status === 'todo');
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress');

    // Dynamic stats
    const stats = [
        {
            title: 'Active Tasks',
            value: activeTasks.length.toString(),
            change: `${todoTasks.length} to do`,
            icon: CheckCircle,
            color: '#6366f1',
            trend: 'neutral'
        },
        {
            title: 'Completed',
            value: completedTasks.length.toString(),
            change: `${inProgressTasks.length} in progress`,
            icon: TrendingUp,
            color: '#22c55e',
            trend: 'up'
        },
        {
            title: 'Team Members',
            value: '8',
            change: '+2',
            icon: Users,
            color: '#ec4899',
            trend: 'up'
        },
        {
            title: 'Milestones',
            value: '5',
            change: '2 upcoming',
            icon: Target,
            color: '#f59e0b',
            trend: 'neutral'
        }
    ];

    const milestones = [
        {
            id: 1,
            title: 'Q4 Product Launch',
            progress: 75,
            dueDate: 'Dec 15, 2024',
            status: 'on-track',
            tasks: { completed: 18, total: 24 }
        },
        {
            id: 2,
            title: 'Design System 2.0',
            progress: 45,
            dueDate: 'Jan 10, 2025',
            status: 'on-track',
            tasks: { completed: 9, total: 20 }
        },
        {
            id: 3,
            title: 'Mobile App Beta',
            progress: 90,
            dueDate: 'Nov 30, 2024',
            status: 'at-risk',
            tasks: { completed: 27, total: 30 }
        }
    ];

    const recentActivity = [
        { id: 1, user: 'Sarah Chen', action: 'completed', item: 'Landing page redesign', time: '2 hours ago', avatar: 'SC' },
        { id: 2, user: 'Mike Johnson', action: 'created', item: 'API documentation task', time: '4 hours ago', avatar: 'MJ' },
        { id: 3, user: 'Alex Kim', action: 'commented on', item: 'Database migration', time: '5 hours ago', avatar: 'AK' },
        { id: 4, user: 'Emma Davis', action: 'moved', item: 'User testing to Done', time: '1 day ago', avatar: 'ED' },
        { id: 5, user: 'James Wilson', action: 'assigned', item: 'Bug fix #234 to Mike', time: '1 day ago', avatar: 'JW' }
    ];

    const getFilteredTasks = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return tasks.filter(task => {
            if (!task.dueDate) return false;
            const taskDate = new Date(task.dueDate);
            taskDate.setHours(0, 0, 0, 0);

            if (selectedPeriod === 'today') {
                return taskDate.getTime() === today.getTime();
            } else if (selectedPeriod === 'week') {
                const nextWeek = new Date(today);
                nextWeek.setDate(today.getDate() + 7);
                return taskDate >= today && taskDate <= nextWeek;
            } else if (selectedPeriod === 'month') {
                return taskDate.getMonth() === today.getMonth() &&
                    taskDate.getFullYear() === today.getFullYear();
            }
            return true;
        });
    };

    const filteredTasks = getFilteredTasks();

    const handleEditTask = (task) => {
        setTaskToEdit(task);
        setIsTaskModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsTaskModalOpen(false);
        setTaskToEdit(null);
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            sectionsRef.current.forEach((section, index) => {
                if (!section) return;
                gsap.fromTo(section,
                    { y: 30, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.6,
                        delay: index * 0.1,
                        ease: 'power3.out'
                    }
                );
            });
        });

        return () => ctx.revert();
    }, []);

    const addToRefs = (el) => {
        if (el && !sectionsRef.current.includes(el)) {
            sectionsRef.current.push(el);
        }
    };

    return (
        <div style={{
            backgroundColor: isDarkMode ? '#171717' : '#FAFAFA',
            minHeight: '100vh',
            padding: isMobile ? '1rem 3%' : '2rem 5%',
            fontFamily: '"Inter", "Helvetica Neue", sans-serif',
            position: 'relative',
            transition: 'background-color 0.3s ease'
        }}>
            {/* 3D Background */}
            <ThreeBackground />

            <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
                {/* Header */}
                <div ref={addToRefs} style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div>
                            <h1 style={{
                                fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                                fontWeight: '700',
                                letterSpacing: '-0.03em',
                                color: isDarkMode ? '#F5F5F5' : '#171717',
                                marginBottom: '0.5rem',
                                transition: 'color 0.3s ease'
                            }}>
                                Welcome back, {user?.name || user?.email?.split('@')[0] || 'User'} 👋
                            </h1>
                            <p style={{ fontSize: '1rem', color: isDarkMode ? '#A3A3A3' : '#737373', transition: 'color 0.3s ease' }}>
                                Here's what's happening with your projects today.
                            </p>
                        </div>
                        <button
                            onClick={() => setIsTaskModalOpen(!isTaskModalOpen)}
                            style={{
                                padding: '0.875rem 1.5rem',
                                borderRadius: '12px',
                                backgroundColor: isDarkMode ? '#6366f1' : '#171717',
                                color: 'white',
                                border: 'none',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'transform 0.2s, background-color 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <Plus size={20} />
                            New Task
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div ref={addToRefs} style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '3rem'
                }}>
                    {stats.map((stat, index) => (
                        <div key={index}
                            onClick={() => {
                                if (stat.title === 'Team Members') {
                                    navigate('/team-members');
                                }
                            }}
                            style={{
                                backgroundColor: isDarkMode ? '#262626' : 'white',
                                padding: '1.75rem',
                                borderRadius: '16px',
                                border: isDarkMode ? '1px solid #404040' : '1px solid #E5E5E5',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    backgroundColor: `${stat.color}15`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <stat.icon size={24} color={stat.color} />
                                </div>
                                <span style={{
                                    fontSize: '0.875rem',
                                    color: stat.trend === 'up' ? '#22c55e' : '#737373',
                                    fontWeight: 600
                                }}>
                                    {stat.change}
                                </span>
                            </div>
                            <h3 style={{ fontSize: '2rem', fontWeight: '700', color: isDarkMode ? '#F5F5F5' : '#171717', marginBottom: '0.25rem', transition: 'color 0.3s ease' }}>
                                {stat.value}
                            </h3>
                            <p style={{ fontSize: '0.875rem', color: isDarkMode ? '#A3A3A3' : '#737373', transition: 'color 0.3s ease' }}>
                                {stat.title}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '100%' : 'repeat(12, 1fr)',
                    gap: '2rem',
                    marginBottom: '3rem'
                }}>
                    {/* Kanban Board - Full Width */}
                    <div ref={addToRefs} style={{
                        gridColumn: isMobile ? '1 / -1' : '1 / -1',
                        backgroundColor: isDarkMode ? '#262626' : 'white',
                        padding: '2.5rem',
                        borderRadius: '20px',
                        border: isDarkMode ? '1px solid #404040' : '1px solid #E5E5E5',
                        transition: 'all 0.3s ease'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: isDarkMode ? '#F5F5F5' : '#171717', marginBottom: '0.5rem', transition: 'color 0.3s ease' }}>
                                    Task Board
                                </h2>
                                <p style={{ fontSize: '0.95rem', color: isDarkMode ? '#A3A3A3' : '#737373', transition: 'color 0.3s ease' }}>
                                    Drag and drop to organize your workflow
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {['Today', 'Week', 'Month'].map((period) => (
                                    <button
                                        key={period}
                                        onClick={() => setSelectedPeriod(period.toLowerCase())}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: '8px',
                                            border: 'none',
                                            backgroundColor: selectedPeriod === period.toLowerCase() ? (isDarkMode ? '#6366f1' : '#171717') : (isDarkMode ? '#404040' : '#F5F5F5'),
                                            color: selectedPeriod === period.toLowerCase() ? 'white' : (isDarkMode ? '#A3A3A3' : '#737373'),
                                            fontSize: '0.875rem',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {period}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <TaskBoard tasks={filteredTasks} onEditTask={handleEditTask} />
                    </div>

                    {/* Milestones */}
                    <div ref={addToRefs} style={{
                        gridColumn: '1 / -1',
                        backgroundColor: isDarkMode ? '#262626' : 'white',
                        padding: '2.5rem',
                        borderRadius: '20px',
                        border: isDarkMode ? '1px solid #404040' : '1px solid #E5E5E5',
                        transition: 'all 0.3s ease'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: isDarkMode ? '#F5F5F5' : '#171717', transition: 'color 0.3s ease' }}>
                                Active Milestones
                            </h2>
                            <Link to="/milestones" style={{
                                color: '#6366f1',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                            }}>
                                View all <ArrowRight size={16} />
                            </Link>
                        </div>
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            {milestones.map((milestone) => (
                                <div key={milestone.id} style={{
                                    padding: '1.5rem',
                                    backgroundColor: isDarkMode ? '#171717' : '#FAFAFA',
                                    borderRadius: '12px',
                                    border: isDarkMode ? '1px solid #404040' : '1px solid #E5E5E5',
                                    transition: 'all 0.2s',
                                    cursor: 'pointer'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = isDarkMode ? '#262626' : '#F5F5F5';
                                        e.currentTarget.style.borderColor = isDarkMode ? '#525252' : '#D4D4D4';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = isDarkMode ? '#171717' : '#FAFAFA';
                                        e.currentTarget.style.borderColor = isDarkMode ? '#404040' : '#E5E5E5';
                                    }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: isDarkMode ? '#F5F5F5' : '#171717', marginBottom: '0.5rem', transition: 'color 0.3s ease' }}>
                                                {milestone.title}
                                            </h3>
                                            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', color: isDarkMode ? '#A3A3A3' : '#737373', transition: 'color 0.3s ease' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <Calendar size={14} />
                                                    {milestone.dueDate}
                                                </span>
                                                <span>
                                                    {milestone.tasks.completed}/{milestone.tasks.total} tasks
                                                </span>
                                            </div>
                                        </div>
                                        <span style={{
                                            padding: '0.375rem 0.75rem',
                                            borderRadius: '6px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            backgroundColor: milestone.status === 'on-track' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                            color: milestone.status === 'on-track' ? '#22c55e' : '#f59e0b'
                                        }}>
                                            {milestone.status === 'on-track' ? 'On Track' : 'At Risk'}
                                        </span>
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span style={{ fontSize: '0.875rem', color: isDarkMode ? '#A3A3A3' : '#737373', transition: 'color 0.3s ease' }}>Progress</span>
                                            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: isDarkMode ? '#F5F5F5' : '#171717', transition: 'color 0.3s ease' }}>{milestone.progress}%</span>
                                        </div>
                                        <div style={{
                                            width: '100%',
                                            height: '8px',
                                            backgroundColor: isDarkMode ? '#404040' : '#E5E5E5',
                                            borderRadius: '999px',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                width: `${milestone.progress}%`,
                                                height: '100%',
                                                backgroundColor: milestone.status === 'on-track' ? '#22c55e' : '#f59e0b',
                                                transition: 'width 0.3s ease'
                                            }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div ref={addToRefs} style={{
                        gridColumn: '1 / -1',
                        backgroundColor: isDarkMode ? '#262626' : 'white',
                        padding: '2.5rem',
                        borderRadius: '20px',
                        border: isDarkMode ? '1px solid #404040' : '1px solid #E5E5E5',
                        transition: 'all 0.3s ease'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: isDarkMode ? '#F5F5F5' : '#171717', transition: 'color 0.3s ease' }}>
                                Recent Activity
                            </h2>
                            <Activity size={20} color={isDarkMode ? '#A3A3A3' : '#737373'} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {recentActivity.map((activity) => (
                                <div key={activity.id}
                                    onClick={() => navigate(`/activity/${activity.id}`, { state: { activity } })}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        padding: '1rem',
                                        borderRadius: '12px',
                                        transition: 'background-color 0.2s',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#171717' : '#FAFAFA'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        backgroundColor: '#6366f1',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        flexShrink: 0
                                    }}>
                                        {activity.avatar}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '0.95rem', color: isDarkMode ? '#F5F5F5' : '#171717', marginBottom: '0.25rem', transition: 'color 0.3s ease' }}>
                                            <span style={{ fontWeight: 600 }}>{activity.user}</span>
                                            {' '}<span style={{ color: isDarkMode ? '#A3A3A3' : '#737373' }}>{activity.action}</span>
                                            {' '}<span style={{ fontWeight: 500 }}>{activity.item}</span>
                                        </p>
                                        <p style={{ fontSize: '0.875rem', color: isDarkMode ? '#A3A3A3' : '#A3A3A3' }}>
                                            {activity.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {isTaskModalOpen &&
                (
                    <TaskModal onClose={handleCloseModal} taskToEdit={taskToEdit} />
                )
            }
        </div>
    );
};

export default Dashboard;
