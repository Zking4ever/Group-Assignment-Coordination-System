import styles from './TaskDetailPage.module.css'
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchTasks, updateTask } from '../../services/authService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheckCircle, faClock, faUserCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

function TaskDetailPage() {
    const { groupId, assignmentId, taskId } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        setCurrentUser(user);

        const loadTask = async () => {
            try {
                const { data: allTasks } = await fetchTasks();
                const currentTask = allTasks.find(t => t.id === taskId);
                setTask(currentTask);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadTask();
    }, [taskId]);

    const handleStatusUpdate = async (newState) => {
        try {
            const { response } = await updateTask(taskId, { state: newState });
            if (response.ok) {
                setTask(prev => ({ ...prev, state: newState }));
            }
        } catch (error) {
            alert(error.message);
        }
    };

    if (loading) return <div className={styles.loading}>Loading task details...</div>;
    if (!task) return <div className={styles.error}>Task not found</div>;

    const isResponsible = task.responsibleMember === currentUser?.id;

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <button className={styles.backBtn} onClick={() => navigate(-1)}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <div className={styles.titleSection}>
                    <h1>{task.taskName}</h1>
                    <div className={styles.meta}>
                        <span>{task.responsibleMemberName || 'Assigned member'}</span>
                        <span className={styles.separator}>•</span>
                        <span>Due {new Date(task.deadLine).toLocaleDateString()}</span>
                    </div>
                </div>
            </header>

            <main className={styles.content}>
                <div className={styles.mainCol}>
                    <section className={styles.description}>
                        <div className={styles.sectionTitle}>
                            <FontAwesomeIcon icon={faExclamationCircle} />
                            Instructions
                        </div>
                        <p>{task.taskDescription || "No instructions provided."}</p>
                    </section>
                </div>

                <div className={styles.sideCol}>
                    <div className={styles.workCard}>
                        <div className={styles.workHeader}>
                            <h3>Your work</h3>
                            <span className={`${styles.statusBadge} ${styles[task.state?.toLowerCase() || 'yet']}`}>
                                {task.state || 'YET'}
                            </span>
                        </div>
                        
                        <div className={styles.actions}>
                            {task.state === 'YET' && isResponsible && (
                                <button className={styles.primaryBtn} onClick={() => handleStatusUpdate('WORKING')}>
                                    Start working
                                </button>
                            )}
                            {task.state === 'WORKING' && isResponsible && (
                                <button className={styles.primaryBtn} onClick={() => handleStatusUpdate('DONE')}>
                                    Mark as done
                                </button>
                            )}
                            {task.state === 'DONE' && isResponsible && (
                                <button className={styles.secondaryBtn} onClick={() => handleStatusUpdate('WORKING')}>
                                    Unsubmit
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default TaskDetailPage;
