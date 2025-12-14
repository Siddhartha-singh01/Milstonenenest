import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Tasks from './pages/Tasks';
import Milestones from './pages/Milestones';
import Dashboard from './pages/Dashboard';  //main
import Login from './pages/Login';
import Settings from './pages/Settings';
import LandingPage from './pages/LandingPage';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import TeamMembers from './pages/TeamMembers';                                           
import ActivityDetail from './pages/ActivityDetail';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return <Layout>{children}</Layout>;
};

import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/tasks" element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            } />
            <Route path="/milestones" element={
              <ProtectedRoute>
                <Milestones />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/team-members" element={ 
              <ProtectedRoute>
                <TeamMembers />
              </ProtectedRoute>
            } />
            <Route path="/activity/:id" element={
              <ProtectedRoute>
                <ActivityDetail />   
              </ProtectedRoute>
            } />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
