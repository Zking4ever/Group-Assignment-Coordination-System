import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAssignments, fetchTasks, getGroupMembers, getAiBreakdown, createNewTask, updateTask, getGroupDetail } from '@services/authService';
import '../assets/css/AssignmentDetailPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowLeft, faClipboardList, faChevronRight, faMagicWandSparkles, faUserCircle, faGripVertical, faCopy, faCheck, faEdit, faPaperclip, faLink } from '@fortawesome/free-solid-svg-icons';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { formatRelativeDeadline } from '../utils/timeUtils';

function EditableAiTask({ task, index, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `ai-${index}`,
        data: { task },
        disabled: isEditing
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 999,
        opacity: isDragging ? 0.5 : 1,
    } : undefined;

    const handleBlur = (e) => {
        // Only close if the new focus is not inside the card
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsEditing(false);
        }
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            {...attributes} 
            {...listeners} 
            className={`AiTask-card ${isEditing ? 'editing' : ''}`}
            onBlur={handleBlur}
        >
            {!isEditing && <FontAwesomeIcon icon={faGripVertical} className="AiTask-grip" />}
            <div className="AiTask-info">
                {isEditing ? (
                    <>
                        <input 
                            className="AiTask-nameInput" 
                            name="taskName"
                            value={task.taskName} 
                            autoFocus
                            onChange={(e) => onUpdate(index, { ...task, taskName: e.target.value })}
                        />
                        <textarea 
                            className="AiTask-descInput" 
                            name="taskDescription"
                            value={task.taskDescription} 
                            onChange={(e) => onUpdate(index, { ...task, taskDescription: e.target.value })}
                        />
                    </>
                ) : (
                    <>
                        <div className="AiTask-titleRow">
                            <h4>{task.taskName}</h4>
                            <button className="AiTask-editBtn" onClick={() => setIsEditing(true)}>
                                <FontAwesomeIcon icon={faEdit} />
                            </button>
                        </div>
                        <p>{task.taskDescription}</p>
                    </>
                )}
                
                <div className="AiTask-footer">
                    <span>Est: </span>
                    {isEditing ? (
                        <input 
                            type="number" 
                            className="AiTask-hourInput" 
                            value={task.estimatedHours} 
                            onChange={(e) => onUpdate(index, { ...task, estimatedHours: e.target.value })}
                        />
                    ) : (
                        <strong>{task.estimatedHours}</strong>
                    )}
                    <span>h</span>
                </div>
            </div>
        </div>
    );
}

function DroppableMember({ member, assignedTasks }) {
    const { isOver, setNodeRef } = useDroppable({
        id: member.id,
    });

    const style = {
        backgroundColor: isOver ? 'var(--primary-light)' : 'transparent',
        borderColor: isOver ? 'var(--primary-color)' : 'var(--border-color)',
    };

    return (
        <div ref={setNodeRef} style={style} className="MemberDrop-card">
            <div className="MemberDrop-info">
                <FontAwesomeIcon icon={faUserCircle} className="MemberDrop-icon" />
                <span>{member.firstName} {member.lastName}</span>
            </div>
            <div className="MemberDrop-tasks">
                {assignedTasks.length > 0 ? (
                    assignedTasks.map(t => (
                        <div key={t.id} className="MemberDrop-taskItem">
                            {t.taskName}
                        </div>
                    ))
                ) : (
                    <span className="MemberDrop-empty">No tasks assigned</span>
                )}
            </div>
        </div>
    );
}

