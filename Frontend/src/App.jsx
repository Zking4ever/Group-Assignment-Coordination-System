import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import LandingPage from './Pages/LandingPage/LandingPage.jsx'
import LoginPage from './Pages/LoginPage/LoginPage.jsx'
import RegisterPage from './Pages/RegisterPage/RegisterPage.jsx'
import ConfirmationPage from './Pages/ConfirmationPage/ConfirmationPage.jsx'
import HomePage from './Pages/HomePage/HomePage.jsx'
import GroupPage from './Pages/GroupPage/GroupPage.jsx'
import ProfilePage from './Pages/ProfilePage/ProfilePage.jsx'
import TaskPage from './Pages/TaskPage/TaskPage.jsx'
import TaskDetailPage from './Pages/TaskDetailPage/TaskDetailPage.jsx'
import AssignmentDetailPage from './Pages/AssignmentDetailPage/AssignmentDetailPage.jsx'
import Header from './Components/layout/Header/Header.jsx'
import Sidebar from './Components/layout/Sidebar/Sidebar.jsx'

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