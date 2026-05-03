import '../assets/css/TaskPage.css';
import TaskCreate from '@components/TaskCreate.jsx'

function CreationPage({ type }) {
    return (
        <div className={"TaskPage-taskPageBody"}>
            <TaskCreate type={type} />
        </div>
    );
}

export default CreationPage;