function AssignmentDetailPage() {
    const { groupId, assignmentId } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [aiTasks, setAiTasks] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'ai'

    // New Feature States
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState("");
    const [showFullDesc, setShowFullDesc] = useState(false);
    const [copying, setCopying] = useState(false);
    const [groupCode, setGroupCode] = useState("");

    const loadData = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("currentUser"));
            setCurrentUser(user);

            const { data: allAssignments } = await fetchAssignments();
            const currentAss = allAssignments.find(a => a.id === assignmentId);
            setAssignment(currentAss);
            setEditedTitle(currentAss.assignmentName);

            // Fetch group to get invite code
            const { data: group } = await getGroupDetail(groupId);
            setGroupCode(group.inviteCode);

            const { data: allTasks } = await fetchTasks();
            const assTasks = allTasks.filter(t => t.parentAssignment === assignmentId);
            setTasks(assTasks);

            const groupMembers = await getGroupMembers(groupId);
            setMembers(groupMembers);
        } catch (error) {
            console.error("Failed to load assignment details:", error);
            toast.error("Error loading page data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [assignmentId]);

    const handleCopyCode = () => {
        navigator.clipboard.writeText(groupCode);
        setCopying(true);
        setTimeout(() => setCopying(false), 2000);
        toast.success("Invite code copied!");
    };

    const handleUpdateTitle = async () => {
        if (!editedTitle.trim()) return setIsEditingTitle(false);
        try {
            // Re-using createNewTask logic or just a manual update if service not ready
            // But we can just use setAssignment locally for now and implement the API call later
            // Better to use fetchAssignments to update or specific patch
            setAssignment(prev => ({ ...prev, assignmentName: editedTitle }));
            setIsEditingTitle(false);
            toast.success("Title updated!");
        } catch (err) {
            toast.error("Failed to update title");
        }
    };

    // ... handleAiGenerate and handleDragEnd remain same ...
    const handleAiGenerate = async () => {
        setGenerating(true);
        try {
            const { data } = await getAiBreakdown(
                assignment.assignmentName,
                assignment.assignmentDescription,
                members.length,
                assignment.guidelinesText
            );
            if (data.error) {
                toast.error(data.error);
                return;
            }
            setAiTasks(data.tasks);
            setViewMode('ai');
            toast.success("AI generated a balanced task breakdown!");
        } catch (error) {
            toast.error("Failed to generate AI breakdown");
        } finally {
            setGenerating(false);
        }
    };

    const [confirmingTask, setConfirmingTask] = useState(null);

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (over && active.data.current) {
            const { task } = active.data.current;
            const memberId = over.id;
            const member = members.find(m => m.id === memberId);

            if (active.id.toString().startsWith('ai-')) {
                setConfirmingTask({
                    ...task,
                    responsibleMember: memberId,
                    memberName: `${member.firstName} ${member.lastName}`,
                    startDate: new Date().toISOString().split('T')[0],
                    deadLine: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    aiIndex: active.id
                });
            }
        }
    };

    const confirmTaskAssignment = async () => {
        const newTaskDetails = {
            taskName: confirmingTask.taskName,
            taskDescription: confirmingTask.taskDescription,
            responsibleMember: confirmingTask.responsibleMember,
            startDate: confirmingTask.startDate,
            deadLine: confirmingTask.deadLine,
            parentAssignment: assignmentId,
            state: 'yet'
        };

        try {
            const { response } = await createNewTask(newTaskDetails);
            if (response.ok) {
                toast.success(`Assigned "${confirmingTask.taskName}" to ${confirmingTask.memberName}`);
                setAiTasks(prev => prev.filter((_, idx) => `ai-${idx}` !== confirmingTask.aiIndex));
                setConfirmingTask(null);
                loadData();
            }
        } catch (error) {
            toast.error("Failed to assign task");
        }
    };

    if (loading) return <div className={"AssignmentDetailPage-loading"}>Loading assignment...</div>;
    if (!assignment) return <div className={"AssignmentDetailPage-error"}>Assignment not found</div>;

    const isOwner = assignment.creatorId === currentUser?.id;

    return (
        <div className={"AssignmentDetailPage-page"}>
            <header className={"AssignmentDetailPage-header"}>
                <div className="AssignmentDetailPage-headerTop">
                    <div className="Header-leftActions">
                        <button className={"AssignmentDetailPage-backBtn"} onClick={() => navigate(`/group/${groupId}`)}>
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                        <div className="GroupCode-badge" onClick={handleCopyCode}>
                            <span className="Code-label">INVITE CODE:</span>
                            <span className="Code-value">{groupCode}</span>
                            <FontAwesomeIcon icon={copying ? faCheck : faCopy} className="Copy-icon" />
                        </div>
                    </div>
                    <div className="AssignmentDetailPage-viewToggles">
                        <button
                            className={`AssignmentDetailPage-viewBtn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            Overview
                        </button>
                        {isOwner && (
                            <button
                                className={`AssignmentDetailPage-viewBtn ${viewMode === 'ai' ? 'active' : ''}`}
                                onClick={() => aiTasks.length > 0 ? setViewMode('ai') : handleAiGenerate()}
                                disabled={generating}
                            >
                                {generating ? 'Generating...' : (aiTasks.length > 0 ? 'AI Assistant' : 'Generate with AI')}
                                {!generating && <FontAwesomeIcon icon={faMagicWandSparkles} style={{ marginLeft: '8px' }} />}
                            </button>
                        )}
                    </div>
                </div>
                <div className={"AssignmentDetailPage-headerInfo"}>
                    <FontAwesomeIcon icon={faClipboardList} className={"AssignmentDetailPage-icon"} />
                    <div className="HeaderInfo-text">
                        {isEditingTitle && isOwner ? (
                            <div className="Title-editGroup">
                                <input
                                    className="Title-input"
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                    autoFocus
                                    onBlur={handleUpdateTitle}
                                    onKeyDown={(e) => e.key === 'Enter' && handleUpdateTitle()}
                                />
                                <button className="Title-saveBtn" onClick={handleUpdateTitle}>Save</button>
                            </div>
                        ) : (
                            <h1 onClick={() => isOwner && setIsEditingTitle(true)}>
                                {assignment.assignmentName}
                                </h1>
                        )}
                        <div className="Header-badges">
                            <span className="Badge-info">
                                <FontAwesomeIcon icon={faMagicWandSparkles} /> AI Enabled
                            </span>
                            {(assignment.guidelinesText || assignment.guidelinesFile) && (
                                <span className="Badge-guideline">
                                    <FontAwesomeIcon icon={faPaperclip} /> Guidelines Included
                                </span>
                            )}
                        </div>
                        <div className={`Description-wrapper ${showFullDesc ? 'expanded' : ''}`}>
                            <p>{assignment.assignmentDescription}</p>
                            {assignment.assignmentDescription.length > 150 && (
                                <button className="Desc-toggle" onClick={() => setShowFullDesc(!showFullDesc)}>
                                    {showFullDesc ? 'Show less' : 'Read more...'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className={"AssignmentDetailPage-content"}>
                <div className="AssignmentDetailPage-mainGrid">
                    <div className="AssignmentDetailPage-leftCol">
                        <AnimatePresence mode="wait">
                            {viewMode === 'list' ? (
                                <motion.div
                                    key="list"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className={"AssignmentDetailPage-taskSection"}
                                >
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
                                            tasks.map(task => {
                                                const isWorking = task.state === 'working';
                                                const expiryDate = task.workExpiryTime ? new Date(task.workExpiryTime) : null;
                                                const isExpired = expiryDate && expiryDate < new Date();

                                                return (
                                                    <div
                                                        key={task.id}
                                                        className={`AssignmentDetailPage-taskCard ${isWorking ? 'working-active' : ''}`}
                                                        onClick={() => navigate(`/group/${groupId}/assignment/${assignmentId}/task/${task.id}`)}
                                                    >
                                                        <div className={"AssignmentDetailPage-taskInfo"}>
                                                            <div className="Task-titleRow">
                                                                <h3>{task.taskName}</h3>
                                                                {isWorking && !isExpired && (
                                                                    <div className="Task-timerBadge">
                                                                        <span className="Pulse-dot"></span>
                                                                        ACTIVE: 20m
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className={"AssignmentDetailPage-meta"}>
                                                                <span className={`${"AssignmentDetailPage-status"} ${("AssignmentDetailPage-" + (task.state?.toLowerCase()))}`}>
                                                                    {task.state}
                                                                </span>
                                                                <span className={"AssignmentDetailPage-date"}>{formatRelativeDeadline(task.deadLine)}</span>
                                                            </div>
                                                        </div>
                                                        <FontAwesomeIcon icon={faChevronRight} className={"AssignmentDetailPage-arrow"} />
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="ai"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="AssignmentDetailPage-aiView"
                                >
                                    <div className="AiView-header">
                                        <h3>AI Generated Drafts</h3>
                                        <p>Edit details before dragging to a member</p>
                                    </div>
                                    <div className="AiView-tasks">
                                        {aiTasks.map((task, idx) => (
                                            <EditableAiTask 
                                                key={`ai-${idx}`} 
                                                task={task} 
                                                index={idx} 
                                                onUpdate={(i, updated) => {
                                                    const newTs = [...aiTasks];
                                                    newTs[i] = updated;
                                                    setAiTasks(newTs);
                                                }}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <aside className="AssignmentDetailPage-rightCol">
                        <div className="Guidelines-panel">
                            <h3>Project Guidelines</h3>
                            <div className="Guidelines-content">
                                {assignment.guidelinesText || assignment.guidelinesFile || assignment.guidelinesLink ? (
                                    <>
                                        {assignment.guidelinesText && <p className="Guidelines-text">{assignment.guidelinesText}</p>}
                                        <div className="Guidelines-links">
                                            {assignment.guidelinesFile && (
                                                <a href={`http://localhost:5000${assignment.guidelinesFile}`} target="_blank" rel="noreferrer" className="Guideline-attachment">
                                                    <FontAwesomeIcon icon={faPaperclip} /> Reference Doc
                                                </a>
                                            )}
                                            {assignment.guidelinesLink && (
                                                <a href={assignment.guidelinesLink} target="_blank" rel="noreferrer" className="Guideline-attachment">
                                                    <FontAwesomeIcon icon={faLink} /> External Link
                                                </a>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <p className="Guidelines-empty">No guidelines provided yet.</p>
                                )}

                                {isOwner && (
                                    <button
                                        className="btn-secondary btn-sm"
                                        style={{ marginTop: '16px', width: '100%' }}
                                        onClick={() => navigate(`/group/${groupId}/assignment/${assignmentId}/editGuidelines`)}
                                    >
                                        Edit Guidelines
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="Activity-panel">
                            <h3>Recent Activity</h3>
                            {/* Integrate NotificationCenter here or a summary */}
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Real-time updates will appear here.</p>
                        </div>
                    </aside>
                </div>
            </main>

            {confirmingTask && (
                <div className="TaskConfirm-overlay">
                    <div className="TaskConfirm-modal">
                        <h3>Confirm Assignment</h3>
                        <p>Assigning to <strong>{confirmingTask.memberName}</strong></p>
                        
                        <div className="Form-group">
                            <label>Task Name</label>
                            <input 
                                value={confirmingTask.taskName} 
                                onChange={(e) => setConfirmingTask({...confirmingTask, taskName: e.target.value})}
                            />
                        </div>
                        
                        <div className="Form-group">
                            <label>Instructions</label>
                            <textarea 
                                value={confirmingTask.taskDescription} 
                                onChange={(e) => setConfirmingTask({...confirmingTask, taskDescription: e.target.value})}
                            />
                        </div>

                        <div className="Form-row">
                            <div className="Form-group">
                                <label>Deadline</label>
                                <input 
                                    type="date"
                                    value={confirmingTask.deadLine} 
                                    onChange={(e) => setConfirmingTask({...confirmingTask, deadLine: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="Modal-actions">
                            <button className="btn-cancel" onClick={() => setConfirmingTask(null)}>Cancel</button>
                            <button className="btn-confirm" onClick={confirmTaskAssignment}>Finalize Assignment</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AssignmentDetailPage;
