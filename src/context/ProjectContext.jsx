import { createContext, useContext, useState, useEffect } from 'react';

const ProjectContext = createContext();

export const useProject = () => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error('useProject must be used within a ProjectProvider');
    }
    return context;
};
                      
export const ProjectProvider = ({ children }) => {
    // Initial mock data
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem('milestonenest_tasks_v2');
        const parsed = saved ? JSON.parse(saved) : null;
        if (parsed && parsed.length > 0) return parsed;

        return [
            {
                id: '1',
                title: 'Design System 2.0',
                description: 'Create a unified design system for the application including color palette, typography, and component library.',
                status: 'in-progress',
                priority: 'high',
                assignee: 'Sarah Chen',
                dueDate: '2025-11-24', // Inside current week
                createdAt: new Date().toISOString(),
                milestoneId: '1'
            },
            {
                id: '2',
                title: 'User Authentication',
                description: 'Implement JWT based authentication with refresh tokens and secure cookie storage.',
                status: 'done',
                priority: 'high',
                assignee: 'Mike Johnson',
                dueDate: '2025-11-21', // Today
                createdAt: new Date().toISOString(),
                milestoneId: '1'
            },
            {
                id: '3',
                title: 'Dashboard Analytics',
                description: 'Build the main dashboard with charts and graphs showing project progress and team velocity.',
                status: 'in-progress',
                priority: 'medium',
                assignee: 'Alex Kim',
                dueDate: '2025-11-26', // Inside current week
                createdAt: new Date().toISOString(),
                milestoneId: '1'
            },
            {
                id: '4',
                title: 'API Documentation',
                description: 'Document all API endpoints using Swagger/OpenAPI specification.',
                status: 'todo',
                priority: 'medium',
                assignee: 'Emma Davis',
                dueDate: '2025-12-10',
                createdAt: new Date().toISOString(),
                milestoneId: '2'
            },
            {
                id: '5',
                title: 'Mobile Responsive Layout',
                description: 'Ensure all pages are fully responsive and work well on mobile devices.',
                status: 'todo',
                priority: 'low',
                assignee: 'James Wilson',
                dueDate: '2025-12-25',
                createdAt: new Date().toISOString(),
                milestoneId: '2'
            },
            {
                id: '6',
                title: 'Fix Navigation Bug',
                description: 'Sidebar navigation does not close on mobile when clicking a link.',
                status: 'done',
                priority: 'high',
                assignee: 'Sarah Chen',
                dueDate: '2025-11-18',
                createdAt: new Date().toISOString(),
                milestoneId: '3'
            },
            {
                id: '7',
                title: 'Verify Dashboard Features',
                description: 'Ensure all interactive elements on the dashboard are working correctly.',
                status: 'todo',
                priority: 'high',
                assignee: 'Alex Kim',
                dueDate: '2025-11-22', // Within the default "Week" filter
                createdAt: new Date().toISOString(),
                milestoneId: '1'
            }
        ];
    });

    const [milestones, setMilestones] = useState(() => {
        const saved = localStorage.getItem('milestonenest_milestones_v2');
        const parsed = saved ? JSON.parse(saved) : null;
        if (parsed && parsed.length > 0) return parsed;

        return [
            {
                id: '1',
                title: 'Q4 Product Launch',
                description: 'Official launch of version 2.0 features.',
                dueDate: '2025-12-15',
                status: 'on-track',
                progress: 75
            },
            {
                id: '2',
                title: 'Mobile App Beta',
                description: 'Release beta version to testflight users.',
                dueDate: '2025-11-30',
                status: 'at-risk',
                progress: 90
            },
            {
                id: '3',
                title: 'Infrastructure Migration',
                description: 'Move all services to the new cloud provider.',
                dueDate: '2026-01-20',
                status: 'on-track',
                progress: 30
            }
        ];
    });

    useEffect(() => {
        localStorage.setItem('milestonenest_tasks_v2', JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        localStorage.setItem('milestonenest_milestones_v2', JSON.stringify(milestones));
    }, [milestones]);

    const addTask = (task) => {
        setTasks(prev => [...prev, { ...task, id: crypto.randomUUID(), createdAt: new Date().toISOString() }]);
    };

    const updateTask = (id, updates) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    };

    const deleteTask = (id) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    const addMilestone = (milestone) => {
        setMilestones(prev => [...prev, { ...milestone, id: crypto.randomUUID() }]);
    };

    const updateMilestone = (id, updates) => {
        setMilestones(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    };

    const deleteMilestone = (id) => {
        setMilestones(prev => prev.filter(m => m.id !== id));
    };

    return (
        <ProjectContext.Provider value={{
            tasks,
            milestones,
            addTask,
            updateTask,
            deleteTask,
            addMilestone,
            updateMilestone,
            deleteMilestone
        }}>
            {children}
        </ProjectContext.Provider>
    );
};
