import React, { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import LandingPage from './Pages/01Landing-Page/01Landing-Page.jsx'
import LoginPage from './Pages/02Login-Page/02Login-Page.jsx'
import RegisterPage from './Pages/03Register-Page/03Register-Page.jsx'
import ConfirmationPage from './Pages/04Confirm-Page/04Confirm-Page.jsx'
import HomePage from './Pages/05Group-List-Page/05Group-List-Page.jsx'
import GroupPage from './Pages/06Assignment-List-Page/06Assignment-List-Page.jsx'
import ProfileEdit from './Pages/07Profile-Page/07Profile-Page.jsx'
import AddTaskPage from './Pages/08Task-Page/08Task-Page.jsx'
import TaskDetail from './Pages/09Task-Detail-Page/09Task-Detail-Page.jsx'
import Header from './Components/Header-Component/Header-Component.jsx'
import Sidebar from './Components/Sidebar/Sidebar.jsx'
import AssignmentDetailPage from './Pages/10Assignment-Detail-Page/AssignmentDetailPage.jsx'

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
        <Route path="/profileEdit" element={<ProfileEdit />} />

        {/* Group Routes */}
        <Route path="/group/:groupId" element={<GroupPage />} />
        <Route path="/group/:groupId/createAssignment" element={<AddTaskPage type="assignment" />} />
        
        {/* Assignment Routes within a Group */}
        <Route path="/group/:groupId/assignment/:assignmentId" element={<AssignmentDetailPage />} />
        <Route path="/group/:groupId/assignment/:assignmentId/addTask" element={<AddTaskPage type="task" />} />
        
        {/* Task Detail */}
        <Route path="/group/:groupId/assignment/:assignmentId/task/:taskId" element={<TaskDetail />} />
        
        {/* Fallback/Legacy (Optional, but good for safety during migration) */}
        <Route path="/addTask" element={<AddTaskPage />} />
        <Route path="/taskDetail" element={<TaskDetail />} />
      </Routes>
    </Layout>
  );
}

export default App