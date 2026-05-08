import '../assets/css/TaskDetailPage.css';
import React, { useState, useEffect, useRef } from 'react'
import { Panel,Group, Separator } from 'react-resizable-panels'
import { useParams, useNavigate } from 'react-router-dom'
import { getTaskDetail, updateTask, submitTask, getAssignmentDetail, recordWorkTime } from '@services/Service'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheckCircle, faClock, faUserCircle, faExclamationCircle, faFileUpload, faLink, faFileAlt, faTimes, faCheck, faRedo, faPlay, faPause,faGripLines,faGripLinesVertical, faFolder,faFilePdf,faStop } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { formatRelativeDeadline } from '../utils/timeUtils';
import Submissions from '../components/Submissions';

function TaskDetailPage() {
    const { groupId, assignmentId, taskId } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);
    const [hasWorked,setHasWorked] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [width,setWidth] = useState(null);

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

    useEffect(()=>{
        setWidth(window.innerWidth>620? 'large':'small');
        window.addEventListener('resize',()=>{
            setWidth(window.innerWidth>620? 'large':'small');
        })

        return () => window.removeEventListener('resize',()=>{
            setWidth(window.innerWidth>620? 'large':'small');
        })
    })

    const handleStart = async () => {
        task.state = 'working';
        timerRef.current = 20*60; //20m;
        setTimeLeft(20 * 60);
    };

    const handleStop = async () => {
        task.state = 'stopped';
        setTimeLeft(20 * 60);
        timerRef.current = 20 * 60;
        loadTask();
    }

    const handleSessionEnd = async () => {
        await recordWorkTime(taskId, currentUser.id);
        setHasWorked(true);
        toast("Work session expired. Progress recorded.", { icon: '⏰' });

        loadTask(); // Refresh to see state change from server if any
    };

    const handleSubmitWork = async (e) => {
        e.preventDefault();
        // if(!hasWorked){
        //     toast.error("You need at least to work one session to submit");
        //     return;
        // }
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("report", report);
        formData.append("link", link);
        formData.append("assignmentId",assignmentId);
        if (file) formData.append("file", file);

        try {
            const response = await submitTask(taskId, formData);
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


    if (loading) return <div className={"TaskDetailPage-loading"}>Loading task details...</div>;
    if (!task) return <div className={"TaskDetailPage-error"}>Task not found</div>;

    const isResponsible = task.responsibleMemberId === currentUser?.id;

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };
    
    return (
        <div className={"TaskDetailPage-page"}>
            <Group orientation={(width === 'large') ? 'horizontal' : 'vertical'} className={"TaskDetailPage-content"}>
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
                        <div className={"TaskDetailPage-container"}>
                            <div className={"TaskDetailPage-sectionTitle"}><FontAwesomeIcon icon={faExclamationCircle} />Instructions</div>
                            <div>
                                {(task.state === 'yet' || task.state === 'REJECTED' || task.state === 'stopped') && isResponsible && (
                                    <button className={"TaskDetailPage-primaryBtn"} onClick={ () => handleStart() }>
                                        <FontAwesomeIcon icon={faPlay} /> Start working (20min)
                                    </button>
                                )}
                                {task.state === 'working' && isResponsible && (
                                    <div className="Timer-display">
                                        <div className="Timer-countdown">{formatTime(timeLeft)}</div>
                                        <div style={{display:'flex'}}>
                                            <button className="TaskDetailPage-primaryBtn" onClick={() => setIsPaused(!isPaused)}><FontAwesomeIcon icon={isPaused ? faPlay : faPause} /></button>
                                            <button className="TaskDetailPage-primaryBtn" onClick={() => handleStop()}><FontAwesomeIcon icon={faStop} /></button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <p>{task.taskDescription || "No instructions provided."}</p>
                    </section>

                    {isResponsible && (task.state === 'submitted') && (
                        <div className={"TaskDetailPage-verification"}>
                            <FontAwesomeIcon icon={faCheck} style={{color:'#ffca00ed'}}/> 
                            <div className={"TaskDetailPage-sectionTitle"} style={{color:'#ffca00ed',fontWeight:'bold',fontSize:20}}>Submitted</div>
                            <p>Your submission is being reviewed by the assignment owner. You will receive feedback once it's evaluated.</p>
                        </div>
                    )}
                    {isResponsible && (task.state === 'completed') && (
                        <div className={"TaskDetailPage-verification"}>
                            <FontAwesomeIcon icon={faCheck} style={{color:'lightgreen'}}/> 
                            <div className={"TaskDetailPage-sectionTitle"} style={{color:'lightgreen',fontWeight:'bold',fontSize:20}}>Completed</div>
                            <p> The task has been completed and received final approval </p>
                        </div>
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
                </Panel>
                <Separator className='separator vertical'>
                    <FontAwesomeIcon icon={faGripLinesVertical} size="lg" />  
                </Separator>
                <Panel minSize={(width=='large' ? 350 : 0)} defaultSize={(width=='large' ? 520 : 0)} className={"TaskDetailPage-sideCol"}>
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
                                    <li>Chatting with users, track changes, notifications integration</li>
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
            {(width === 'small') && (
                <div>
                    <Submissions />
                </div>
            )}
        </div>
    );
}

export default TaskDetailPage;
