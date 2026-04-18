import '../assets/css/TaskCreate.css';
import { createNewAss, createNewTask, fetchGroupMembers } from '@services/authService';
import toast from 'react-hot-toast';
import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faAlignLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';

function TaskCreate({ type = "task" }) {
    const navigate = useNavigate();
    const { groupId, assignmentId } = useParams();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [taskDetail, setDetail] = useState({
        taskName: "",
        taskDescription: "",
        responsibleMember: "",
        startDate: new Date().toISOString().split("T")[0],
        deadLine: "",
        state: "YET",
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        setCurrentUser(user);

        const loadMembers = async () => {
            if (!groupId) return;
            try {
                const { data: members } = await fetchGroupMembers(groupId);
                setUsers(members);
            } catch (error) {
                console.error(error);
            }
        };
        loadMembers();
    }, [groupId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetail(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        try {
            if (type === "assignment") {
                const newAss = {
                    assignmentName: taskDetail.taskName,
                    assignmentDescription: taskDetail.taskDescription,
                    parentGroup: groupId,
                    creatorId: currentUser.id
                };
                const { response } = await createNewAss(newAss);
                if (response.ok) {
                    navigate(`/group/${groupId}`);
                } else {
                    toast.error("Failed to create assignment.");
                }
            } else {
                const newTask = {
                    ...taskDetail,
                    parentAssignment: assignmentId
                };
                const { response } = await createNewTask(newTask);
                if (response.ok) {
                    navigate(-1);
                } else {
                    toast.error("Failed to create task.");
                }
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    const isAssignment = type === "assignment";

    return (
        <div className={"TaskCreate-page"}>
            <header className={"TaskCreate-header"}>
                <div className={"TaskCreate-headerLeft"}>
                    <button className={"TaskCreate-closeBtn"} onClick={() => navigate(-1)}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                    <h2>{isAssignment ? 'Create Assignment' : 'Create Task'}</h2>
                </div>
                <button
                    className={"TaskCreate-assignBtn"}
                    onClick={handleSubmit}
                    disabled={loading || !taskDetail.taskName || (!isAssignment && !taskDetail.responsibleMember)}
                >
                    {loading ? 'Processing...' : (isAssignment ? 'Create' : 'Assign')}
                </button>
            </header>

            <form className={"TaskCreate-form"} onSubmit={handleSubmit}>
                <div className={"TaskCreate-mainColumn"}>
                    <div className={"TaskCreate-inputGroup"}>
                        <input
                            type="text"
                            name="taskName"
                            placeholder={isAssignment ? "Assignment title" : "Task title"}
                            className={"TaskCreate-titleInput"}
                            value={taskDetail.taskName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={"TaskCreate-inputGroup"}>
                        <div className={"TaskCreate-iconLabel"}>
                            <FontAwesomeIcon icon={faAlignLeft} />
                            <span>{isAssignment ? "Description" : "Instructions"} (optional)</span>
                        </div>
                        <textarea
                            name="taskDescription"
                            placeholder={isAssignment ? "Add a description for this assignment" : "Add instructions for this task"}
                            className={"TaskCreate-descriptionInput"}
                            value={taskDetail.taskDescription}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {!isAssignment && (
                    <div className={"TaskCreate-sideColumn"}>
                        <div className={"TaskCreate-settingsGroup"}>
                            <div className={"TaskCreate-setting"}>
                                <label>Assignee</label>
                                <select
                                    name="responsibleMember"
                                    value={taskDetail.responsibleMember}
                                    onChange={handleChange}
                                    className={"TaskCreate-select"}
                                    required
                                >
                                    <option value="">Select member</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={"TaskCreate-setting"}>
                                <label>Due</label>
                                <input
                                    type="date"
                                    name="deadLine"
                                    className={"TaskCreate-dateInput"}
                                    value={taskDetail.deadLine}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className={"TaskCreate-setting"}>
                                <label>Status</label>
                                <select
                                    name="state"
                                    value={taskDetail.state}
                                    onChange={handleChange}
                                    className={"TaskCreate-select"}
                                >
                                    <option value="YET">Yet to start</option>
                                    <option value="WORKING">Working</option>
                                    <option value="DONE">Done</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}

export default TaskCreate;
