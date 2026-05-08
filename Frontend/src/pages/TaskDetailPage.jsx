import '../assets/css/TaskDetailPage.css';
import React, { useState, useEffect, useRef } from 'react'
import { Panel,Group, Separator } from 'react-resizable-panels'
import { useParams, useNavigate } from 'react-router-dom'
import { getTaskDetail, updateTask, startTaskWork, submitTaskWork, verifyTaskSubmission, getAssignmentDetail, recordTimeExpiry } from '@services/Service'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheckCircle, faClock, faUserCircle, faExclamationCircle, faFileUpload, faLink, faFileAlt, faTimes, faCheck, faRedo, faPlay,faGripLines,faGripLinesVertical, faFolder,faFilePdf } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { formatRelativeDeadline } from '../utils/timeUtils';
import Submissions from '../components/Submissions';

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
    const [fileInFocus, setFileInFocus] = useState(false);

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

        // <div className={"TaskDetailPage-actions"}>
        //                         {(task.state === 'yet' || task.state === 'REJECTED') && isResponsible && (
        //                             <button className={"TaskDetailPage-primaryBtn"} onClick={handleStartWork}>
        //                                 <FontAwesomeIcon icon={faClock} /> Start working (20min)
        //                             </button>
        //                         )}
        //                         {task.state === 'working' && isResponsible && (
        //                             <div className="Timer-display">
        //                                 <div className="Timer-countdown">{formatTime(timeLeft)}</div>
        //                                 <p>Time remaining to record activity</p>
        //                                 <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        //                                     <button className="TaskDetailPage-primaryBtn" onClick={() => setIsPaused(!isPaused)}>
        //                                         <FontAwesomeIcon icon={isPaused ? faPlay : faPause} /> {isPaused ? 'Resume' : 'Pause'}
        //                                     </button>
        //                                     <button className="TaskDetailPage-secondaryBtn" onClick={() => loadTask()}>
        //                                         <FontAwesomeIcon icon={faTimes} /> Stop
        //                                     </button>
        //                                 </div>
        //                             </div>
        //                         )}
        //                     </div>

        <div className={"TaskDetailPage-page"}>
            <Group orientation="horizontal" className={"TaskDetailPage-content"}>
                <Panel minSize={300} className={"TaskDetailPage-mainCol"}>
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
                    <section className={"TaskDetailPage-description"}>
                        <div className={"TaskDetailPage-sectionTitle"}>
                            <FontAwesomeIcon icon={faExclamationCircle} />
                            Instructions
                        </div>
                        <p>{task.taskDescription || "No instructions provided."}</p>
                    </section>

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
                </Panel>
                <Separator className='separator vertical'>
                    <FontAwesomeIcon icon={faGripLinesVertical} size="lg" />  
                </Separator>
                <Panel minSize={200} className={"TaskDetailPage-sideCol"}>
                    <Group orientation="vertical">
                        <Panel className={"TaskDetailPage-taskfile"} onClick={()=>setFileInFocus(!fileInFocus)}>
                            <input type="checkbox" id="CheckBox" checked={fileInFocus}/>
                            <div className="Taskfile-Overly">
                                <h3>GACS 2.0 is Under development</h3>
                                <span>We are working on GACS to make it all in one place to work on your assingments without leaving the platform.</span>
                                <h5>Upcoming features</h5>
                                <ul>
                                    <li>Enhanced AI integration for real-time collaboration</li>
                                    <li>Improved file management and version control</li>
                                    <li>Streamlined submission process with automated grading</li>
                                </ul>
                                 
                                <span>Stay updated on our latest developments!</span>
                            </div>
                            <div className={"TaskDetailPage-fileContainer"}>
                                {/* <h3>{JSON.stringify(assignment)}</h3> */}

                                <div className='file header'>
                                    <span>Name</span><span>Date</span><span>Type</span><span>Size</span>
                                </div>
                                <div className='file'>
                                    <span><FontAwesomeIcon icon={faFolder} /> File Name</span><span>3/06/2026 2:03 AM</span><span>File Folder</span><span></span>
                                </div>
                                <div className='file'>
                                    <span><FontAwesomeIcon icon={faFolder} /> Solution</span><span>1/07/2026 3:40 PM</span><span>File Folder</span><span></span>
                                </div>
                                <div className='file'>
                                    <span><FontAwesomeIcon icon={faFilePdf} /> Answer</span><span>1/07/2026 3:53 PM</span><span>Microsoft Edge PDF Document</span><span>172 KB</span>
                                </div>
                            </div>
                            <div className="TaskDetailPage-Prompt">
                                <input type="text" className='TaskDetailPage-PromptInput' placeholder='Contribute to the assignment by using GACS AI' />
                            </div>
                        </Panel>
                        <Separator className='separator horizontal'>
                            <FontAwesomeIcon icon={faGripLines} size="lg" />
                        </Separator>
                        <Panel minSize={150} className={"TaskDetailPage-infoCard"}>
                            <Submissions />
                        </Panel>
                    </Group>
                </Panel>
            </Group>
        </div>
    );
}

export default TaskDetailPage;
