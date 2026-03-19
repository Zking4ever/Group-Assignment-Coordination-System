import styles from './08Task-Page.module.css'
import React from 'react'
import AssignTask from '../../Components/Task-Component/Task-Create-Component/Task-Create-Component.jsx'

function AddTaskPage({ type }) {
    // This page is now a full-screen editor as defined in Task-Create-Component
    // type can be "assignment" or "task"
    return (
        <div className={styles.taskPageBody}>
            <AssignTask type={type} />
        </div>
    );
}

export default AddTaskPage;