import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAssignments, fetchTasks, fetchGroupMembers, getAiBreakdown, createNewTask, updateTask } from '@services/authService';
import '../assets/css/AssignmentDetailPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowLeft, faClipboardList, faChevronRight, faMagicWandSparkles, faUserCircle, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

function DraggableTask({ task, id }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
        data: { task }
    });
    
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 999,
        opacity: isDragging ? 0.5 : 1,
    } : undefined;

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="AiTask-card">
            <FontAwesomeIcon icon={faGripVertical} className="AiTask-grip" />
            <div className="AiTask-info">
                <h4>{task.taskName}</h4>
                <p>{task.taskDescription}</p>
                <div className="AiTask-footer">
                    <span>Est: {task.estimatedHours}h</span>
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

    const loadData = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("currentUser"));
            setCurrentUser(user);

            const { data: allAssignments } = await fetchAssignments();
            const currentAss = allAssignments.find(a => a.id === assignmentId);
            setAssignment(currentAss);

            const { data: allTasks } = await fetchTasks();
            const assTasks = allTasks.filter(t => t.parentAssignment === assignmentId);
            setTasks(assTasks);

            const { data: groupMembers } = await fetchGroupMembers(groupId);
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

    const handleAiGenerate = async () => {
        setGenerating(true);
        try {
            const { data } = await getAiBreakdown(
                assignment.assignmentName,
                assignment.assignmentDescription,
                members.length
            );
            setAiTasks(data.tasks);
            setViewMode('ai');
            toast.success("AI generated a balanced task breakdown!");
        } catch (error) {
            toast.error("Failed to generate AI breakdown");
        } finally {
            setGenerating(false);
        }
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        
        if (over && active.data.current) {
            const { task } = active.data.current;
            const memberId = over.id;
            
            // If it's a new AI task
            if (active.id.toString().startsWith('ai-')) {
                const newTaskDetails = {
                    taskName: task.taskName,
                    taskDescription: task.taskDescription,
                    responsibleMember: memberId,
                    startDate: new Date().toISOString().split('T')[0],
                    deadLine: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week later
                    parentAssignment: assignmentId,
                    state: 'YET'
                };

                try {
                    const { response } = await createNewTask(newTaskDetails);
                    if (response.ok) {
                        toast.success(`Assigned "${task.taskName}" to member`);
                        setAiTasks(prev => prev.filter((_, idx) => `ai-${idx}` !== active.id));
                        loadData(); // Refresh task list
                    }
                } catch (error) {
                    toast.error("Failed to assign task");
                }
            } 
            // If it's an existing task being reassigned (could implement this too)
        }
    };

    if (loading) return <div className={"AssignmentDetailPage-loading"}>Loading assignment...</div>;
    if (!assignment) return <div className={"AssignmentDetailPage-error"}>Assignment not found</div>;

    const isOwner = assignment.creatorId === currentUser?.id;

    return (
        <div className={"AssignmentDetailPage-page"}>
            <header className={"AssignmentDetailPage-header"}>
                <div className="AssignmentDetailPage-headerTop">
                    <button className={"AssignmentDetailPage-backBtn"} onClick={() => navigate(`/group/${groupId}`)}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
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
                    <div>
                        <h1>{assignment.assignmentName}</h1>
                        <p>{assignment.assignmentDescription}</p>
                    </div>
                </div>
            </header>

            <main className={"AssignmentDetailPage-content"}>
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
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="ai"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="AssignmentDetailPage-aiView"
                        >
                            <DndContext onDragEnd={handleDragEnd}>
                                <div className="AiView-layout">
                                    <div className="AiView-pool">
                                        <h3>Generated Tasks</h3>
                                        <p className="AiView-subtitle">Drag tasks onto group members to assign them.</p>
                                        <div className="AiView-poolList">
                                            {aiTasks.map((task, idx) => (
                                                <DraggableTask key={`ai-${idx}`} id={`ai-${idx}`} task={task} />
                                            ))}
                                            {aiTasks.length === 0 && (
                                                <div className="AiView-allAssigned">
                                                    <FontAwesomeIcon icon={faMagicWandSparkles} size="2x" />
                                                    <p>All AI tasks have been assigned!</p>
                                                    <button className="btn-primary" onClick={handleAiGenerate}>Regenerate</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="AiView-members">
                                        <h3>Group Members</h3>
                                        <div className="AiView-memberList">
                                            {members.map(member => (
                                                <DroppableMember 
                                                    key={member.id} 
                                                    member={member} 
                                                    assignedTasks={tasks.filter(t => t.responsibleMember === member.id)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </DndContext>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

export default AssignmentDetailPage;
