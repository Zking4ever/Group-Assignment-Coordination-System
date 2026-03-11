import { Routes, Route } from 'react-router-dom'
import LandingPage from './001LandingPage/001LandingPage.jsx'
import LoginPage from './002LoginPage/002LoginPage.jsx'
import RegisterPage from './003RegisterPage/003RegisterPage.jsx'
import ConfirmationPage from './004ConfirmationPage/004ConfirmationPage.jsx'
import HomePage from './005HomePage/005HomePage.jsx'
import GroupPage from './006GroupPage/006GroupPage.jsx'
import ProfileEdit from './007ProfileEdit/007ProfileEdit.jsx'
import AddTaskPage from './012AddTaskPage/012AddTaskPage.jsx'
import TaskDetail from './012AddTaskPage/TaskDetail.jsx'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/confirm" element={<ConfirmationPage/>}/>
        <Route path="/home" element={<HomePage/>}/>
        <Route path="/group" element={<GroupPage/>}/>
        <Route path="/profileEdit" element={<ProfileEdit/>}/>
        <Route path="/addTask" element={<AddTaskPage/>}/>
        <Route path="/taskDetail" element={<TaskDetail/>}/>
      </Routes>
    </>
  );

}

export default App
