import styles from './Task-Card-Component.module.css'


function TaskCard({ passedTask, user, leader }){    

    return (
        <>
            <div className={styles.container}>

                <h3 className={styles.headTitle}>{passedTask.taskName}</h3>
                <div className={styles.details}>
                    <pre>Description: {passedTask.taskDescription}</pre>
                    <p>Assigned to:{user?.firstName} {user?.lastName}</p>
                    <p>Assignment leader: {leader?.firstName} {leader?.lastName}</p>
                    <p>DeadLine: {passedTask.deadLine}</p>
                    </div>
            </div>
        </>
    );
}

export default TaskCard