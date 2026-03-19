import React, { useEffect, useState } from 'react'
import { fetchAssignments, fetchTasks, fetchUsers, updateTask } from '../../services/authService'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList, faUserCircle, faHistory, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import styles from './09Task-Detail-Page.module.css'
import { useNavigate } from 'react-router-dom';

function TaskDetail() {
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [assignee, setAssignee] = useState(null);
    const [isResponsible, setIsResponsible] = useState(false);
    const [isLeader, setIsLeader] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const currentUser = JSON.parse(localStorage.getItem("currentUser"));
                const currentTask = JSON.parse(localStorage.getItem("currentTask"));
                const currentAssignment = JSON.parse(localStorage.getItem("currentAssignment"));

                if (!currentUser || !currentTask) {
                    navigate('/home');
                    return;
                }

                const { data: taskData } = await fetchTasks();
                const freshTask = taskData.find(t => t.id === currentTask.id);
                if (!freshTask) return;
                setTask(freshTask);

                const { data: userData } = await fetchUsers();
                const responsible = userData.find(u => u.id === freshTask.responsibleMember);
                setAssignee(responsible);

                setIsResponsible(currentUser.id === freshTask.responsibleMember);

                const { data: assData } = await fetchAssignments();
                const assignment = assData.find(a => a.id === freshTask.parentAssignment);
                setIsLeader(assignment?.creatorId === currentUser.id);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [navigate]);

    const handleStatusUpdate = async (newState) => {
        const updatedTask = { ...task, state: newState };
        try {
            const { response } = await updateTask(task.id, updatedTask);
            if (response.ok) {
                setTask(updatedTask);
            }
        } catch (error) {
            alert("Failed to update status: " + error.message);
        }
    };

    if (loading) return <div className={styles.loading}>Loading task details...</div>;

    const isDone = task.state === 'DONE';
    const isWorking = task.state === 'WORKING';
    const isRequested = task.state === 'REQUESTED';

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.mainContent}>
                    <div className={styles.taskHeader}>
                        <div className={styles.iconCircle}>
                            <FontAwesomeIcon icon={faClipboardList} />
                        </div>
                        <div className={styles.titleArea}>
                            <h1>{task.taskName}</h1>
                            <div className={styles.meta}>
                                <span>{assignee ? `${assignee.firstName} ${assignee.lastName}` : 'Unassigned'}</span>
                                <span className={styles.dot}>•</span>
                                <span>Due {task.deadLine}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className={styles.divider} />
                    
                    <div className={styles.description}>
                        <p>{task.taskDescription || 'No instructions provided.'}</p>
                    </div>

                    <div className={styles.divider} />

                    <div className={styles.commentsSection}>
                        <h3>Class comments</h3>
                        <div className={styles.addComment}>
                            <FontAwesomeIcon icon={faUserCircle} className={styles.avatar} />
                            <input type="text" placeholder="Add a class comment..." />
                        </div>
                    </div>
                </div>

                <div className={styles.sideContent}>
                    <div className={styles.workCard}>
                        <div className={styles.workHeader}>
                            <h2>Your work</h2>
                            <span className={`${styles.statusBadge} ${styles[task.state.toLowerCase()]}`}>
                                {task.state}
                            </span>
                        </div>

                        {isResponsible && !isDone && (
                            <div className={styles.actions}>
                                {!isRequested ? (
                                    <button 
                                        className={styles.primaryBtn} 
                                        onClick={() => handleStatusUpdate('REQUESTED')}
                                    >
                                        Mark as done
                                    </button>
                                ) : (
                                    <p className={styles.infoText}>Submission pending approval</p>
                                )}
                            </div>
                        )}

                        {isLeader && isRequested && (
                            <div className={styles.actions}>
                                <button className={styles.primaryBtn} onClick={() => handleStatusUpdate('DONE')}>
                                    Approve
                                </button>
                                <button className={styles.secondaryBtn} onClick={() => handleStatusUpdate('YET')}>
                                    Return to student
                                </button>
                            </div>
                        )}

                        {isDone && (
                            <div className={styles.doneState}>
                                <FontAwesomeIcon icon={faCheckCircle} className={styles.doneIcon} />
                                <p>Work completed</p>
                            </div>
                        )}
                    </div>

                    <div className={styles.privateComments}>
                        <div className={styles.pcHeader}>
                            <FontAwesomeIcon icon={faHistory} />
                            <span>Private comments</span>
                        </div>
                        <div className={styles.addPc}>
                            <input type="text" placeholder="Add private comment..." />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaskDetail;