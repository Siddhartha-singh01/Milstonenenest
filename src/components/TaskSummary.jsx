import { useState } from 'react';
import { Sparkles, X, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { GoogleGenerativeAI } from '@google/generative-ai';

const TaskSummary = ({ tasks, onClose }) => {
    const { isDarkMode } = useTheme();
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const generateSummary = async () => {
        setIsLoading(true);
        setError('');

        try {
            // Initialize Gemini AI
            const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY');
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            // Organize tasks by status
            const todoTasks = tasks.filter(t => t.status === 'todo');
            const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
            const doneTasks = tasks.filter(t => t.status === 'done');

            // Create prompt
            const prompt = `You are a project management assistant. Analyze the following tasks and provide a concise, professional summary:

To Do (${todoTasks.length} tasks):
${todoTasks.map(t => `- ${t.title}: ${t.description || 'No description'}`).join('\n')}

In Progress (${inProgressTasks.length} tasks):
${inProgressTasks.map(t => `- ${t.title}: ${t.description || 'No description'}`).join('\n')}

Done (${doneTasks.length} tasks
${doneTasks.map(t => `- ${t.title}: ${t.description || 'No description'}`).join('\n')}

Please provide:
1. A brief overview of the project status
2. Key accomplishments (from Done tasks)
3. Current focus areas (from In Progress tasks)
4. Upcoming priorities (from To Do tasks)
5. Any potential bottlenecks or concerns

Keep it concise and actionable.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            setSummary(text);
        } catch (err) {
            console.error('Error generating summary:', err);
            setError('Failed to generate summary. Please check your API key and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem',
            animation: 'fadeIn 0.3s ease-out'
        }}>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes shimmer {
                    0% { background-position: -1000px 0; }
                    100% { background-position: 1000px 0; }
                }
                .summary-content {
                    animation: slideUp 0.4s ease-out;
                }
                .shimmer {
                    background: linear-gradient(
                        90deg,
                        ${isDarkMode ? '#262626' : '#f0f0f0'} 0%,
                        ${isDarkMode ? '#404040' : '#e0e0e0'} 50%,
                        ${isDarkMode ? '#262626' : '#f0f0f0'} 100%
                    );
                    background-size: 1000px 100%;
                    animation: shimmer 2s infinite;
                }
            `}</style>

            <div className="summary-content" style={{
                backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
                borderRadius: '24px',
                padding: '2.5rem',
                maxWidth: '800px',
                width: '100%',
                maxHeight: '80vh',
                overflow: 'auto',
                border: isDarkMode ? '1px solid #404040' : '1px solid #e5e5e5',
                boxShadow: isDarkMode
                    ? '0 20px 60px rgba(0, 0, 0, 0.5)'
                    : '0 20px 60px rgba(0, 0, 0, 0.15)',
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            padding: '0.75rem',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Sparkles size={24} color="white" />
                        </div>
                        <div>
                            <h2 style={{
                                fontSize: '1.75rem',
                                fontWeight: '700',
                                color: isDarkMode ? '#F5F5F5' : '#171717',
                                margin: 0
                            }}>
                                AI Task Summary
                            </h2>
                            <p style={{
                                fontSize: '0.875rem',
                                color: isDarkMode ? '#A3A3A3' : '#737373',
                                margin: '0.25rem 0 0 0'
                            }}>
                                Powered by Gemini AI
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: isDarkMode ? '#A3A3A3' : '#737373',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            borderRadius: '8px',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = isDarkMode ? '#262626' : '#f5f5f5'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                {!summary && !isLoading && !error && (
                    <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            width: '80px',
                            height: '80px',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem'
                        }}>
                            <Sparkles size={40} color="white" />
                        </div>
                        <h3 style={{
                            fontSize: '1.25rem',
                            fontWeight: '600',
                            color: isDarkMode ? '#F5F5F5' : '#171717',
                            marginBottom: '0.75rem'
                        }}>
                            Generate AI Summary
                        </h3>
                        <p style={{
                            color: isDarkMode ? '#A3A3A3' : '#737373',
                            marginBottom: '2rem',
                            maxWidth: '400px',
                            margin: '0 auto 2rem'
                        }}>
                            Get an intelligent overview of your tasks, progress, and priorities
                        </p>
                        <button
                            onClick={generateSummary}
                            style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                padding: '1rem 2rem',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                fontWeight: '600',
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
                            Generate Summary
                        </button>
                    </div>
                )}

                {isLoading && (
                    <div style={{ padding: '3rem 0' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <Loader2
                                size={48}
                                color={isDarkMode ? '#667eea' : '#667eea'}
                                style={{ animation: 'spin 1s linear infinite' }}
                            />
                            <style>{`
                                @keyframes spin {
                                    from { transform: rotate(0deg); }
                                    to { transform: rotate(360deg); }
                                }
                            `}</style>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[1, 2, 3, 4].map(i => (
                                <div
                                    key={i}
                                    className="shimmer"
                                    style={{
                                        height: '60px',
                                        borderRadius: '12px'
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {error && (
                    <div style={{
                        padding: '1.5rem',
                        backgroundColor: isDarkMode ? '#2d1f1f' : '#fee2e2',
                        border: `1px solid ${isDarkMode ? '#5c2626' : '#fecaca'}`,
                        borderRadius: '12px',
                        color: isDarkMode ? '#fca5a5' : '#dc2626'
                    }}>
                        <p style={{ margin: 0, fontWeight: '500' }}>{error}</p>
                    </div>
                )}

                {summary && (
                    <div style={{
                        backgroundColor: isDarkMode ? '#262626' : '#f9fafb',
                        borderRadius: '16px',
                        padding: '2rem',
                        border: isDarkMode ? '1px solid #404040' : '1px solid #e5e7eb',
                        lineHeight: '1.8'
                    }}>
                        <div style={{
                            color: isDarkMode ? '#E5E5E5' : '#374151',
                            fontSize: '1rem',
                            whiteSpace: 'pre-wrap'
                        }}>
                            {summary.split('\n').map((line, index) => {
                                // Check if line is a heading (starts with ** or #)
                                if (line.startsWith('**') || line.startsWith('#')) {
                                    return (
                                        <h3 key={index} style={{
                                            fontSize: '1.125rem',
                                            fontWeight: '700',
                                            color: isDarkMode ? '#F5F5F5' : '#171717',
                                            marginTop: index === 0 ? 0 : '1.5rem',
                                            marginBottom: '0.75rem'
                                        }}>
                                            {line.replace(/\*\*/g, '').replace(/#/g, '').trim()}
                                        </h3>
                                    );
                                }
                                return line ? <p key={index} style={{ margin: '0.5rem 0' }}>{line}</p> : <br key={index} />;
                            })}
                        </div>

                        <button
                            onClick={generateSummary}
                            style={{
                                marginTop: '2rem',
                                background: isDarkMode ? '#404040' : '#e5e7eb',
                                color: isDarkMode ? '#F5F5F5' : '#374151',
                                border: 'none',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '10px',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = isDarkMode ? '#525252' : '#d1d5db';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = isDarkMode ? '#404040' : '#e5e7eb';
                            }}
                        >
                            Regenerate Summary
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskSummary;
