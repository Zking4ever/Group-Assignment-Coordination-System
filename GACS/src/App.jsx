import { Routes, Route } from 'react-router-dom'
import LandingPage from './Pages/01Landing-Page/01Landing-Page.jsx'
import LoginPage from './Pages/02Login-Page/02Login-Page.jsx'
import RegisterPage from './Pages/03Register-Page/03Register-Page.jsx'
import ConfirmationPage from './Pages/04Confirm-Page/04Confirm-Page.jsx'
import HomePage from './Pages/05Group-List-Page/05Group-List-Page.jsx'
import GroupPage from './Pages/06Assignment-List-Page/06Assignment-List-Page.jsx'
import ProfileEdit from './Pages/07Profile-Page/07Profile-Page.jsx'
import AddTaskPage from './Pages/08Task-Page/08Task-Page.jsx'
import TaskDetail from './Pages/09Task-Detail-Page/09Task-Detail-Page.jsx'

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
