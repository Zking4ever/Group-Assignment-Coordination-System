import '../assets/css/TaskDetailPage.css';
import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTaskDetail, updateTask, startTaskWork, submitTaskWork, verifyTaskSubmission, getAssignmentDetail, recordTimeExpiry } from '@services/authService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheckCircle, faClock, faUserCircle, faExclamationCircle, faFileUpload, faLink, faFileAlt, faTimes, faCheck, faRedo, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { formatRelativeDeadline } from '../utils/timeUtils';

function TaskDetailPage() {
    const { groupId, assignmentId, taskId } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Submission form state
    const [report, setReport] = useState("");
    const [link, setLink] = useState("");
    const [file, setFile] = useState(null);
    const [isPaused, setIsPaused] = useState(false);

    const timerRef = useRef(null);

    const loadTask = async () => {
        try {
            const currentTask = await getTaskDetail(taskId);
            setTask(currentTask);

            const currentAss = await getAssignmentDetail(assignmentId);
            setAssignment(currentAss);

            if (currentTask.state === 'working' && currentTask.workExpiryTime) {
                const expiry = new Date(currentTask.workExpiryTime).getTime();
                const now = new Date().getTime();
                const remaining = Math.max(0, Math.floor((expiry - now) / 1000));
                setTimeLeft(remaining);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        setCurrentUser(user);
        loadTask();
    }, [taskId]);

    useEffect(() => {
        if (timeLeft > 0 && task?.state === 'working' && !isPaused) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        handleSessionEnd();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [timeLeft, task?.state, isPaused]);

    const handleSessionEnd = async () => {
        await recordTimeExpiry(taskId, currentUser.id);
        toast("Work session expired. Progress recorded.", { icon: '⏰' });

        loadTask(); // Refresh to see state change from server if any
    };

    const handleStartWork = async () => {
        try {
            const response = await startTaskWork(taskId, currentUser.id);
            if (response.ok) {
                toast.success("Work timer started! You have 20 minutes.");
                loadTask();
            } else {
                toast.error("Failed to start work");
            }
        } catch (err) {
            toast.error("Error starting work");
        }
    };

    const handleSubmitWork = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("report", report);
        formData.append("link", link);
        if (file) formData.append("file", file);

        try {
            const response = await submitTaskWork(taskId, formData);
            if (response.ok) {
                toast.success("Work submitted for verification!");
                loadTask();
            } else {
                toast.error("Submission failed");
            }
        } catch (err) {
            toast.error("Error submitting work");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerifyStatus = async (status) => {
        const feedback = prompt(`Enter feedback for ${status}:`) || "";
        try {
            const { response } = await verifyTaskSubmission(taskId, status, feedback);
            if (response.ok) {
                toast.success(`Task ${status.toLowerCase()} successfully`);
                loadTask();
            }
        } catch (err) {
            toast.error("Failed to verify submission");
        }
    };

    if (loading) return <div className={"TaskDetailPage-loading"}>Loading task details...</div>;
    if (!task) return <div className={"TaskDetailPage-error"}>Task not found</div>;

    const isResponsible = task.responsibleMember === currentUser?.id;
    const isOwner = assignment?.creatorId === currentUser?.id;

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

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
                        <span className="Deadline-expressive">{formatRelativeDeadline(task.deadLine)}</span>
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

                    {task.submissionStatus && (
                        <section className={"TaskDetailPage-submissionInfo"}>
                            <div className={"TaskDetailPage-sectionTitle"}>
                                <FontAwesomeIcon icon={faFileAlt} />
                                Last Submission
                                <span className={`Submission-status-tag ${task.submissionStatus?.toLowerCase()}`}>
                                    {task.submissionStatus}
                                </span>
                            </div>
                            <div className="Submission-details">
                                <p><strong>Report:</strong> {task.submissionReport || "No report provided."}</p>
                                {task.submissionLink && <p><strong>Link:</strong> <a href={task.submissionLink} target="_blank" rel="noreferrer">{task.submissionLink}</a></p>}
                                {task.submissionFile && (
                                    <p><strong>File:</strong> <a href={`http://localhost:5000${task.submissionFile}`} target="_blank" rel="noreferrer">Download Attachment</a></p>
                                )}
                            </div>
                        </section>
                    )}

                    {isResponsible && (task.state === 'working' || task.state === 'REJECTED' || task.state === 'yet') && (
                        <section className={"TaskDetailPage-submissionForm"}>
                            <div className={"TaskDetailPage-sectionTitle"}>
                                <FontAwesomeIcon icon={faFileUpload} />
                                Submit your work
                            </div>
                            <form onSubmit={handleSubmitWork}>
                                <div className="Form-group">
                                    <label>Action Report</label>
                                    <textarea
                                        placeholder="Describe what you worked on..."
                                        value={report}
                                        onChange={(e) => setReport(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                                <div className="Form-row">
                                    <div className="Form-group">
                                        <label><FontAwesomeIcon icon={faLink} /> External Link</label>
                                        <input
                                            type="url"
                                            placeholder="GitHub, Drive, etc."
                                            value={link}
                                            onChange={(e) => setLink(e.target.value)}
                                        />
                                    </div>
                                    <div className="Form-group">
                                        <label><FontAwesomeIcon icon={faFileUpload} /> File Attachment</label>
                                        <input
                                            type="file"
                                            onChange={(e) => setFile(e.target.files[0])}
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="TaskDetailPage-primaryBtn" disabled={isSubmitting}>
                                    {isSubmitting ? 'Submitting...' : 'Turn In Work'}
                                </button>
                            </form>
                        </section>
                    )}
                </div>

                <div className={"TaskDetailPage-sideCol"}>
                    <div className={"TaskDetailPage-workCard"}>
                        <div className={"TaskDetailPage-workHeader"}>
                            <h3>Work Status</h3>
                            <span className={`${"TaskDetailPage-statusBadge"} ${("TaskDetailPage-" + (task.state?.toLowerCase() || 'yet'))}`}>
                                {task.state || 'yet'}
                            </span>
                        </div>

                        <div className={"TaskDetailPage-actions"}>
                            {(task.state === 'yet' || task.state === 'REJECTED') && isResponsible && (
                                <button className={"TaskDetailPage-primaryBtn"} onClick={handleStartWork}>
                                    <FontAwesomeIcon icon={faClock} /> Start working (20min)
                                </button>
                            )}

                            {task.state === 'working' && isResponsible && (
                                <div className="Timer-display">
                                    <div className="Timer-countdown">{formatTime(timeLeft)}</div>
                                    <p>Time remaining to record activity</p>
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                        <button className="TaskDetailPage-primaryBtn" onClick={() => setIsPaused(!isPaused)}>
                                            <FontAwesomeIcon icon={isPaused ? faPlay : faPause} /> {isPaused ? 'Resume' : 'Pause'}
                                        </button>
                                        <button className="TaskDetailPage-secondaryBtn" onClick={() => loadTask()}>
                                            <FontAwesomeIcon icon={faTimes} /> Stop
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {isOwner && task.state === 'submitted' && (
                        <div className={"TaskDetailPage-verificationCard"}>
                            <h3>Verification Required</h3>
                            <p>This work was submitted by <strong>{task.responsibleMemberName}</strong>. Review the details and decide.</p>
                            <div className="Verification-actions">
                                <button className="Verify-accept" onClick={() => handleVerifyStatus('ACCEPTED')}>
                                    <FontAwesomeIcon icon={faCheck} /> Accept
                                </button>
                                <button className="Verify-reject" onClick={() => handleVerifyStatus('REJECTED')}>
                                    <FontAwesomeIcon icon={faTimes} /> Reject
                                </button>
                                <button className="Verify-reassign" onClick={() => handleVerifyStatus('REASSIGNED')}>
                                    <FontAwesomeIcon icon={faRedo} /> Reassign
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default TaskDetailPage;
