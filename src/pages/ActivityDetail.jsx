import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import ThreeBackground from '../components/ThreeBackground';
import { ArrowLeft, User, Clock, Activity, FileText, CheckCircle } from 'lucide-react';

const ActivityDetail = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const activity = state?.activity;

    if (!activity) {
        return (
            <div style={{
                backgroundColor: isDarkMode ? '#171717' : '#FAFAFA',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isDarkMode ? '#F5F5F5' : '#171717'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <h2>Activity not found</h2>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{
                            marginTop: '1rem',
                            padding: '0.5rem 1rem',
                            backgroundColor: '#6366f1',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            backgroundColor: isDarkMode ? '#171717' : '#FAFAFA',
            minHeight: '100vh',
            padding: '2rem 5%',
            fontFamily: '"Inter", "Helvetica Neue", sans-serif',
            position: 'relative',
            transition: 'background-color 0.3s ease'
        }}>
            <ThreeBackground />

            <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
                <button
                    onClick={() => navigate('/dashboard')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'none',
                        border: 'none',
                        color: isDarkMode ? '#A3A3A3' : '#737373',
                        cursor: 'pointer',
                        marginBottom: '2rem',
                        fontSize: '0.95rem',
                        fontWeight: 500
                    }}
                >
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </button>

                <div style={{
                    backgroundColor: isDarkMode ? '#262626' : 'white',
                    borderRadius: '24px',
                    border: isDarkMode ? '1px solid #404040' : '1px solid #E5E5E5',
                    overflow: 'hidden',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }}>
                    {/* Header Banner */}
                    <div style={{
                        padding: '3rem 2rem',
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        color: 'white'
                    }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            padding: '0.5rem 1rem',
                            borderRadius: '999px',
                            marginBottom: '1.5rem',
                            fontSize: '0.875rem',
                            fontWeight: 600
                        }}>
                            <Activity size={16} />
                            Activity Log
                        </div>
                        <h1 style={{
                            fontSize: '2rem',
                            fontWeight: 700,
                            marginBottom: '1rem',
                            lineHeight: 1.2
                        }}>
                            {activity.item}
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <User size={18} style={{ opacity: 0.8 }} />
                                <span style={{ fontWeight: 500 }}>{activity.user}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Clock size={18} style={{ opacity: 0.8 }} />
                                <span style={{ fontWeight: 500 }}>{activity.time}</span>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '2rem' }}>
                        <div style={{
                            display: 'grid',
                            gap: '2rem'
                        }}>
                            {/* Action Detail */}
                            <div style={{
                                padding: '1.5rem',
                                backgroundColor: isDarkMode ? '#171717' : '#FAFAFA',
                                borderRadius: '16px',
                                border: isDarkMode ? '1px solid #404040' : '1px solid #E5E5E5'
                            }}>
                                <h3 style={{
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: isDarkMode ? '#A3A3A3' : '#737373',
                                    marginBottom: '1rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    Action Details
                                </h3>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
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
                                        fontWeight: 700,
                                        flexShrink: 0
                                    }}>
                                        {activity.avatar}
                                    </div>
                                    <div>
                                        <p style={{
                                            fontSize: '1.125rem',
                                            color: isDarkMode ? '#F5F5F5' : '#171717',
                                            marginBottom: '0.5rem',
                                            lineHeight: 1.5
                                        }}>
                                            <span style={{ fontWeight: 600 }}>{activity.user}</span>
                                            {' '}
                                            {activity.action}
                                            {' '}
                                            <span style={{ fontWeight: 600, color: '#6366f1' }}>{activity.item}</span>
                                        </p>
                                        <p style={{
                                            fontSize: '0.95rem',
                                            color: isDarkMode ? '#A3A3A3' : '#737373'
                                        }}>
                                            This action was recorded {activity.time}.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Task Context (Mock) */}
                            <div style={{
                                padding: '1.5rem',
                                backgroundColor: isDarkMode ? '#171717' : '#FAFAFA',
                                borderRadius: '16px',
                                border: isDarkMode ? '1px solid #404040' : '1px solid #E5E5E5'
                            }}>
                                <h3 style={{
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: isDarkMode ? '#A3A3A3' : '#737373',
                                    marginBottom: '1rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    Related Task Info
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <FileText size={20} color={isDarkMode ? '#A3A3A3' : '#737373'} />
                                        <span style={{ color: isDarkMode ? '#F5F5F5' : '#171717', fontWeight: 500 }}>
                                            Task: {activity.item}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <User size={20} color={isDarkMode ? '#A3A3A3' : '#737373'} />
                                        <span style={{ color: isDarkMode ? '#F5F5F5' : '#171717' }}>
                                            Assigned to: <span style={{ fontWeight: 500 }}>{activity.user}</span> (Primary)
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <CheckCircle size={20} color={isDarkMode ? '#A3A3A3' : '#737373'} />
                                        <span style={{ color: isDarkMode ? '#F5F5F5' : '#171717' }}>
                                            Status: <span style={{
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                                color: '#6366f1',
                                                fontSize: '0.875rem',
                                                fontWeight: 600
                                            }}>Active</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityDetail;
