import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAssignments, fetchTasks } from '@services/authService';
import '../assets/css/AssignmentDetailPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowLeft, faClipboardList, faChevronRight } from '@fortawesome/free-solid-svg-icons';

function AssignmentDetailPage() {
    const { groupId, assignmentId } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        setCurrentUser(user);

        const loadData = async () => {
            try {
                const { data: allAssignments } = await fetchAssignments();
                const currentAss = allAssignments.find(a => a.id === assignmentId);
                setAssignment(currentAss);

                const { data: allTasks } = await fetchTasks();
                const assTasks = allTasks.filter(t => t.parentAssignment === assignmentId);
                setTasks(assTasks);
            } catch (error) {
                console.error("Failed to load assignment details:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [assignmentId]);

    if (loading) return <div className={"AssignmentDetailPage-loading"}>Loading assignment...</div>;
    if (!assignment) return <div className={"AssignmentDetailPage-error"}>Assignment not found</div>;

    const isOwner = assignment.creatorId === currentUser?.id;

    return (
        <div className={"AssignmentDetailPage-page"}>
            <header className={"AssignmentDetailPage-header"}>
                <button className={"AssignmentDetailPage-backBtn"} onClick={() => navigate(`/group/${groupId}`)}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <div className={"AssignmentDetailPage-headerInfo"}>
                    <FontAwesomeIcon icon={faClipboardList} className={"AssignmentDetailPage-icon"} />
                    <div>
                        <h1>{assignment.assignmentName}</h1>
                        <p>{assignment.assignmentDescription}</p>
                    </div>
                </div>
            </header>

            <main className={"AssignmentDetailPage-content"}>
                <div className={"AssignmentDetailPage-taskSection"}>
                    <div className={"AssignmentDetailPage-sectionHeader"}>
                        <h2>Tasks</h2>
                        {isOwner && (
                            <button 
                                className={"AssignmentDetailPage-addTaskBtn"}
                                onClick={() => navigate(`/group/${groupId}/assignment/${assignmentId}/addTask`)}
                            >
                                <FontAwesomeIcon icon={faPlus} />
                                Add Task
                            </button>
                        )}
                    </div>
                    
                    <div className={"AssignmentDetailPage-taskList"}>
                        {tasks.length === 0 ? (
                            <div className={"AssignmentDetailPage-empty"}>No tasks assigned to this assignment yet.</div>
                        ) : (
                            tasks.map(task => (
                                <div key={task.id} className={"AssignmentDetailPage-taskCard"} onClick={() => navigate(`/group/${groupId}/assignment/${assignmentId}/task/${task.id}`)}>
                                    <div className={"AssignmentDetailPage-taskInfo"}>
                                        <h3>{task.taskName}</h3>
                                        <div className={"AssignmentDetailPage-meta"}>
                                            <span className={`${"AssignmentDetailPage-status"} ${("AssignmentDetailPage-" + (task.state?.toLowerCase()))}`}>
                                                {task.state}
                                            </span>
                                            <span className={"AssignmentDetailPage-date"}>Due: {new Date(task.deadLine).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <FontAwesomeIcon icon={faChevronRight} className={"AssignmentDetailPage-arrow"} />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AssignmentDetailPage;
