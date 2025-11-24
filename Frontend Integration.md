# Frontend Integration Guide

Complete guide for integrating the Milestonenest backend API with your React frontend.

## Table of Contents

1. [Setup](#setup)
2. [Authentication](#authentication)
3. [API Client](#api-client)
4. [WebSocket Integration](#websocket-integration)
5. [Component Examples](#component-examples)
6. [Auto-Save Implementation](#auto-save-implementation)

---

## Setup

### Install Dependencies

```bash
npm install axios socket.io-client
```

### Environment Variables

Create `.env` file in frontend root:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## Authentication

### API Client Setup

Create `src/services/api.js`:

```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error.response?.data || error.message);
    }
);

export default api;
```

### Auth Service

Create `src/services/authService.js`:

```javascript
import api from './api';

export const authService = {
    // Register new user
    async register(name, email, password) {
        const response = await api.post('/auth/register', {
            name,
            email,
            password
        });
        
        if (response.success && response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        return response.data;
    },

    // Login user
    async login(email, password) {
        const response = await api.post('/auth/login', {
            email,
            password
        });
        
        if (response.success && response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        return response.data;
    },

    // Get current user
    async getCurrentUser() {
        const response = await api.get('/auth/me');
        return response.data;
    },

    // Update profile
    async updateProfile(data) {
        const response = await api.put('/auth/update', data);
        if (response.success) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    // Logout
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    },

    // Get token
    getToken() {
        return localStorage.getItem('token');
    },

    // Check if authenticated
    isAuthenticated() {
        return !!localStorage.getItem('token');
    }
};
```


### Update AuthContext

Update `src/context/AuthContext.jsx`:

```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const token = authService.getToken();
        const savedUser = localStorage.getItem('user');
        
        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
            setIsAuthenticated(true);
        }
        
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const data = await authService.login(email, password);
        setUser(data.user);
        setIsAuthenticated(true);
        return data;
    };

    const register = async (name, email, password) => {
        const data = await authService.register(name, email, password);
        setUser(data.user);
        setIsAuthenticated(true);
        return data;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            loading,
            login,
            register,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
```

---

## API Services

### Project Service

Create `src/services/projectService.js`:

```javascript
import api from './api';

export const projectService = {
    // Get all projects
    async getProjects() {
        const response = await api.get('/projects');
        return response.data;
    },

    // Get single project
    async getProject(id) {
        const response = await api.get(`/projects/${id}`);
        return response.data;
    },

    // Create project
    async createProject(data) {
        const response = await api.post('/projects', data);
        return response.data;
    },

    // Update project
    async updateProject(id, data) {
        const response = await api.put(`/projects/${id}`, data);
        return response.data;
    },

    // Delete project
    async deleteProject(id) {
        const response = await api.delete(`/projects/${id}`);
        return response.data;
    }
};

// Example usage in component:
/*
import { projectService } from '../services/projectService';

const MyComponent = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const data = await projectService.getProjects();
            setProjects(data);
        } catch (error) {
            console.error('Error loading projects:', error);
        }
    };

    const handleCreateProject = async (projectData) => {
        try {
            const newProject = await projectService.createProject(projectData);
            setProjects([...projects, newProject]);
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    return (
        // Your JSX
    );
};
*/
```

### Task Service

Create `src/services/taskService.js`:

```javascript
import api from './api';

export const taskService = {
    // Get all tasks with filters
    async getTasks(filters = {}) {
        const params = new URLSearchParams(filters);
        const response = await api.get(`/tasks?${params}`);
        return response.data;
    },

    // Get single task
    async getTask(id) {
        const response = await api.get(`/tasks/${id}`);
        return response.data;
    },

    // Create task
    async createTask(data) {
        const response = await api.post('/tasks', data);
        return response.data;
    },

    // Update task
    async updateTask(id, data) {
        const response = await api.put(`/tasks/${id}`, data);
        return response.data;
    },

    // Update task status
    async updateTaskStatus(id, status) {
        const response = await api.patch(`/tasks/${id}/status`, { status });
        return response.data;
    },

    // Move task (Kanban)
    async moveTask(id, status, position) {
        const response = await api.patch(`/tasks/${id}/move`, { status, position });
        return response.data;
    },

    // Delete task
    async deleteTask(id) {
        const response = await api.delete(`/tasks/${id}`);
        return response.data;
    }
};

// Example Kanban usage:
/*
const KanbanBoard = () => {
    const [tasks, setTasks] = useState({
        todo: [],
        'in-progress': [],
        review: [],
        done: []
    });

    const handleDragEnd = async (result) => {
        const { draggableId, source, destination } = result;
        
        if (!destination) return;
        
        const taskId = draggableId;
        const newStatus = destination.droppableId;
        const newPosition = destination.index;

        try {
            await taskService.moveTask(taskId, newStatus, newPosition);
            // Update local state
            // ...
        } catch (error) {
            console.error('Error moving task:', error);
        }
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            {// Your Kanban columns}
        </DragDropContext>
    );
};
*/
```

### Milestone Service

Create `src/services/milestoneService.js`:

```javascript
import api from './api';

export const milestoneService = {
    // Get all milestones
    async getMilestones(filters = {}) {
        const params = new URLSearchParams(filters);
        const response = await api.get(`/milestones?${params}`);
        return response.data;
    },

    // Get single milestone
    async getMilestone(id) {
        const response = await api.get(`/milestones/${id}`);
        return response.data;
    },

    // Create milestone
    async createMilestone(data) {
        const response = await api.post('/milestones', data);
        return response.data;
    },

    // Update milestone
    async updateMilestone(id, data) {
        const response = await api.put(`/milestones/${id}`, data);
        return response.data;
    },

    // Mark milestone as complete
    async completeMilestone(id) {
        const response = await api.patch(`/milestones/${id}/complete`);
        return response.data;
    },

    // Delete milestone
    async deleteMilestone(id) {
        const response = await api.delete(`/milestones/${id}`);
        return response.data;
    }
};
```

### Analytics Service

Create `src/services/analyticsService.js`:

```javascript
import api from './api';

export const analyticsService = {
    // Get dashboard overview
    async getOverview(projectId = null) {
        const params = projectId ? `?projectId=${projectId}` : '';
        const response = await api.get(`/analytics/overview${params}`);
        return response.data;
    },

    // Get task analytics
    async getTaskAnalytics(projectId = null) {
        const params = projectId ? `?projectId=${projectId}` : '';
        const response = await api.get(`/analytics/tasks${params}`);
        return response.data;
    },

    // Get milestone analytics
    async getMilestoneAnalytics(projectId = null) {
        const params = projectId ? `?projectId=${projectId}` : '';
        const response = await api.get(`/analytics/milestones${params}`);
        return response.data;
    },

    // Get team velocity
    async getVelocity(projectId = null) {
        const params = projectId ? `?projectId=${projectId}` : '';
        const response = await api.get(`/analytics/velocity${params}`);
        return response.data;
    }
};

// Example Dashboard usage:
/*
const Dashboard = () => {
    const [analytics, setAnalytics] = useState(null);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            const data = await analyticsService.getOverview();
            setAnalytics(data);
        } catch (error) {
            console.error('Error loading analytics:', error);
        }
    };

    return (
        <div>
            <h2>Dashboard Overview</h2>
            <div>Total Tasks: {analytics?.tasks.total}</div>
            <div>Completed: {analytics?.tasks.completed}</div>
            <div>Completion Rate: {analytics?.tasks.completionRate}%</div>
        </div>
    );
};
*/
```

### File Service

Create `src/services/fileService.js`:

```javascript
import api from './api';

export const fileService = {
    // Upload file
    async uploadFile(file, taskId = null, projectId = null) {
        const formData = new FormData();
        formData.append('file', file);
        if (taskId) formData.append('taskId', taskId);
        if (projectId) formData.append('projectId', projectId);

        const response = await api.post('/files/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Get file
    async getFile(id) {
        const response = await api.get(`/files/${id}`);
        return response.data;
    },

    // Get task files
    async getTaskFiles(taskId) {
        const response = await api.get(`/files/task/${taskId}`);
        return response.data;
    },

    // Delete file
    async deleteFile(id) {
        const response = await api.delete(`/files/${id}`);
        return response.data;
    }
};

// Example file upload component:
/*
const FileUpload = ({ taskId }) => {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const uploadedFile = await fileService.uploadFile(file, taskId);
            console.log('File uploaded:', uploadedFile);
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <input
                type="file"
                onChange={handleFileChange}
                disabled={uploading}
            />
            {uploading && <p>Uploading...</p>}
        </div>
    );
};
*/
```

---

## WebSocket Integration

### Socket Service

Create `src/services/socketService.js`:

```javascript
import { io } from 'socket.io-client';
import { authService } from './authService';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

class SocketService {
    constructor() {
        this.socket = null;
        this.listeners = new Map();
    }

    connect() {
        const token = authService.getToken();
        
        if (!token) {
            console.error('No token found, cannot connect to socket');
            return;
        }

        this.socket = io(SOCKET_URL, {
            auth: { token }
        });

        this.socket.on('connect', () => {
            console.log('Socket connected');
        });

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    // Join project room
    joinProject(projectId) {
        if (this.socket) {
            this.socket.emit('join:project', projectId);
        }
    }

    // Leave project room
    leaveProject(projectId) {
        if (this.socket) {
            this.socket.emit('leave:project', projectId);
        }
    }

    // Listen to events
    on(event, callback) {
        if (this.socket) {
            this.socket.on(event, callback);
            
            // Store listener for cleanup
            if (!this.listeners.has(event)) {
                this.listeners.set(event, []);
            }
            this.listeners.get(event).push(callback);
        }
    }

    // Remove event listener
    off(event, callback) {
        if (this.socket) {
            this.socket.off(event, callback);
        }
    }

    // Emit events
    emit(event, data) {
        if (this.socket) {
            this.socket.emit(event, data);
        }
    }

    // Clean up all listeners
    removeAllListeners() {
        if (this.socket) {
            this.listeners.forEach((callbacks, event) => {
                callbacks.forEach(callback => {
                    this.socket.off(event, callback);
                });
            });
            this.listeners.clear();
        }
    }
}

export const socketService = new SocketService();
```

### Socket Context

Create `src/context/SocketContext.jsx`:

```javascript
import { createContext, useContext, useEffect } from 'react';
import { socketService } from '../services/socketService';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            socketService.connect();
        }

        return () => {
            socketService.disconnect();
        };
    }, [isAuthenticated]);

    return (
        <SocketContext.Provider value={{ socketService }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
```

### Real-time Task Updates Example

```javascript
import { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { taskService } from '../services/taskService';

const TaskList = ({ projectId }) => {
    const [tasks, setTasks] = useState([]);
    const { socketService } = useSocket();

    useEffect(() => {
        // Load initial tasks
        loadTasks();

        // Join project room
        socketService.joinProject(projectId);

        // Listen for real-time updates
        socketService.on('task:created', handleTaskCreated);
        socketService.on('task:updated', handleTaskUpdated);
        socketService.on('task:deleted', handleTaskDeleted);
        socketService.on('task:moved', handleTaskMoved);

        return () => {
            // Cleanup
            socketService.leaveProject(projectId);
            socketService.off('task:created', handleTaskCreated);
            socketService.off('task:updated', handleTaskUpdated);
            socketService.off('task:deleted', handleTaskDeleted);
            socketService.off('task:moved', handleTaskMoved);
        };
    }, [projectId]);

    const loadTasks = async () => {
        try {
            const data = await taskService.getTasks({ project: projectId });
            setTasks(data.tasks);
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    };

    const handleTaskCreated = (task) => {
        setTasks(prev => [...prev, task]);
    };

    const handleTaskUpdated = (task) => {
        setTasks(prev => prev.map(t => t._id === task._id ? task : t));
    };

    const handleTaskDeleted = ({ id }) => {
        setTasks(prev => prev.filter(t => t._id !== id));
    };

    const handleTaskMoved = (task) => {
        setTasks(prev => prev.map(t => t._id === task._id ? task : t));
    };

    return (
        <div>
            {tasks.map(task => (
                <div key={task._id}>{task.title}</div>
            ))}
        </div>
    );
};
```

---

## Auto-Save Implementation

### Debounced Auto-Save Hook

Create `src/hooks/useAutoSave.js`:

```javascript
import { useEffect, useRef, useCallback } from 'react';

export const useAutoSave = (data, saveFunction, delay = 1000) => {
    const timeoutRef = useRef(null);
    const previousDataRef = useRef(data);

    const save = useCallback(async () => {
        try {
            await saveFunction(data);
            console.log('Auto-saved successfully');
        } catch (error) {
            console.error('Auto-save failed:', error);
        }
    }, [data, saveFunction]);

    useEffect(() => {
        // Don't save on initial render
        if (JSON.stringify(previousDataRef.current) === JSON.stringify(data)) {
            return;
        }

        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new timeout
        timeoutRef.current = setTimeout(() => {
            save();
        }, delay);

        // Update previous data
        previousDataRef.current = data;

        // Cleanup
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [data, save, delay]);
};

// Example usage:
/*
const TaskEditor = ({ taskId }) => {
    const [taskData, setTaskData] = useState({
        title: '',
        description: ''
    });

    const saveTask = async (data) => {
        await taskService.updateTask(taskId, data);
    };

    // Auto-save after 1 second of inactivity
    useAutoSave(taskData, saveTask, 1000);

    return (
        <div>
            <input
                value={taskData.title}
                onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
            />
            <textarea
                value={taskData.description}
                onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
            />
        </div>
    );
};
*/
```

---

## Complete Integration Example

### Update main.jsx

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <SocketProvider>
                <App />
            </SocketProvider>
        </AuthProvider>
    </React.StrictMode>
);
```

---

## API Response Examples

### Success Response
```json
{
    "success": true,
    "message": "Operation successful",
    "data": {
        // Response data
    }
}
```

### Error Response
```json
{
    "success": false,
    "error": "Error message",
    "statusCode": 400
}
```

### Paginated Response
```json
{
    "success": true,
    "data": {
        "tasks": [...],
        "pagination": {
            "total": 50,
            "page": 1,
            "limit": 10,
            "pages": 5
        }
    }
}
```

---

## Testing the Backend

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get projects (with token)
curl -X GET http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman

1. Import the API endpoints
2. Set up environment variables for token
3. Test each endpoint with sample data

---

## Next Steps

1. **Install backend dependencies**: `cd backend && npm install`
2. **Configure environment**: Copy `.env.example` to `.env` and update values
3. **Start MongoDB**: Ensure MongoDB is running
4. **Start backend**: `npm run dev`
5. **Integrate frontend**: Follow the examples above
6. **Test real-time features**: Open multiple browser tabs to see live updates

---

## Troubleshooting

### CORS Issues
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check CORS configuration in `server.js`

### Socket Connection Fails
- Verify token is being sent in socket auth
- Check browser console for connection errors
- Ensure backend WebSocket server is running

### File Upload Issues
- Check file size limits in `.env`
- Verify upload directory exists and has write permissions
- Check file type restrictions in `storage.js`

---

## Support

For issues or questions:
- Check backend logs: `backend/combined.log` or `backend/error.log`
- Enable debug logging: Set `NODE_ENV=development` in `.env`
- Review API responses in browser Network tab
