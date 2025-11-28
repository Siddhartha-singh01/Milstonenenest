# Milestonenest Backend

Complete backend system for Milestonenest project management application.

## Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.io for WebSocket
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer (local) + AWS S3 ready
- **Validation**: express-validator
- **Security**: helmet, cors, bcrypt                 
- **Logging**: winston

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── socket.js
│   │   └── storage.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Task.js
│   │   ├── Milestone.js
│   │   └── File.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   ├── milestoneController.js
│   │   ├── analyticsController.js
│   │   └── fileController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── tasks.js
│   │   ├── milestones.js
│   │   ├── analytics.js
│   │   └── files.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   ├── errorHandler.js
│   │   └── upload.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── taskService.js
│   │   ├── milestoneService.js
│   │   └── fileService.js
│   ├── utils/
│   │   ├── logger.js
│   │   └── helpers.js
│   ├── socket/
│   │   └── handlers.js
│   └── server.js
├── uploads/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Quick Start

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
# Start MongoDB locally or use MongoDB Atlas

# Run development server
npm run dev

# Run production server
npm start
```

## Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/milestonenest

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:5173

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# AWS S3 (Optional)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_BUCKET_NAME=milestonenest-files
AWS_REGION=us-east-1
USE_S3=false
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update` - Update user profile

### Projects
- `GET /api/projects` - Get all user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks` - Get all tasks (with filters)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/status` - Update task status
- `PATCH /api/tasks/:id/move` - Move task (Kanban)

### Milestones
- `GET /api/milestones` - Get all milestones
- `POST /api/milestones` - Create new milestone
- `GET /api/milestones/:id` - Get milestone by ID
- `PUT /api/milestones/:id` - Update milestone
- `DELETE /api/milestones/:id` - Delete milestone
- `PATCH /api/milestones/:id/complete` - Mark milestone complete

### Analytics
- `GET /api/analytics/overview` - Get dashboard overview
- `GET /api/analytics/tasks` - Get task analytics
- `GET /api/analytics/milestones` - Get milestone analytics
- `GET /api/analytics/velocity` - Get team velocity

### Files
- `POST /api/files/upload` - Upload file
- `GET /api/files/:id` - Get file by ID
- `DELETE /api/files/:id` - Delete file
- `GET /api/files/task/:taskId` - Get files for task

## WebSocket Events

### Client → Server
- `join:project` - Join project room
- `leave:project` - Leave project room
- `task:update` - Update task
- `task:move` - Move task in Kanban
- `milestone:update` - Update milestone

### Server → Client
- `task:created` - New task created
- `task:updated` - Task updated
- `task:deleted` - Task deleted
- `task:moved` - Task moved
- `milestone:created` - New milestone created
- `milestone:updated` - Milestone updated
- `milestone:deleted` - Milestone deleted
- `user:joined` - User joined project
- `user:left` - User left project

## Features

✅ JWT Authentication
✅ Real-time updates via WebSocket
✅ File uploads (local + S3 ready)
✅ Auto-save support
✅ Multi-user collaboration
✅ Full CRUD operations
✅ Request validation
✅ Error handling
✅ Logging & monitoring
✅ CORS enabled
✅ Security headers
✅ Rate limiting
✅ Database indexing

## Database Models

### User
- email, password, name, avatar
- projects (references)
- createdAt, updatedAt

### Project
- name, description, color
- owner (User reference)
- members (User references)
- createdAt, updatedAt

### Task
- title, description, status, priority
- project (Project reference)
- assignee (User reference)
- dueDate, tags, position
- createdAt, updatedAt

### Milestone
- title, description, status
- project (Project reference)
- dueDate, progress, tasks
- createdAt, updatedAt

### File
- filename, originalName, mimetype, size
- path, url
- task (Task reference)
- uploadedBy (User reference)
- createdAt

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- HTTP security headers (helmet)
- CORS configuration
- Request validation
- Rate limiting
- File upload restrictions
- XSS protection

## Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Docker (Optional)
```bash
docker-compose up -d
```

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## License

MIT


