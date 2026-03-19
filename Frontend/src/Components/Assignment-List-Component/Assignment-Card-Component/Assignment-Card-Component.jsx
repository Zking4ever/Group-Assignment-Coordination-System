import React, { useState } from 'react';
import styles from './Assignment-Card-Component.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faChevronDown, faChevronUp, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function AssignmentCard({ assignment, tasks, onDelete }) {
    const [isExpanded, setExpanded] = useState(false);
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const handleTaskClick = (task) => {
        localStorage.setItem("currentTask", JSON.stringify(task));
        navigate("/taskDetail");
    };

    return (
        <div className={`${styles.card} ${isExpanded ? styles.expanded : ''}`}>
            <div className={styles.header} onClick={() => setExpanded(!isExpanded)}>
                <div className={styles.headerLeft}>
                    <div className={styles.iconCircle}>
                        <FontAwesomeIcon icon={faClipboardList} />
                    </div>
                    <div className={styles.titleInfo}>
                        <h3>{assignment.assignmentName}</h3>
                        <span>Posted recently</span>
                    </div>
                </div>
                <div className={styles.headerRight}>
                    {currentUser?.id === assignment.creatorId && (
                        <button className={styles.actionBtn} onClick={(e) => { e.stopPropagation(); onDelete(); }}>
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    )}
                    <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} className={styles.chevron} />
                </div>
            </div>

            {isExpanded && (
                <div className={styles.details}>
                    <p className={styles.description}>{assignment.assignmentDescription}</p>
                    <div className={styles.divider} />
                    <div className={styles.tasksSection}>
                        <h4>Tasks ({tasks.length})</h4>
                        <div className={styles.taskList}>
                            {tasks.map(task => (
                                <div key={task.id} className={styles.taskItem} onClick={() => handleTaskClick(task)}>
                                    <div className={styles.taskInfo}>
                                        <span className={styles.taskName}>{task.taskName}</span>
                                        <span className={styles.taskDeadline}>Due: {task.deadLine}</span>
                                    </div>
                                    <span className={`${styles.status} ${styles[task.state.toLowerCase()]}`}>
                                        {task.state}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AssignmentCard;