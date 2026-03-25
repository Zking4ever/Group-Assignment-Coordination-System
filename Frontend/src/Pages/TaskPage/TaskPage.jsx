import styles from './TaskPage.module.css'
import TaskCreate from '../../components/tasks/TaskCreate/TaskCreate.jsx'

function TaskPage({ type }) {
    return (
        <div className={styles.taskPageBody}>
            <TaskCreate type={type} />
        </div>
    );
}

export default TaskPage;
