import styles from './08Task-Page.module.css'
import React from 'react'
import AssignTask from '../../Components/Task-Component/Task-Create-Component/Task-Create-Component.jsx'

function AddTaskPage() {
    // This page is now a full-screen editor as defined in Task-Create-Component
    return (
        <div className={styles.taskPageBody}>
            <AssignTask />
        </div>
    );
}

export default AddTaskPage;