import '../assets/css/TaskDetailPage.css';
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchTasks, updateTask } from '@services/authService'
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

    if (loading) return <div className={"TaskDetailPage-loading"}>Loading task details...</div>;
    if (!task) return <div className={"TaskDetailPage-error"}>Task not found</div>;

    const isResponsible = task.responsibleMember === currentUser?.id;

    return (
        <div className={"TaskDetailPage-page"}>
            <header className={"TaskDetailPage-header"}>
                <button className={"TaskDetailPage-backBtn"} onClick={() => navigate(-1)}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <div className={"TaskDetailPage-titleSection"}>
                    <h1>{task.taskName}</h1>
                    <div className={"TaskDetailPage-meta"}>
                        <span>{task.responsibleMemberName || 'Assigned member'}</span>
                        <span className={"TaskDetailPage-separator"}>•</span>
                        <span>Due {new Date(task.deadLine).toLocaleDateString()}</span>
                    </div>
                </div>
            </header>

            <main className={"TaskDetailPage-content"}>
                <div className={"TaskDetailPage-mainCol"}>
                    <section className={"TaskDetailPage-description"}>
                        <div className={"TaskDetailPage-sectionTitle"}>
                            <FontAwesomeIcon icon={faExclamationCircle} />
                            Instructions
                        </div>
                        <p>{task.taskDescription || "No instructions provided."}</p>
                    </section>
                </div>

                <div className={"TaskDetailPage-sideCol"}>
                    <div className={"TaskDetailPage-workCard"}>
                        <div className={"TaskDetailPage-workHeader"}>
                            <h3>Your work</h3>
                            <span className={`${"TaskDetailPage-statusBadge"} ${("TaskDetailPage-" + (task.state?.toLowerCase() || 'yet'))}`}>
                                {task.state || 'YET'}
                            </span>
                        </div>
                        
                        <div className={"TaskDetailPage-actions"}>
                            {task.state === 'YET' && isResponsible && (
                                <button className={"TaskDetailPage-primaryBtn"} onClick={() => handleStatusUpdate('WORKING')}>
                                    Start working
                                </button>
                            )}
                            {task.state === 'WORKING' && isResponsible && (
                                <button className={"TaskDetailPage-primaryBtn"} onClick={() => handleStatusUpdate('DONE')}>
                                    Mark as done
                                </button>
                            )}
                            {task.state === 'DONE' && isResponsible && (
                                <button className={"TaskDetailPage-secondaryBtn"} onClick={() => handleStatusUpdate('WORKING')}>
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
