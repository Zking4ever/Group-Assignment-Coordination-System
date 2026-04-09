import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import LandingPage from './pages/LandingPage/LandingPage.jsx'
import LoginPage from './pages/LoginPage/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage/RegisterPage.jsx'
import ConfirmationPage from './pages/ConfirmationPage/ConfirmationPage.jsx'
import HomePage from './pages/HomePage/HomePage.jsx'
import GroupPage from './pages/GroupPage/GroupPage.jsx'
import ProfilePage from './pages/ProfilePage/ProfilePage.jsx'
import TaskPage from './pages/TaskPage/TaskPage.jsx'
import TaskDetailPage from './pages/TaskDetailPage/TaskDetailPage.jsx'
import AssignmentDetailPage from './pages/AssignmentDetailPage/AssignmentDetailPage.jsx'
import Header from './components/layout/Header/Header.jsx'
import Sidebar from './components/layout/Sidebar/Sidebar.jsx'

function Layout({ children, setDashboardView }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const hideLayout = ['/', '/login', '/register', '/confirm'].includes(location.pathname);

  if (hideLayout) return <>{children}</>;

  return (
    <div className="app-container">
      <Header
        toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
        setView={setDashboardView}
      />
      <div className="main-layout">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  const [dashboardView, setDashboardView] = useState("home");

  return (
    <Layout setDashboardView={setDashboardView}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/confirm" element={<ConfirmationPage />} />

        {/* Home/Dashboard */}
        <Route path="/home" element={<HomePage view={dashboardView} setView={setDashboardView} />} />

        {/* Profile */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* Group Routes */}
        <Route path="/group/:groupId" element={<GroupPage />} />
        <Route path="/group/:groupId/createAssignment" element={<TaskPage type="assignment" />} />

        {/* Assignment Routes within a Group */}
        <Route path="/group/:groupId/assignment/:assignmentId" element={<AssignmentDetailPage />} />
        <Route path="/group/:groupId/assignment/:assignmentId/addTask" element={<TaskPage type="task" />} />

        {/* Task Detail */}
        <Route path="/group/:groupId/assignment/:assignmentId/task/:taskId" element={<TaskDetailPage />} />
      </Routes>
    </Layout>
  );
}

export default App